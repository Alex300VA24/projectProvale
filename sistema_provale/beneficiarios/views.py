from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
import json


@login_required
def index(request):
    """Vista de lista de beneficiarios"""
    # Datos de ejemplo - en producción vendrían de la base de datos
    beneficiarios = [
        {
            'id': 1,
            'dni': '12345678',
            'nombre_completo': 'María González Pérez',
            'fecha_nacimiento': '1990-05-15',
            'sexo': 'F',
            'direccion': 'Av. Principal 123',
            'telefono': '987654321',
            'club': {'id': 1, 'nombre': 'Club San Luis'},
            'estado': 'activo',
            'fecha_registro': '2024-01-15',
        },
        {
            'id': 2,
            'dni': '87654321',
            'nombre_completo': 'Juan Carlos Rodríguez',
            'fecha_nacimiento': '1985-08-22',
            'sexo': 'M',
            'direccion': 'Jr. Los Pinos 456',
            'telefono': '912345678',
            'club': {'id': 2, 'nombre': 'Club Primavera'},
            'estado': 'activo',
            'fecha_registro': '2024-02-10',
        },
        {
            'id': 3,
            'dni': '45678912',
            'nombre_completo': 'Ana Lucía Mendoza',
            'fecha_nacimiento': '1992-11-30',
            'sexo': 'F',
            'direccion': 'Calle Las Flores 789',
            'telefono': '945678123',
            'club': {'id': 1, 'nombre': 'Club San Luis'},
            'estado': 'pendiente',
            'fecha_registro': '2024-03-05',
        },
        {
            'id': 4,
            'dni': '78912345',
            'nombre_completo': 'Pedro Antonio Vargas',
            'fecha_nacimiento': '1978-03-12',
            'sexo': 'M',
            'direccion': 'Av. Los Olivos 321',
            'telefono': '978123456',
            'club': {'id': 3, 'nombre': 'Club Esperanza'},
            'estado': 'inactivo',
            'fecha_registro': '2024-01-20',
        },
        {
            'id': 5,
            'dni': '32165498',
            'nombre_completo': 'Carmen Rosa Huamán',
            'fecha_nacimiento': '1988-07-25',
            'sexo': 'F',
            'direccion': 'Jr. Santa Rosa 654',
            'telefono': '934567891',
            'club': {'id': 2, 'nombre': 'Club Primavera'},
            'estado': 'activo',
            'fecha_registro': '2024-02-28',
        },
    ]

    context = {
        'page_data': {
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'role': getattr(request.user, 'role', 'usuario'),
            },
            'beneficiarios': beneficiarios,
            'total': 1247,
            'page': 1,
            'per_page': 20,
            'filters': {
                'search': request.GET.get('search', ''),
                'club_id': request.GET.get('club_id'),
                'estado': request.GET.get('estado'),
            },
        }
    }
    return render(request, 'beneficiarios/beneficiarios_list.html', context)


@login_required
def create(request):
    """Vista de formulario para nuevo beneficiario"""
    form_data = {
        'user': {
            'id': request.user.id,
            'username': request.user.username,
        },
        'fields': [
            {
                'name': 'dni',
                'label': 'DNI',
                'type': 'text',
                'required': True,
                'placeholder': 'Ingrese el número de DNI',
                'validation': {
                    'pattern': '^\\d{8}$',
                    'message': 'El DNI debe tener 8 dígitos',
                },
            },
            {
                'name': 'nombre_completo',
                'label': 'Nombre Completo',
                'type': 'text',
                'required': True,
                'placeholder': 'Nombres y apellidos',
            },
            {
                'name': 'fecha_nacimiento',
                'label': 'Fecha de Nacimiento',
                'type': 'date',
                'required': True,
            },
            {
                'name': 'sexo',
                'label': 'Sexo',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 'M', 'label': 'Masculino'},
                    {'value': 'F', 'label': 'Femenino'},
                ],
            },
            {
                'name': 'direccion',
                'label': 'Dirección',
                'type': 'textarea',
                'required': True,
                'placeholder': 'Dirección completa',
            },
            {
                'name': 'telefono',
                'label': 'Teléfono',
                'type': 'tel',
                'required': False,
                'placeholder': 'Número de teléfono',
            },
            {
                'name': 'club_id',
                'label': 'Club de Madres',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 1, 'label': 'Club San Luis'},
                    {'value': 2, 'label': 'Club Primavera'},
                    {'value': 3, 'label': 'Club Esperanza'},
                ],
            },
            {
                'name': 'estado',
                'label': 'Estado',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 'activo', 'label': 'Activo'},
                    {'value': 'inactivo', 'label': 'Inactivo'},
                    {'value': 'pendiente', 'label': 'Pendiente'},
                ],
            },
        ],
        'initial_data': {},
        'action_url': '/api/beneficiarios/',
        'csrf_token': request.META.get('CSRF_COOKIE', ''),
    }
    
    context = {'form_data': form_data}
    return render(request, 'beneficiarios/beneficiario_form.html', context)


@login_required
def edit(request, id):
    """Vista de formulario para editar beneficiario"""
    form_data = {
        'user': {
            'id': request.user.id,
            'username': request.user.username,
        },
        'fields': [
            {
                'name': 'dni',
                'label': 'DNI',
                'type': 'text',
                'required': True,
                'placeholder': 'Ingrese el número de DNI',
            },
            {
                'name': 'nombre_completo',
                'label': 'Nombre Completo',
                'type': 'text',
                'required': True,
                'placeholder': 'Nombres y apellidos',
            },
            {
                'name': 'fecha_nacimiento',
                'label': 'Fecha de Nacimiento',
                'type': 'date',
                'required': True,
            },
            {
                'name': 'sexo',
                'label': 'Sexo',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 'M', 'label': 'Masculino'},
                    {'value': 'F', 'label': 'Femenino'},
                ],
            },
            {
                'name': 'direccion',
                'label': 'Dirección',
                'type': 'textarea',
                'required': True,
                'placeholder': 'Dirección completa',
            },
            {
                'name': 'telefono',
                'label': 'Teléfono',
                'type': 'tel',
                'required': False,
                'placeholder': 'Número de teléfono',
            },
            {
                'name': 'club_id',
                'label': 'Club de Madres',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 1, 'label': 'Club San Luis'},
                    {'value': 2, 'label': 'Club Primavera'},
                    {'value': 3, 'label': 'Club Esperanza'},
                ],
            },
            {
                'name': 'estado',
                'label': 'Estado',
                'type': 'select',
                'required': True,
                'options': [
                    {'value': 'activo', 'label': 'Activo'},
                    {'value': 'inactivo', 'label': 'Inactivo'},
                    {'value': 'pendiente', 'label': 'Pendiente'},
                ],
            },
        ],
        'initial_data': {
            'id': id,
            'dni': '12345678',
            'nombre_completo': 'María González Pérez',
            'fecha_nacimiento': '1990-05-15',
            'sexo': 'F',
            'direccion': 'Av. Principal 123',
            'telefono': '987654321',
            'club_id': 1,
            'estado': 'activo',
        },
        'action_url': f'/api/beneficiarios/{id}/',
        'csrf_token': request.META.get('CSRF_COOKIE', ''),
    }
    
    context = {'form_data': form_data}
    return render(request, 'beneficiarios/beneficiario_form.html', context)
