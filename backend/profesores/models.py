# backend/profesores/models.py

from django.db import models# backend/profesores/models.py

from django.db import models

class Profesor(models.Model):
    # Opciones para los desplegables
    GENERO_CHOICES = [
        ('Masculino', 'Masculino'),
        ('Femenino', 'Femenino'),
        ('No binario', 'No binario'),
        ('Otro', 'Otro'),
    ]
    CATEGORIA_CHOICES = [
        ('Definitivo', 'Definitivo'),
        ('Tiempo Completo', 'Tiempo Completo'),
        ('Otro', 'Otro'),
    ]
    GRADO_ACADEMICO_CHOICES = [
        ('Licenciatura', 'Licenciatura'),
        ('Maestría', 'Maestría'),
        ('Doctorado', 'Doctorado'),
        ('Hibrido', 'Hibrido'),
        ('Otro', 'Otro'),
    ]

    # Datos personales básicos
    nombre            = models.CharField(max_length=100)
    apellido_paterno  = models.CharField(max_length=100)
    apellido_materno  = models.CharField(max_length=100)
    correo            = models.EmailField(unique=True)
    telefono          = models.CharField(max_length=20)

    # Dirección (permitimos NULL para migrar fácilmente)
    calle             = models.CharField("Calle", max_length=200, blank=True, null=True)
    numero_exterior   = models.CharField("Número exterior", max_length=50, blank=True, null=True)
    numero_interior   = models.CharField("Número interior", max_length=50, blank=True, null=True)
    colonia           = models.CharField("Colonia", max_length=100, blank=True, null=True)
    codigo_postal     = models.CharField("Código postal", max_length=10, blank=True, null=True)
    municipio         = models.CharField("Municipio/Delegación", max_length=100, blank=True, null=True)
    entidad           = models.CharField("Entidad federativa", max_length=100, blank=True, null=True)

    # Datos académicos y de nómina
    especialidad      = models.CharField(max_length=200)
    numero_trabajador = models.CharField("Número de trabajador", max_length=50, unique=True)
    rfc               = models.CharField("RFC", max_length=13, unique=True)

    # Campos con opciones fijas
    genero            = models.CharField("Género", max_length=20, choices=GENERO_CHOICES)
    categoria         = models.CharField("Categoría", max_length=50, choices=CATEGORIA_CHOICES)
    grado_academico   = models.CharField("Grado académico", max_length=50, choices=GRADO_ACADEMICO_CHOICES)

    # Fecha
    fecha_ingreso     = models.DateField("Fecha de ingreso")

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno} {self.apellido_materno}"
