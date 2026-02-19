from django.contrib import admin
from .models import Persona, Socio


@admin.register(Persona)
class PersonaAdmin(admin.ModelAdmin):
    list_display = ('cod_persona', 'apellido_paterno', 'apellido_materno', 'nombres', 'dni', 'sexo', 'fecha_nacimiento')
    search_fields = ('nombres', 'apellido_paterno', 'apellido_materno', 'dni')
    list_filter = ('sexo', 'sector_zona')
    ordering = ('apellido_paterno', 'apellido_materno', 'nombres')


@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    list_display = ('cod_socio', 'persona', 'asociacion', 'estado', 'fecha_inicio', 'fecha_fin')
    search_fields = ('persona__nombres', 'persona__apellido_paterno', 'asociacion__nombre_asociacion')
    list_filter = ('estado', 'asociacion')
    ordering = ('persona',)