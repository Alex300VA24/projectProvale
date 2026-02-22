from django.urls import path
from . import views

app_name = 'inventario'

urlpatterns = [
    path('productos/', views.productos_index, name='productos_index'),
    path('movimientos/', views.movimientos_index, name='movimientos_index'),
]
