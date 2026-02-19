from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import Estado, Rol


class Usuario(AbstractUser):  # ← FIX 1: AbstractUser, no models.Model
    """
    Tabla: Usuarios
    Extiende AbstractUser de Django agregando campos del negocio.
    Hereda automáticamente: username, password, is_active, is_staff,
    is_superuser, last_login, date_joined, groups, user_permissions.
    """

    nombres = models.CharField(
        max_length=100,
        verbose_name='Nombres',
        db_column='nombres'
    )
    apellido_paterno = models.CharField(
        max_length=100,
        verbose_name='Apellido Paterno',
        db_column='apellidoPaterno'
    )
    apellido_materno = models.CharField(
        max_length=100,
        verbose_name='Apellido Materno',
        db_column='apellidoMaterno'
    )
    dni = models.CharField(
        max_length=8,
        verbose_name='DNI',
        db_column='dni'
    )
    cui = models.CharField(
        max_length=13,
        verbose_name='CUI',
        db_column='cui'
    )
    rol = models.ForeignKey(
        Rol,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='codRol',
        related_name='usuarios',
        verbose_name='Rol'
    )
    estado = models.ForeignKey(
        Estado,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        db_column='codEstado',  # ← FIX: era 'cosEstado' (typo)
        related_name='usuarios',
        verbose_name='Estado'
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = [          # ← FIX 4: coma faltante corregida
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'dni',
        'cui',
        'email',
    ]

    class Meta:
        db_table = 'Usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['apellido_paterno', 'apellido_materno', 'nombres']

    def __str__(self):
        return f'{self.username} - {self.nombres} {self.apellido_paterno} {self.apellido_materno}'

    def get_full_name(self):
        return f'{self.nombres} {self.apellido_paterno} {self.apellido_materno}'

    def get_short_name(self):
        return self.nombres.split()[0] if self.nombres else self.username  # ← FIX 3

    @property
    def esta_activo_en_sistema(self):
        return self.is_active and (
            self.estado.abreviatura.upper() in ('ACT', 'A') if self.estado else False
        )