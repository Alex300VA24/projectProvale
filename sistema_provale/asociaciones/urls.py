from django.urls import path
from . import views

app_name = 'asociaciones'

urlpatterns = [
    path('club-madres/', views.club_madres_index, name='club_madres_index'),
    path('reconocimientos/', views.reconocimientos_index, name='reconocimientos_index'),
]
