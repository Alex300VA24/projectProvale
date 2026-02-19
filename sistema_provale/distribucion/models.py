from django.db import models
from core.models import Estado
from asociaciones.models import Asociacion
from personas.models import Socio
from inventario.models import Producto


class Pecosa(models.Model):
    """
    Tabla: Pecosas
    Documento de distribución (PECOSA = Pedido de Comprobante de Salida)
    emitido por asociación, con la presidenta responsable.
    CORRECCIÓN 3FN: FK a Estado ahora declarada explícitamente.
    """
    cod_pecosa = models.AutoField(primary_key=True, db_column='codPecosa')
    asociacion = models.ForeignKey(
        Asociacion,
        on_delete=models.PROTECT,
        db_column='codAsociacion',
        related_name='pecosas'
    )
    numero_pecosa = models.CharField(max_length=8, null=True, blank=True, db_column='numeroPecosa')
    socio_presidenta = models.ForeignKey(
        Socio,
        on_delete=models.PROTECT,
        db_column='codSocioPresidenta',
        related_name='pecosas_como_presidenta'
    )
    fecha_reparto = models.DateTimeField(null=True, blank=True, db_column='fechaReparto')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    observacion = models.CharField(max_length=255, null=True, blank=True, db_column='observacion')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='pecosas'
    )

    class Meta:
        db_table = 'Pecosas'
        verbose_name = 'PECOSA'
        verbose_name_plural = 'PECOSAS'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f'PECOSA {self.numero_pecosa or self.cod_pecosa} - {self.asociacion}'

    @property
    def total(self):
        """Suma del valor total de todos los productos en esta PECOSA."""
        return self.detalles.aggregate(
            total=models.Sum(
                models.ExpressionWrapper(
                    models.F('cantidad') * models.F('precio_unitario'),
                    output_field=models.DecimalField()
                )
            )
        )['total'] or 0


class DetallePecosa(models.Model):
    """
    Tabla: DetallePecosa
    Líneas de producto dentro de una PECOSA, con cantidad,
    precio unitario histórico y período de validez del precio.
    El precioUnitario aquí es el precio al momento del reparto
    (dato histórico intencional, no viola 3FN).
    """
    cod_detalle_pecosa = models.AutoField(primary_key=True, db_column='codDetallePecosa')
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT,
        db_column='codProducto',
        related_name='detalles_pecosa'
    )
    pecosa = models.ForeignKey(
        Pecosa,
        on_delete=models.CASCADE,
        db_column='codPecosa',
        related_name='detalles'
    )
    prioridad = models.IntegerField(db_column='prioridad')
    fecha_desde = models.DateTimeField(null=True, blank=True, db_column='fechaDesde')
    fecha_hasta = models.DateTimeField(null=True, blank=True, db_column='fechaHasta')
    cantidad = models.IntegerField(db_column='cantidad')
    precio_unitario = models.DecimalField(max_digits=9, decimal_places=2, db_column='precioUnitario')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'DetallePecosa'
        verbose_name = 'Detalle de PECOSA'
        verbose_name_plural = 'Detalles de PECOSA'
        ordering = ['prioridad']

    def __str__(self):
        return f'{self.pecosa} | {self.producto} x{self.cantidad}'

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario