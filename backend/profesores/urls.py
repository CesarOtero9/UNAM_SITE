# profesores/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfesorViewSet, CargarCSVProfesoresView

# ✅ Este bloque estaba faltando
router = DefaultRouter()
router.register(r'profesores', ProfesorViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('cargar-csv/', CargarCSVProfesoresView.as_view(), name='cargar-csv'),
]