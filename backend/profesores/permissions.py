from rest_framework.permissions import BasePermission

# profesores/permissions.py
from rest_framework.permissions import BasePermission

class EsAdministrador(BasePermission):
    """
    Permite solo a:
      Usuarios en el grupo 'Administrador'
      Usuarios con is_superuser=True
    """
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        return user.groups.filter(name='Administrador').exists()


class EsUsuarioEstandar(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Usuario').exists()
