from django.contrib import admin
from .models import Zona, Sector, SectorZona


@admin.register(Zona)
class ZonaAdmin(admin.ModelAdmin):
    list_display = ('cod_zona', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ('cod_sector', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(SectorZona)
class SectorZonaAdmin(admin.ModelAdmin):
    list_display = ('cod_sector_zona', 'zona', 'sector', 'fecha_registro')
    search_fields = ('zona__descripcion', 'sector__descripcion')
    list_filter = ('zona',)
    ordering = ('zona', 'sector')