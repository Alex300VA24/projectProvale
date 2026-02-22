from django.urls import path
from . import views

app_name = 'personas'

urlpatterns = [
    path('socios/', views.socios_index, name='socios_index'),
]
