from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def club_madres_index(request):
    """Vista de lista de clubs de madres (asociaciones)"""
    clubes = [
        {'id': 1, 'nombre': 'Club de Madres San Luis', 'codigo': 'CM-001', 'direccion': 'Av. Principal 123', 'presidente': 'María Elena Pérez', 'total_integrantes': 45, 'fecha_constitucion': '2020-01-15', 'estado': 'activo'},
        {'id': 2, 'nombre': 'Club de Madres Primavera', 'codigo': 'CM-002', 'direccion': 'Jr. Los Pinos 456', 'presidente': 'Rosa Amelia García', 'total_integrantes': 38, 'fecha_constitucion': '2021-03-20', 'estado': 'activo'},
        {'id': 3, 'nombre': 'Club de Madres Esperanza', 'codigo': 'CM-003', 'direccion': 'Calle Las Flores 789', 'presidente': 'Carmen López Torres', 'total_integrantes': 52, 'fecha_constitucion': '2019-08-10', 'estado': 'activo'},
        {'id': 4, 'nombre': 'Club de Madres Nuevo Amanecer', 'codigo': 'CM-004', 'direccion': 'Av. Los Olivos 321', 'presidente': 'Ana María Sánchez', 'total_integrantes': 28, 'fecha_constitucion': '2022-05-05', 'estado': 'inactivo'},
        {'id': 5, 'nombre': 'Club de Madres Solidariedad', 'codigo': 'CM-005', 'direccion': 'Jr. Santa Rosa 654', 'presidente': 'Lucía Fernández', 'total_integrantes': 33, 'fecha_constitucion': '2021-11-12', 'estado': 'activo'},
    ]
    
    context = {
        'page_data': {
            'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'role': getattr(request.user, 'role', 'usuario')},
            'clubes': clubes,
            'total': 34,
            'page': 1,
            'per_page': 20,
            'filters': {'search': request.GET.get('search', ''), 'estado': request.GET.get('estado')},
        }
    }
    return render(request, 'asociaciones/club_madres_list.html', context)


@login_required
def reconocimientos_index(request):
    """Vista de lista de reconocimientos"""
    reconocimientos = [
        {'id': 1, 'beneficiario': {'id': 1, 'nombre_completo': 'Club de Madres San Luis', 'dni': 'CM-001'}, 'tipo_reconocimiento': 'asistencia', 'motivo': 'Asistencia perfecta al programa durante 6 meses', 'fecha_emision': '2026-02-15', 'entregado': True},
        {'id': 2, 'beneficiario': {'id': 2, 'nombre_completo': 'Club de Madres Primavera', 'dni': 'CM-002'}, 'tipo_reconocimiento': 'destacado', 'motivo': 'Destacado por su labor voluntaria', 'fecha_emision': '2026-02-10', 'entregado': True},
        {'id': 3, 'beneficiario': {'id': 3, 'nombre_completo': 'Club de Madres Esperanza', 'dni': 'CM-003'}, 'tipo_reconocimiento': 'aniversario', 'motivo': '5 años en el programa social', 'fecha_emision': '2026-02-01', 'entregado': False},
        {'id': 4, 'beneficiario': {'id': 1, 'nombre_completo': 'Club de Madres San Luis', 'dni': 'CM-001'}, 'tipo_reconocimiento': 'voluntario', 'motivo': 'Reconocimiento por labor comunitaria', 'fecha_emision': '2026-01-20', 'entregado': True},
        {'id': 5, 'beneficiario': {'id': 2, 'nombre_completo': 'Club de Madres Primavera', 'dni': 'CM-002'}, 'tipo_reconocimiento': 'asistencia', 'motivo': '3 meses de asistencia continua', 'fecha_emision': '2026-01-15', 'entregado': False},
    ]
    
    context = {
        'page_data': {
            'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'role': getattr(request.user, 'role', 'usuario')},
            'reconocimientos': reconocimientos,
            'total': 156,
            'page': 1,
            'per_page': 20,
            'filters': {'search': request.GET.get('search', ''), 'tipo_reconocimiento': request.GET.get('tipo_reconocimiento'), 'entregado': request.GET.get('entregado')},
        }
    }
    return render(request, 'asociaciones/reconocimientos_list.html', context)
