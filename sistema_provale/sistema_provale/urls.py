
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('beneficiarios/', include('beneficiarios.urls')),
    path('distribucion/', include('distribucion.urls')),
    path('personas/', include('personas.urls')),
    path('asociaciones/', include('asociaciones.urls')),
    path('inventario/', include('inventario.urls')),
    path('', include('usuarios.urls')),
]
