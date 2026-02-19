from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):

    list_display = (
        'username', 'nombres', 'apellido_paterno', 'apellido_materno',
        'dni', 'rol', 'estado', 'is_active', 'is_staff'
    )
    list_filter = ('is_active', 'is_staff', 'rol', 'estado')
    search_fields = ('username', 'nombres', 'apellido_paterno', 'apellido_materno', 'dni', 'cui')
    ordering = ('apellido_paterno', 'apellido_materno', 'nombres')

    fieldsets = (
        ('Credenciales', {
            'fields': ('username', 'password')
        }),
        ('Datos personales', {
            'fields': ('nombres', 'apellido_paterno', 'apellido_materno', 'dni', 'cui', 'email')
        }),
        ('Rol y Estado del sistema', {
            'fields': ('rol', 'estado')
        }),
        ('Permisos de Django', {
            'classes': ('collapse',),
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
        }),
        ('Fechas', {
            'classes': ('collapse',),
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        ('Credenciales', {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        ('Datos personales', {
            'classes': ('wide',),
            'fields': ('nombres', 'apellido_paterno', 'apellido_materno', 'dni', 'cui', 'email'),
        }),
        ('Rol y Estado', {
            'classes': ('wide',),
            'fields': ('rol', 'estado'),
        }),
        ('Permisos', {
            'classes': ('wide',),
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
    )

    readonly_fields = ('last_login', 'date_joined')