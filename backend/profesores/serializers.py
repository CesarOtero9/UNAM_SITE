# profesores/serializers.py

from rest_framework import serializers
from .models import Profesor

class ProfesorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profesor

        fields = [
            'id',
            'nombre',
            'apellido_paterno',
            'apellido_materno',
            'correo',
            'telefono',
            'calle',
            'numero_exterior',
            'numero_interior',
            'colonia',
            'codigo_postal',
            'municipio',
            'entidad',
            'especialidad',
            'numero_trabajador',
            'rfc',
            'genero',
            'categoria',
            'grado_academico',
            'fecha_ingreso',
        ]

