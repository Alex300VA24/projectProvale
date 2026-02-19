from django.contrib import admin
from .models import Pecosa, DetallePecosa


class DetallePecosaInline(admin.TabularInline):
    model = DetallePecosa
    extra = 1
    fields = ('producto', 'prioridad', 'cantidad', 'precio_unitario', 'fecha_desde', 'fecha_hasta')
    readonly_fields = ('fecha_registro',)


@admin.register(Pecosa)
class PecosaAdmin(admin.ModelAdmin):
    list_display = ('cod_pecosa', 'numero_pecosa', 'asociacion', 'socio_presidenta', 'estado', 'fecha_reparto', 'fecha_registro')
    search_fields = ('numero_pecosa', 'asociacion__nombre_asociacion')
    list_filter = ('estado', 'asociacion')
    ordering = ('-fecha_registro',)
    inlines = [DetallePecosaInline]


@admin.register(DetallePecosa)
class DetallePecosaAdmin(admin.ModelAdmin):
    list_display = ('cod_detalle_pecosa', 'pecosa', 'producto', 'cantidad', 'precio_unitario', 'prioridad')
    search_fields = ('producto__descripcion', 'pecosa__numero_pecosa')
    list_filter = ('producto',)
    ordering = ('pecosa', 'prioridad')