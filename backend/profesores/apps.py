from django.apps import AppConfig


class ProfesoresConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'profesores'

    def ready(self):
        from . import signals # 👈 importante
