# profesores/admin.py
from django.contrib import admin
from .models import Profesor

@admin.register(Profesor)
class ProfesorAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'categoria']
    search_fields = ['nombre', 'apellido_paterno', 'apellido_materno', 'correo']
    list_filter = ['categoria', 'genero', 'grado_academico']
    ordering = ['apellido_paterno']
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'apellido_paterno', 'apellido_materno', 'genero', 'fecha_ingreso')
        }),
        ('Contacto', {
            'fields': ('correo', 'telefono')
        }),
        ('Dirección', {
            'fields': (
                'calle', 'numero_exterior', 'numero_interior',
                'colonia', 'codigo_postal', 'municipio', 'entidad'
            )
        }),
        ('Datos Profesionales', {
            'fields': ('grado_academico', 'especialidad', 'categoria', 'numero_trabajador', 'rfc')
        }),
    )
