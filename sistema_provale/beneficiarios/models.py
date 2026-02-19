from django.db import models
from core.models import Estado
from personas.models import Socio, Persona


class Parentesco(models.Model):
    """
    Tabla: Parentescos
    Relación familiar del beneficiario con el socio titular
    (esposo/a, hijo/a, etc.).
    """
    cod_parentesco = models.AutoField(primary_key=True, db_column='codParentesco')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Parentescos'
        verbose_name = 'Parentesco'
        verbose_name_plural = 'Parentescos'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class TipoBeneficio(models.Model):
    """
    Tabla: TiposBeneficio
    Tipos de beneficio que administra el programa
    (gestante, lactante, niño menor de 3 años, etc.).
    Incluye rangos de edad y prioridad de atención.
    """
    cod_tipo_beneficio = models.AutoField(primary_key=True, db_column='codTipoBeneficio')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    edad_minima = models.IntegerField(null=True, blank=True, db_column='edadMinima')
    edad_maxima = models.IntegerField(null=True, blank=True, db_column='edadMaxima')
    prioridad = models.IntegerField(db_column='prioridad')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    observaciones = models.CharField(max_length=255, null=True, blank=True, db_column='observaciones')

    class Meta:
        db_table = 'TiposBeneficio'
        verbose_name = 'Tipo de Beneficio'
        verbose_name_plural = 'Tipos de Beneficio'
        ordering = ['prioridad', 'descripcion']

    def __str__(self):
        return self.descripcion


class MotivoInhabilitacion(models.Model):
    """
    Tabla: MotivosInhabilitacion
    Causas por las que un beneficiario puede ser inhabilitado
    del programa (incumplimiento, cambio de estado, etc.).
    """
    cod_motivo_inhabilitacion = models.AutoField(primary_key=True, db_column='codMotivoInhabilitacion')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    observacion = models.CharField(max_length=255, null=True, blank=True, db_column='observacion')

    class Meta:
        db_table = 'MotivosInhabilitacion'
        verbose_name = 'Motivo de Inhabilitación'
        verbose_name_plural = 'Motivos de Inhabilitación'
        ordering = ['descripcion']

    def __str__(self):
        return self.descripcion


class Beneficiario(models.Model):
    """
    Tabla: Beneficiarios
    Persona que recibe los beneficios del programa, vinculada
    a un socio titular mediante un parentesco.
    """
    cod_beneficiario = models.AutoField(primary_key=True, db_column='codBeneficiario')
    persona = models.ForeignKey(
        Persona,
        on_delete=models.PROTECT,
        db_column='codPersona',
        related_name='beneficiarios'
    )
    socio = models.ForeignKey(
        Socio,
        on_delete=models.PROTECT,
        db_column='codSocio',
        related_name='beneficiarios'
    )
    parentesco = models.ForeignKey(
        Parentesco,
        on_delete=models.PROTECT,
        db_column='codParentesco',
        related_name='beneficiarios'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Beneficiarios'
        verbose_name = 'Beneficiario'
        verbose_name_plural = 'Beneficiarios'
        ordering = ['persona']

    def __str__(self):
        return f'{self.persona} ({self.parentesco} de {self.socio.persona})'


class HistoricoBeneficiario(models.Model):
    """
    Tabla: HistoricoBeneficiarios
    Registro histórico de cada período de beneficio recibido,
    incluyendo métricas nutricionales (peso, talla, hemoglobina).

    CORRECCIÓN 3FN: Las fechas obstétricas fueron separadas a la tabla
    DatosObstetricos, ya que solo aplican a ciertos tipos de beneficio
    y generaban valores NULL masivos para todos los demás registros.
    """
    cod_historico_beneficiario = models.AutoField(primary_key=True, db_column='codHistoricoBeneficiario')
    tipo_beneficio = models.ForeignKey(
        TipoBeneficio,
        on_delete=models.PROTECT,
        db_column='codTipoBeneficio',
        related_name='historicos'
    )
    beneficiario = models.ForeignKey(
        Beneficiario,
        on_delete=models.PROTECT,
        db_column='codBeneficiario',
        related_name='historicos'
    )
    peso = models.DecimalField(max_digits=9, decimal_places=3, null=True, blank=True, db_column='peso')
    talla = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True, db_column='talla')
    hmg = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True, db_column='hmg')
    fecha_inicio = models.DateTimeField(auto_now_add=True, db_column='fechaInicio')
    fecha_termino = models.DateTimeField(null=True, blank=True, db_column='fechaTermino')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='historicos_beneficiario'
    )
    motivo_inhabilitacion = models.ForeignKey(
        MotivoInhabilitacion,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='codMotivoInhabilitacion',
        related_name='historicos'
    )

    class Meta:
        db_table = 'HistoricoBeneficiarios'
        verbose_name = 'Histórico de Beneficiario'
        verbose_name_plural = 'Históricos de Beneficiarios'
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f'{self.beneficiario} | {self.tipo_beneficio} ({self.fecha_inicio:%Y-%m-%d})'


class DatosObstetricos(models.Model):
    """
    Tabla: DatosObstetricos  ← NUEVA TABLA (CORRECCIÓN 3FN)
    Datos específicos del seguimiento obstétrico para beneficiarias
    en estado de gestación o lactancia.

    Relación 1-a-1 opcional con HistoricoBeneficiario:
    - Solo existe el registro cuando el tipo de beneficio lo requiere.
    - Elimina los NULL masivos que existían en HistoricoBeneficiarios
      cuando el tipo de beneficio no era obstétrico.
    """
    cod_dato_obstetrico = models.AutoField(primary_key=True, db_column='codDatoObstetrico')
    historico = models.OneToOneField(
        HistoricoBeneficiario,
        on_delete=models.CASCADE,
        db_column='codHistoricoBeneficiario',
        related_name='datos_obstetricos'
    )
    fecha_ultima_menstruacion = models.DateField(
        null=True, blank=True,
        db_column='fechaUltimaMestruacion'
    )
    fecha_probable_parto = models.DateField(
        null=True, blank=True,
        db_column='fechaProbableParto'
    )
    fecha_de_parto = models.DateField(
        null=True, blank=True,
        db_column='fechaDeParto'
    )
    fecha_fin_lactancia = models.DateField(
        null=True, blank=True,
        db_column='fechaFinLactancia'
    )

    class Meta:
        db_table = 'DatosObstetricos'
        verbose_name = 'Dato Obstétrico'
        verbose_name_plural = 'Datos Obstétricos'

    def __str__(self):
        return f'Obstétrico → {self.historico}'