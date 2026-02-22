from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def productos_index(request):
    """Vista de lista de productos"""
    productos = [
        {'id': 1, 'nombre': 'Leche Evaporada', 'descripcion': 'Leche evaporada descremada en lata', 'categoria': 'alimentos', 'unidad_medida': 'Lata', 'stock_actual': 150, 'stock_minimo': 50, 'precio_unitario': 4.50, 'estado': 'activo'},
        {'id': 2, 'nombre': 'Azúcar', 'descripcion': 'Azúcar rubia refinada', 'categoria': 'alimentos', 'unidad_medida': 'Kg', 'stock_actual': 30, 'stock_minimo': 40, 'precio_unitario': 3.20, 'estado': 'activo'},
        {'id': 3, 'nombre': 'Fideos', 'descripcion': 'Fideos largos tipo spaghetti', 'categoria': 'alimentos', 'unidad_medida': 'Paquete', 'stock_actual': 200, 'stock_minimo': 30, 'precio_unitario': 2.80, 'estado': 'activo'},
        {'id': 4, 'nombre': 'Jabón de Tocador', 'descripcion': 'Jabón antibacterial', 'categoria': 'higiene', 'unidad_medida': 'Unidad', 'stock_actual': 0, 'stock_minimo': 25, 'precio_unitario': 1.50, 'estado': 'activo'},
        {'id': 5, 'nombre': 'Shampoo', 'descripcion': 'Shampoo para adultos', 'categoria': 'higiene', 'unidad_medida': 'Unidad', 'stock_actual': 45, 'stock_minimo': 20, 'precio_unitario': 5.00, 'estado': 'activo'},
        {'id': 6, 'nombre': 'Paracetamol', 'descripcion': 'Tabletas de 500mg', 'categoria': 'medicamentos', 'unidad_medida': 'Tableta', 'stock_actual': 500, 'stock_minimo': 100, 'precio_unitario': 0.10, 'estado': 'activo'},
        {'id': 7, 'nombre': 'Cuadernos', 'descripcion': 'Cuaderno universitario 100 hojas', 'categoria': 'utiles', 'unidad_medida': 'Unidad', 'stock_actual': 15, 'stock_minimo': 30, 'precio_unitario': 8.00, 'estado': 'inactivo'},
    ]
    
    context = {
        'page_data': {
            'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'role': getattr(request.user, 'role', 'usuario')},
            'productos': productos,
            'total': 45,
            'page': 1,
            'per_page': 20,
            'filters': {'search': request.GET.get('search', ''), 'categoria': request.GET.get('categoria'), 'estado': request.GET.get('estado')},
        }
    }
    return render(request, 'inventario/productos_list.html', context)


@login_required
def movimientos_index(request):
    """Vista de lista de movimientos"""
    movimientos = [
        {'id': 1, 'tipo_movimiento': 'entrada', 'producto': {'id': 1, 'nombre': 'Leche Evaporada'}, 'cantidad': 100, 'fecha_movimiento': '2026-02-15', 'motivo': 'Compra mensual', 'responsable': 'Juan Pérez'},
        {'id': 2, 'tipo_movimiento': 'salida', 'producto': {'id': 1, 'nombre': 'Leche Evaporada'}, 'cantidad': 50, 'fecha_movimiento': '2026-02-14', 'motivo': 'Entrega a Club San Luis', 'responsable': 'María García'},
        {'id': 3, 'tipo_movimiento': 'entrada', 'producto': {'id': 3, 'nombre': 'Fideos'}, 'cantidad': 200, 'fecha_movimiento': '2026-02-13', 'motivo': 'Donación municipal', 'responsable': 'Carlos López'},
        {'id': 4, 'tipo_movimiento': 'salida', 'producto': {'id': 2, 'nombre': 'Azúcar'}, 'cantidad': 25, 'fecha_movimiento': '2026-02-12', 'motivo': 'Entrega Club Primavera', 'responsable': 'Ana Torres'},
        {'id': 5, 'tipo_movimiento': 'transferencia', 'producto': {'id': 5, 'nombre': 'Shampoo'}, 'cantidad': 20, 'fecha_movimiento': '2026-02-10', 'motivo': 'Transferencia entre almacenes', 'responsable': 'Pedro Sánchez'},
    ]
    
    context = {
        'page_data': {
            'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'role': getattr(request.user, 'role', 'usuario')},
            'movimientos': movimientos,
            'total': 234,
            'page': 1,
            'per_page': 20,
            'filters': {'search': request.GET.get('search', ''), 'tipo_movimiento': request.GET.get('tipo_movimiento'), 'fecha_inicio': request.GET.get('fecha_inicio'), 'fecha_fin': request.GET.get('fecha_fin')},
        }
    }
    return render(request, 'inventario/movimientos_list.html', context)
