from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
import json


@login_required
def dashboard(request):
    """Vista del Dashboard con datos para React"""
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
            'alerts': [
                {
                    'id': 1,
                    'type': 'warning',
                    'title': 'Stock bajo de Leche Evaporada',
                    'description': 'Quedan 24 unidades',
                    'time': 'Hace 10 min',
                    'read': False,
                },
                {
                    'id': 2,
                    'type': 'danger',
                    'title': 'PECOSA #2042 rechazada',
                    'description': 'Falta documentación',
                    'time': 'Hace 1 hora',
                    'read': False,
                },
                {
                    'id': 3,
                    'type': 'success',
                    'title': 'Entrega completada exitosamente',
                    'description': 'Club Primavera',
                    'time': 'Hace 2 horas',
                    'read': True,
                },
            ],
            'kpis': [
                {
                    'id': 'total_beneficiarios',
                    'value': '1,247',
                    'label': 'Total Beneficiarios',
                    'trend': {'direction': 'up', 'percentage': 12},
                    'variant': 'leaf',
                    'icon': 'users',
                },
                {
                    'id': 'socios_activos',
                    'value': '892',
                    'label': 'Socios Activos',
                    'trend': {'direction': 'up', 'percentage': 8},
                    'variant': 'sky',
                    'icon': 'user',
                },
                {
                    'id': 'club_madres',
                    'value': '34',
                    'label': 'Club de Madres',
                    'trend': {'direction': 'neutral', 'percentage': 0},
                    'variant': 'sun',
                    'icon': 'users-group',
                },
                {
                    'id': 'pecosas_mes',
                    'value': '156',
                    'label': 'PECOSAS Este Mes',
                    'trend': {'direction': 'up', 'percentage': 15},
                    'variant': 'clay',
                    'icon': 'file',
                },
            ],
            'activities': [
                {
                    'id': 1,
                    'type': 'beneficiario',
                    'title': 'Nuevo beneficiario registrado',
                    'meta': 'Club San Luis · Activo',
                    'icon_variant': 'leaf',
                    'timestamp': '2026-02-17T10:30:00',
                },
                {
                    'id': 2,
                    'type': 'pecosa',
                    'title': 'PECOSA #2041 generada',
                    'meta': 'Leche evaporada · 120 u.',
                    'icon_variant': 'sun',
                    'timestamp': '2026-02-17T09:15:00',
                },
                {
                    'id': 3,
                    'type': 'entrega',
                    'title': 'Entrega completada',
                    'meta': 'Club Primavera · 45 socios',
                    'icon_variant': 'sky',
                    'timestamp': '2026-02-17T08:00:00',
                },
                {
                    'id': 4,
                    'type': 'producto',
                    'title': 'Stock actualizado',
                    'meta': 'Leche Evaporada · +100 unidades',
                    'icon_variant': 'clay',
                    'timestamp': '2026-02-16T15:00:00',
                },
            ],
            'clubs': [
                {'id': 1, 'nombre': 'Club San Luis', 'total_beneficiarios': 156, 'cobertura': 92},
                {'id': 2, 'nombre': 'Club Primavera', 'total_beneficiarios': 134, 'cobertura': 84},
                {'id': 3, 'nombre': 'Club Esperanza', 'total_beneficiarios': 128, 'cobertura': 91},
            ],
            'chart_data': [65, 78, 82, 90, 75, 88, 95, 80, 70, 85, 92, 98],
            'chart_labels': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            'entregas_mes': 1247,
            'productos_stock': 45,
            'valor_entregas': 'S/ 45,678.00',
        }
    }
    return render(request, 'core/dashboard.html', context)


@login_required
def perfil(request):
    """Vista de Mi Perfil"""
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
        }
    }
    return render(request, 'core/perfil.html', context)
