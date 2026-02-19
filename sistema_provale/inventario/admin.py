from django.contrib import admin
from .models import UnidadMedida, Producto, TipoMovimiento, Movimiento


@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('cod_unidad_medida', 'descripcion')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('cod_producto', 'descripcion', 'unidad_medida', 'stock', 'precio_unitario', 'estado', 'fecha_registro')
    search_fields = ('descripcion', 'abreviatura')
    list_filter = ('estado', 'unidad_medida')
    ordering = ('descripcion',)


@admin.register(TipoMovimiento)
class TipoMovimientoAdmin(admin.ModelAdmin):
    list_display = ('cod_tipo_movimiento', 'descripcion')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Movimiento)
class MovimientoAdmin(admin.ModelAdmin):
    list_display = ('cod_movimiento', 'producto', 'tipo_movimiento', 'cantidad', 'precio_unitario', 'precio_total', 'fecha_movimiento')
    search_fields = ('producto__descripcion',)
    list_filter = ('tipo_movimiento', 'producto')
    ordering = ('-fecha_movimiento',)
    readonly_fields = ('precio_total',)