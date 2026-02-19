from django.contrib import admin
from .models import TipoLocal, Asociacion, Reconocimiento, Cargo, Directiva


@admin.register(TipoLocal)
class TipoLocalAdmin(admin.ModelAdmin):
    list_display = ('cod_tipo_local', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Asociacion)
class AsociacionAdmin(admin.ModelAdmin):
    list_display = ('cod_asociacion', 'codigo_asociacion', 'nombre_asociacion', 'sector_zona', 'estado', 'fecha_registro')
    search_fields = ('codigo_asociacion', 'nombre_asociacion')
    list_filter = ('estado', 'tipo_local')
    ordering = ('nombre_asociacion',)


@admin.register(Reconocimiento)
class ReconocimientoAdmin(admin.ModelAdmin):
    list_display = ('cod_reconocimiento', 'asociacion', 'documento', 'fecha_inicio', 'fecha_fin', 'estado')
    search_fields = ('documento', 'asociacion__nombre_asociacion')
    list_filter = ('estado',)
    ordering = ('-fecha_inicio',)


@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('cod_cargo', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Directiva)
class DirectivaAdmin(admin.ModelAdmin):
    list_display = ('cod_directiva', 'reconocimiento', 'socio', 'cargo', 'estado', 'fecha_registro')
    search_fields = ('socio__persona__nombres', 'cargo__descripcion')
    list_filter = ('estado', 'cargo')
    ordering = ('reconocimiento', 'cargo')