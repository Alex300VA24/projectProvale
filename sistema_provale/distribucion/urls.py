from django.urls import path
from . import views

app_name = 'distribucion'

urlpatterns = [
    path('', views.index, name='index'),
    path('nuevo/', views.create, name='create'),
    path('<int:id>/editar/', views.edit, name='edit'),
]
