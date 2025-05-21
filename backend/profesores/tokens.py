# profesores/tokens.py
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    # Obtén el primer grupo como rol (si existe)
    role = user.groups.first().name if user.groups.exists() else 'SinRol'

    # Agrega el rol al token
    refresh["role"] = role

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'role': role
    }
