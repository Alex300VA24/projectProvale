from django.db import models
from django.utils import timezone
from core.models import Estado
from geografico.models import SectorZona
from asociaciones.models import Asociacion


class Persona(models.Model):
    """
    Tabla: Personas
    Datos personales de cualquier individuo en el sistema
    (socios y sus beneficiarios comparten esta tabla base).

    Nota: Los campos calculados aniosNacido, mesesNacido y diasNacido
    del SQL son columnas computadas del motor. En Django se implementan
    como propiedades de Python para mantener portabilidad, ya que Django
    ORM no soporta columnas AS calculadas de forma nativa sin SQL raw.
    """
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
    ]

    cod_persona = models.AutoField(primary_key=True, db_column='codPersona')
    nombres = models.CharField(max_length=100, db_column='nombres')
    apellido_paterno = models.CharField(max_length=50, db_column='apellidoPaterno')
    apellido_materno = models.CharField(max_length=50, db_column='apellidoMaterno')
    dni = models.CharField(max_length=8, unique=True, db_column='dni')
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, db_column='sexo')
    telefono = models.CharField(max_length=6, null=True, blank=True, db_column='telefono')
    celular = models.CharField(max_length=9, null=True, blank=True, db_column='celular')
    fecha_nacimiento = models.DateField(db_column='fechaNacimiento')
    sector_zona = models.ForeignKey(
        SectorZona,
        on_delete=models.PROTECT,
        db_column='codSectorZona',
        related_name='personas'
    )
    direccion = models.CharField(max_length=100, db_column='direccion')
    numero_finca = models.IntegerField(null=True, blank=True, db_column='numeroFinca')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')

    class Meta:
        db_table = 'Personas'
        verbose_name = 'Persona'
        verbose_name_plural = 'Personas'
        ordering = ['apellido_paterno', 'apellido_materno', 'nombres']

    def __str__(self):
        return f'{self.apellido_paterno} {self.apellido_materno}, {self.nombres}'

    @property
    def nombre_completo(self):
        return f'{self.nombres} {self.apellido_paterno} {self.apellido_materno}'

    @property
    def anios_nacido(self):
        """Edad en años completos."""
        hoy = timezone.now().date()
        edad = hoy.year - self.fecha_nacimiento.year
        if (hoy.month, hoy.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day):
            edad -= 1
        return edad

    @property
    def meses_nacido(self):
        """Meses cumplidos del año en curso (0-11)."""
        hoy = timezone.now().date()
        meses = (hoy.year - self.fecha_nacimiento.year) * 12 + (hoy.month - self.fecha_nacimiento.month)
        if hoy.day < self.fecha_nacimiento.day:
            meses -= 1
        return meses % 12

    @property
    def dias_nacido(self):
        """Días cumplidos del mes en curso."""
        hoy = timezone.now().date()
        if hoy.day >= self.fecha_nacimiento.day:
            return hoy.day - self.fecha_nacimiento.day
        import calendar
        ultimo_dia_mes_anterior = calendar.monthrange(hoy.year, hoy.month - 1 if hoy.month > 1 else 12)[1]
        return ultimo_dia_mes_anterior - self.fecha_nacimiento.day + hoy.day


class Socio(models.Model):
    """
    Tabla: Socios
    Vínculo entre una Persona y la Asociación a la que pertenece.
    Una persona puede ser socia de distintas asociaciones en distintos períodos.
    """
    cod_socio = models.AutoField(primary_key=True, db_column='codSocio')
    persona = models.ForeignKey(
        Persona,
        on_delete=models.PROTECT,
        db_column='codPersona',
        related_name='socios'
    )
    asociacion = models.ForeignKey(
        Asociacion,
        on_delete=models.PROTECT,
        db_column='codAsociacion',
        related_name='socios'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    fecha_inicio = models.DateTimeField(auto_now_add=True, db_column='fechaInicio')
    fecha_fin = models.DateTimeField(null=True, blank=True, db_column='fechaFin')
    observaciones = models.CharField(max_length=255, null=True, blank=True, db_column='observaciones')
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        db_column='codEstado',
        related_name='socios'
    )

    class Meta:
        db_table = 'Socios'
        verbose_name = 'Socio'
        verbose_name_plural = 'Socios'
        ordering = ['persona']

    def __str__(self):
        return f'{self.persona} → {self.asociacion}'