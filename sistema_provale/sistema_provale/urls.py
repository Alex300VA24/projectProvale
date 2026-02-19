
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('beneficiarios/', include('beneficiarios.urls')),
    path('', include('usuarios.urls')),
]
