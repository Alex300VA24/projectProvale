from django.db import models
from core.models import Estado
from geografico.models import SectorZona


class TipoLocal(models.Model):
    """
    Tabla: TiposLocal
    Clasificación del tipo de local donde opera la asociación
    (propio, arrendado, cedido, etc.).
    """
    cod_tipo_local = models.AutoField(primary_key=True, db_column='codTipoLocal')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'TiposLocal'
        verbose_name = 'Tipo de Local'
        verbose_name_plural = 'Tipos de Local'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class Asociacion(models.Model):
    """
    Tabla: Asociaciones
    Asociaciones de madres/beneficiarios registradas en el programa.
    """
    cod_asociacion = models.AutoField(primary_key=True, db_column='codAsociacion')
    codigo_asociacion = models.CharField(max_length=20, unique=True, db_column='codigoAsociacion')
    nombre_asociacion = models.CharField(max_length=100, unique=True, null=True, blank=True, db_column='nombreAsociacion')
    sector_zona = models.ForeignKey(
        SectorZona,
        on_delete=models.PROTECT,
        db_column='codSectorZona',
        related_name='asociaciones'
    )
    tipo_local = models.ForeignKey(
        TipoLocal,
        on_delete=models.PROTECT,
        db_column='codTipoLocal',
        related_name='asociaciones'
    )
    direccion = models.CharField(max_length=200, db_column='direccion')
    numero_finca = models.IntegerField(null=True, blank=True, db_column='numeroFinca')
    observaciones = models.CharField(max_length=255, null=True, blank=True, db_column='observaciones')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='asociaciones'
    )

    class Meta:
        db_table = 'Asociaciones'
        verbose_name = 'Asociación'
        verbose_name_plural = 'Asociaciones'
        ordering = ['nombre_asociacion']

    def __str__(self):
        return f'{self.codigo_asociacion} - {self.nombre_asociacion}'


class Reconocimiento(models.Model):
    """
    Tabla: Reconocimientos
    Documentos de reconocimiento legal/oficial de una asociación,
    con fecha de vigencia (inicio - fin).
    """
    cod_reconocimiento = models.AutoField(primary_key=True, db_column='codReconocimiento')
    asociacion = models.ForeignKey(
        Asociacion,
        on_delete=models.PROTECT,
        db_column='codAsociacion',
        related_name='reconocimientos'
    )
    documento = models.CharField(max_length=100, db_column='documento')
    fecha_documento = models.DateTimeField(auto_now_add=True, db_column='fechaDocumento')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    fecha_inicio = models.DateField(db_column='fechaInicio')
    fecha_fin = models.DateField(db_column='fechaFin')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='reconocimientos'
    )

    class Meta:
        db_table = 'Reconocimientos'
        verbose_name = 'Reconocimiento'
        verbose_name_plural = 'Reconocimientos'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f'{self.asociacion} | {self.documento} ({self.fecha_inicio} - {self.fecha_fin})'


class Cargo(models.Model):
    """
    Tabla: Cargos
    Cargos dentro de la directiva de una asociación
    (presidenta, secretaria, tesorera, etc.).
    """
    cod_cargo = models.AutoField(primary_key=True, db_column='codCargo')
    descripcion = models.CharField(max_length=100, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Cargos'
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class Directiva(models.Model):
    """
    Tabla: Directivas
    Miembros de la directiva de una asociación, vinculados a su
    reconocimiento vigente. Un socio puede tener distinto cargo
    en distintos períodos de reconocimiento.
    """
    cod_directiva = models.AutoField(primary_key=True, db_column='codDirectiva')
    reconocimiento = models.ForeignKey(
        Reconocimiento,
        on_delete=models.PROTECT,
        db_column='codReconocimiento',
        related_name='directivas'
    )
    # Import diferido para evitar importación circular con personas
    socio = models.ForeignKey(
        'personas.Socio',
        on_delete=models.PROTECT,
        db_column='codSocio',
        related_name='directivas'
    )
    cargo = models.ForeignKey(
        Cargo,
        on_delete=models.PROTECT,
        db_column='codCargo',
        related_name='directivas'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='directivas'
    )

    class Meta:
        db_table = 'Directivas'
        verbose_name = 'Directiva'
        verbose_name_plural = 'Directivas'
        ordering = ['reconocimiento', 'cargo']

    def __str__(self):
        return f'{self.socio} - {self.cargo} ({self.reconocimiento.asociacion})'