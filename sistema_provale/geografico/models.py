from django.db import models


class Zona(models.Model):
    cod_zona = models.AutoField(primary_key=True, db_column='codZona')
    descripcion = models.CharField(max_length=100, unique=True, null=True, blank=True, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Zonas'
        verbose_name = 'Zona'
        verbose_name_plural = 'Zonas'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion or f'Zona {self.cod_zona}'


class Sector(models.Model):
    cod_sector = models.AutoField(primary_key=True, db_column='codSector')
    descripcion = models.CharField(max_length=100, unique=True, null=True, blank=True, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Sectores'
        verbose_name = 'Sector'
        verbose_name_plural = 'Sectores'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion or f'Sector {self.cod_sector}'


class SectorZona(models.Model):
    """
    CORRECCIÓN models.E007:
    Las FKs hacia Zona y Sector usaban db_column='codZona' y db_column='codSector',
    que colisionaban con los db_column de los PKs de esos modelos.
    Django nombra automáticamente las columnas FK como '<campo>_id' cuando el PK
    del modelo referenciado tiene un nombre personalizado, así que se quita
    db_column explícito en las FKs y se deja que Django lo resuelva solo.
    La columna en BD queda como 'zona_id' y 'sector_id', o se puede forzar
    con un nombre distinto al PK para evitar la colisión.
    """
    cod_sector_zona = models.AutoField(primary_key=True, db_column='codSectorZona')
    zona = models.ForeignKey(
        Zona,
        on_delete=models.PROTECT,
        db_column='codZona',        # ← OK: 'codZona' no colisiona con ningún otro campo de ESTA tabla
        related_name='sectores_zona'
    )
    sector = models.ForeignKey(
        Sector,
        on_delete=models.PROTECT,
        db_column='fkCodSector',    # ← CORREGIDO: nombre distinto al db_column del PK de Sector
        related_name='zonas_sector'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'SectoresZona'
        verbose_name = 'Sector-Zona'
        verbose_name_plural = 'Sectores-Zona'
        unique_together = [('zona', 'sector')]
        ordering = ['zona', 'sector']

    def __str__(self):
        return f'{self.zona} / {self.sector}'