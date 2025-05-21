#C:\Users\maqui\PycharmProjects\UNAM_SITE\backend\profesores\views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Profesor
from .serializers import ProfesorSerializer
from .permissions import EsAdministrador
import csv
import io
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
import csv
from io import TextIOWrapper
from .models import Profesor
from rest_framework.permissions import IsAuthenticated
from .permissions import EsAdministrador
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime




# Serializer personalizado para incluir el rol
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = self.user.username
        if self.user.is_superuser:
            data['role'] = 'Superusuario'
        elif self.user.groups.exists():
            data['role'] = self.user.groups.first().name
        else:
            data['role'] = 'Usuario'

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class ProfesorViewSet(viewsets.ModelViewSet):
    queryset = Profesor.objects.all()
    serializer_class = ProfesorSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), EsAdministrador()]

    def create(self, request, *args, **kwargs):
        # 1) Normalizar keys y valores (quita comillas y espacios)
        data = {
            k.strip().lower(): (v or '').strip().replace('"','').replace("'",'')
            for k, v in request.data.items()
        }

        # 2) Mapear dinámicamente usando tus constantes del modelo
        #    así nunca habrá errores de “no es una elección válida”
        genero_map    = {opt[0].lower(): opt[0] for opt in Profesor.GENERO_CHOICES}
        categoria_map = {opt[0].lower(): opt[0] for opt in Profesor.CATEGORIA_CHOICES}
        grado_map     = {opt[0].lower(): opt[0] for opt in Profesor.GRADO_ACADEMICO_CHOICES}

        raw = data.get  # shortcut
        # Género: “no binario”, “femenino”, “masculino” → exact match
        genero_key = raw('genero','').lower()
        data['genero'] = genero_map.get(genero_key, 'Otro')

        # Categoría
        cat_key = raw('categoria','').lower()
        data['categoria'] = categoria_map.get(cat_key, 'Otro')

        # Grado académico
        grado_key = raw('grado_academico','').lower()
        data['grado_academico'] = grado_map.get(grado_key, 'Otro')

        # 3) Parsear fecha a ISO (YYYY-MM-DD)
        fecha_raw = raw('fecha_ingreso','').replace('-', '/')
        parsed_date = None
        for fmt in ('%Y/%m/%d','%d/%m/%Y','%Y-%m-%d','%d-%m-%Y'):
            try:
                parsed_date = datetime.strptime(fecha_raw, fmt).date()
                break
            except ValueError:
                continue
        if parsed_date:
            data['fecha_ingreso'] = parsed_date.isoformat()
        # else mantenemos el valor original para que el serializer marque error

        # 4) Finalmente, corremos el serializer
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except IntegrityError:
                # Por ejemplo, RFC duplicado
                return Response(
                    {'rfc': ['Este RFC ya existe. Skipped.']},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Si no pasa validación, devolvemos los errores detallados
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CargarCSVProfesoresView(APIView):
    permission_classes = [IsAuthenticated, EsAdministrador]

    def post(self, request):
        csv_file = request.FILES.get('file')

        if not csv_file.name.endswith('.csv'):
            return Response({"error": "El archivo no es CSV"}, status=400)

        data_set = csv_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string)  # Saltar encabezado

        for row in csv.reader(io_string, delimiter=','):
            Profesor.objects.create(
                nombre=row[0],
                apellido_paterno=row[1],
                apellido_materno=row[2],
                genero=row[3],
                correo=row[4],
                telefono=row[5],
                direccion=row[6],
                grado_academico=row[7],
                especialidad=row[8],
                categoria=row[9],
                numero_trabajador=row[10],
                mfc=row[11],
                fecha_ingreso=row[12]
            )
        return Response({"message": "Archivo procesado correctamente"}, status=status.HTTP_201_CREATED)

class CargarCSVProfesoresView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated, EsAdministrador]

    def post(self, request, format=None):
        archivo = request.FILES.get('file')
        if not archivo or not archivo.name.lower().endswith('.csv'):
            return Response({'error': 'Por favor envía un archivo .csv válido.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # 1) Leemos todo el contenido como bytes
        raw_bytes = archivo.read()

        # 2) Probamos varios encodings, ¡incluyendo UTF-16!
        text = None
        for enc in ('utf-8-sig', 'utf-8', 'cp1252', 'latin1', 'utf-16', 'utf-16-le', 'utf-16-be'):
            try:
                text = raw_bytes.decode(enc)
                break
            except UnicodeDecodeError:
                continue

        if text is None:
            return Response(
                {'error': 'No pude decodificar el CSV; encoding desconocido.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) Armamos el lector usando StringIO
        lector = csv.DictReader(io.StringIO(text))

        insertados = 0
        errores = []

        # Generamos mapas para las choices de tu modelo
        genero_map    = {opt[0].lower(): opt[0] for opt in Profesor.GENERO_CHOICES}
        categoria_map = {opt[0].lower(): opt[0] for opt in Profesor.CATEGORIA_CHOICES}
        grado_map     = {opt[0].lower(): opt[0] for opt in Profesor.GRADO_ACADEMICO_CHOICES}

        # 4) Procesamos fila por fila
        for idx, fila in enumerate(lector, start=2):
            # Normalizamos keys y valores
            data = {
                k.strip().lower(): (v or '').strip().strip('"').strip("'")
                for k, v in fila.items()
            }

            # Mapear género
            data['genero'] = genero_map.get(data.get('genero','').lower(), 'Otro')
            # Mapear categoría
            data['categoria'] = categoria_map.get(data.get('categoria','').lower(), 'Otro')
            # Mapear grado académico
            data['grado_academico'] = grado_map.get(data.get('grado_academico','').lower(), 'Otro')

            # Parsear fecha en varios formatos
            fecha_raw = data.get('fecha_ingreso','').replace('-', '/')
            fecha = None
            for fmt in ('%Y/%m/%d','%d/%m/%Y','%Y-%m-%d','%d-%m-%Y'):
                try:
                    fecha = datetime.strptime(fecha_raw, fmt).date()
                    break
                except ValueError:
                    continue
            if not fecha:
                errores.append(f"Fila {idx}: formato de fecha inválido (‘{data.get('fecha_ingreso')}’)")
                continue
            data['fecha_ingreso'] = fecha

            # Intentamos crear el registro
            try:
                Profesor.objects.create(
                    nombre            = data.get('nombre',''),
                    apellido_paterno  = data.get('apellido_paterno',''),
                    apellido_materno  = data.get('apellido_materno',''),
                    correo            = data.get('correo',''),
                    telefono          = data.get('telefono',''),
                    calle             = data.get('calle',''),
                    numero_exterior   = data.get('numero_exterior',''),
                    numero_interior   = data.get('numero_interior',''),
                    colonia           = data.get('colonia',''),
                    codigo_postal     = data.get('codigo_postal',''),
                    municipio         = data.get('municipio',''),
                    entidad           = data.get('entidad',''),
                    especialidad      = data.get('especialidad',''),
                    numero_trabajador = data.get('numero_trabajador',''),
                    rfc               = data.get('rfc',''),
                    genero            = data['genero'],
                    categoria         = data['categoria'],
                    grado_academico   = data['grado_academico'],
                    fecha_ingreso     = data['fecha_ingreso'],
                )
                insertados += 1

            except IntegrityError:
                errores.append(f"Fila {idx}: RFC ‘{data.get('rfc')}’ ya existe y fue saltado.")
            except Exception as e:
                errores.append(f"Fila {idx}: {str(e)}")

        # 5) Devolvemos un resumen
        respuesta = {'insertados': insertados}
        if errores:
            respuesta['errores'] = errores

        return Response(respuesta, status=status.HTTP_201_CREATED)


