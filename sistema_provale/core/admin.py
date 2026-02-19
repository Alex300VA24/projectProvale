from django.contrib import admin
from .models import Estado, Rol


@admin.register(Estado)
class EstadoAdmin(admin.ModelAdmin):
    list_display = ('cod_estado', 'abreviatura', 'descripcion')
    search_fields = ('abreviatura', 'descripcion')
    ordering = ('descripcion',)


@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('cod_rol', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)
