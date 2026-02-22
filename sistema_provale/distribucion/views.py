from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def index(request):
    """Vista de lista de PECOSAs"""
    pecosas = [
        {'id': 1, 'numero_pecosa': 'PEC-2026-0001', 'beneficiario': {'id': 1, 'nombre_completo': 'María González Pérez', 'dni': '12345678'}, 'club': {'id': 1, 'nombre': 'Club San Luis'}, 'fecha_emision': '2026-02-15', 'items': [{'producto': 'Leche Evaporada', 'cantidad': 12, 'precio_unitario': 4.50}, {'producto': 'Fideos', 'cantidad': 6, 'precio_unitario': 2.80}], 'estado': 'pendiente', 'total': 67.80},
        {'id': 2, 'numero_pecosa': 'PEC-2026-0002', 'beneficiario': {'id': 2, 'nombre_completo': 'Juan Carlos Rodríguez', 'dni': '87654321'}, 'club': {'id': 2, 'nombre': 'Club Primavera'}, 'fecha_emision': '2026-02-14', 'items': [{'producto': 'Azúcar', 'cantidad': 5, 'precio_unitario': 3.20}, {'producto': 'Jabón', 'cantidad': 3, 'precio_unitario': 1.50}], 'estado': 'aprobada', 'total': 21.50},
        {'id': 3, 'numero_pecosa': 'PEC-2026-0003', 'beneficiario': {'id': 3, 'nombre_completo': 'Ana Lucía Mendoza', 'dni': '45678912'}, 'club': {'id': 1, 'nombre': 'Club San Luis'}, 'fecha_emision': '2026-02-10', 'items': [{'producto': 'Leche Evaporada', 'cantidad': 24, 'precio_unitario': 4.50}], 'estado': 'entregada', 'total': 108.00},
        {'id': 4, 'numero_pecosa': 'PEC-2026-0004', 'beneficiario': {'id': 4, 'nombre_completo': 'Pedro Antonio Vargas', 'dni': '78912345'}, 'club': {'id': 3, 'nombre': 'Club Esperanza'}, 'fecha_emision': '2026-02-08', 'items': [{'producto': 'Shampoo', 'cantidad': 2, 'precio_unitario': 5.00}, {'producto': 'Paracetamol', 'cantidad': 20, 'precio_unitario': 0.10}], 'estado': 'cancelada', 'total': 12.00},
        {'id': 5, 'numero_pecosa': 'PEC-2026-0005', 'beneficiario': {'id': 5, 'nombre_completo': 'Carmen Rosa Huamán', 'dni': '32165498'}, 'club': {'id': 2, 'nombre': 'Club Primavera'}, 'fecha_emision': '2026-02-05', 'items': [{'producto': 'Fideos', 'cantidad': 10, 'precio_unitario': 2.80}], 'estado': 'entregada', 'total': 28.00},
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
            'pecosas': pecosas,
            'total': 89,
            'page': 1,
            'per_page': 20,
            'filters': {
                'search': request.GET.get('search', ''),
                'club_id': request.GET.get('club_id'),
                'estado': request.GET.get('estado'),
            },
        }
    }
    return render(request, 'distribucion/pecosas_list.html', context)

@login_required
def create(request):
    """Vista para crear una nueva PECOSA"""
    return render(request, 'distribucion/create.html')

def edit(request, id):
    """Vista para editar una PECOSA existente"""
    pecosa = {
        'id': id,
        'numero': f'PECOSA-2024-{id:04d}',
        'fecha_emision': '2024-06-01',
        'club': {'id': 1, 'nombre': 'Club San Luis'},
        'estado': 'pendiente',
        'total_items': 3,
        'total_cantidad': 150,
    }
    return render(request, 'distribucion/edit.html', {'pecosa': pecosa})
