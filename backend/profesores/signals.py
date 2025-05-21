from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from profesores.models import Profesor  # Asegúrate que tu modelo se llame así

@receiver(post_migrate)
def crear_grupos_y_permisos(sender, **kwargs):
    # Crea o recupera los grupos
    superusuario, _ = Group.objects.get_or_create(name="Superusuario")
    admin, _ = Group.objects.get_or_create(name="Administrador")
    usuario, _ = Group.objects.get_or_create(name="Usuario")

    # ContentType del modelo Profesor
    profesor_ct = ContentType.objects.get_for_model(Profesor)

    # Permisos disponibles
    permisos_profesor = Permission.objects.filter(content_type=profesor_ct)

    # ----- Superusuario (todos los permisos) -----
    superusuario.permissions.set(permisos_profesor)

    # ----- Administrador (solo ver, agregar, cambiar) -----
    permisos_admin = permisos_profesor.filter(codename__in=[
        "view_profesor", "add_profesor", "change_profesor"
    ])
    admin.permissions.set(permisos_admin)

    # ----- Usuario (solo puede ver) -----
    permisos_usuario = permisos_profesor.filter(codename="view_profesor")
    usuario.permissions.set(permisos_usuario)

    print("✅ Grupos y permisos asignados correctamente.")
