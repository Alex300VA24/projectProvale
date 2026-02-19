from django.db import models
from core.models import Estado


class UnidadMedida(models.Model):
    """
    Tabla: UnidadMedida
    Unidades de medida de los productos del inventario
    (kg, litros, unidades, raciones, etc.).
    """
    cod_unidad_medida = models.AutoField(primary_key=True, db_column='codUnidadMedida')
    descripcion = models.CharField(max_length=100, db_column='descripcion')

    class Meta:
        db_table = 'UnidadMedida'
        verbose_name = 'Unidad de Medida'
        verbose_name_plural = 'Unidades de Medida'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class Producto(models.Model):
    """
    Tabla: Productos
    Productos del programa que se distribuyen a las asociaciones.
    El campo stock es histórico/referencial; el stock real
    se calcula desde Movimientos.
    """
    cod_producto = models.AutoField(primary_key=True, db_column='codProducto')
    unidad_medida = models.ForeignKey(
        UnidadMedida,
        on_delete=models.PROTECT,
        db_column='codUnidadMedida',
        related_name='productos'
    )
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    abreviatura = models.CharField(max_length=5, null=True, blank=True, db_column='abreviatura')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    stock = models.IntegerField(null=True, blank=True, db_column='stock')
    precio_unitario = models.DecimalField(
        max_digits=9, decimal_places=2,
        null=True, blank=True,
        db_column='precioUnitario'
    )
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='productos'
    )

    class Meta:
        db_table = 'Productos'
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['descripcion']

    def __str__(self):
        return f'{self.descripcion} ({self.unidad_medida})'

    def stock_real(self):
        """
        Calcula el stock actual sumando entradas y restando salidas
        desde la tabla Movimientos. Usar este método en lugar del
        campo stock cuando se necesite el valor actualizado.
        """
        from django.db.models import Sum, Case, When, IntegerField
        resultado = self.movimientos.aggregate(
            total=Sum(
                Case(
                    When(tipo_movimiento__descripcion='ENTRADA', then='cantidad'),
                    default=models.Value(0) - models.F('cantidad'),
                    output_field=IntegerField()
                )
            )
        )
        return resultado['total'] or 0


class TipoMovimiento(models.Model):
    """
    Tabla: TipoMovimiento
    Clasificación del movimiento de inventario (ENTRADA / SALIDA).
    """
    cod_tipo_movimiento = models.AutoField(primary_key=True, db_column='codTipoMovimiento')
    descripcion = models.CharField(max_length=100, db_column='descripcion')

    class Meta:
        db_table = 'TipoMovimiento'
        verbose_name = 'Tipo de Movimiento'
        verbose_name_plural = 'Tipos de Movimiento'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class Movimiento(models.Model):
    """
    Tabla: Movimientos
    Registro de cada entrada o salida de producto del inventario.
    precioTotal debe ser consistente con cantidad * precioUnitario.
    """
    cod_movimiento = models.AutoField(primary_key=True, db_column='codMovimiento')
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        db_column='codProducto',
        related_name='movimientos'
    )
    tipo_movimiento = models.ForeignKey(
        TipoMovimiento,
        on_delete=models.PROTECT,
        db_column='codTipoMovimiento',
        related_name='movimientos'
    )
    fecha_movimiento = models.DateTimeField(auto_now_add=True, db_column='fechaMovimiento')
    cantidad = models.IntegerField(db_column='cantidad')
    precio_unitario = models.DecimalField(max_digits=9, decimal_places=2, db_column='precioUnitario')
    precio_total = models.DecimalField(max_digits=9, decimal_places=2, db_column='precioTotal')

    class Meta:
        db_table = 'Movimientos'
        verbose_name = 'Movimiento'
        verbose_name_plural = 'Movimientos'
        ordering = ['-fecha_movimiento']

    def __str__(self):
        return f'{self.tipo_movimiento} | {self.producto} x{self.cantidad} ({self.fecha_movimiento:%Y-%m-%d})'

    def save(self, *args, **kwargs):
        """Calcula precio_total automáticamente antes de guardar."""
        self.precio_total = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)