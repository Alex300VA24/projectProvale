from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def socios_index(request):
    """Vista de lista de socios"""
    socios = [
        {'id': 1, 'dni': '12345678', 'nombre_completo': 'Luis Fernando Martínez', 'fecha_nacimiento': '1985-03-15', 'sexo': 'M', 'direccion': 'Av. Principal 123', 'telefono': '987654321', 'email': 'luis@email.com', 'estado': 'activo', 'tipo_socio': 'ordinario', 'fecha_registro': '2024-01-10'},
        {'id': 2, 'dni': '87654321', 'nombre_completo': 'Carmen Rosa López', 'fecha_nacimiento': '1990-07-22', 'sexo': 'F', 'direccion': 'Jr. Los Pinos 456', 'telefono': '912345678', 'email': 'carmen@email.com', 'estado': 'activo', 'tipo_socio': 'fundador', 'fecha_registro': '2023-05-15'},
        {'id': 3, 'dni': '45678912', 'nombre_completo': 'Pedro Antonio Sánchez', 'fecha_nacimiento': '1978-11-30', 'sexo': 'M', 'direccion': 'Calle Las Flores 789', 'telefono': '945678123', 'email': 'pedro@email.com', 'estado': 'activo', 'tipo_socio': 'honorario', 'fecha_registro': '2024-02-20'},
        {'id': 4, 'dni': '78912345', 'nombre_completo': 'Ana María Torres', 'fecha_nacimiento': '1992-08-12', 'sexo': 'F', 'direccion': 'Av. Los Olivos 321', 'telefono': '978123456', 'email': 'ana@email.com', 'estado': 'inactivo', 'tipo_socio': 'ordinario', 'fecha_registro': '2024-01-25'},
        {'id': 5, 'dni': '32165498', 'nombre_completo': 'José Carlos Mendoza', 'fecha_nacimiento': '1988-12-05', 'sexo': 'M', 'direccion': 'Jr. Santa Rosa 654', 'telefono': '934567891', 'email': 'jose@email.com', 'estado': 'suspendido', 'tipo_socio': 'ordinario', 'fecha_registro': '2024-03-01'},
    ]
    
    context = {
        'page_data': {
            'user': {'id': request.user.id, 'username': request.user.username, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'role': getattr(request.user, 'role', 'usuario')},
            'socios': socios,
            'total': 1247,
            'page': 1,
            'per_page': 20,
            'filters': {'search': request.GET.get('search', ''), 'estado': request.GET.get('estado'), 'tipo_socio': request.GET.get('tipo_socio')},
        }
    }
    return render(request, 'personas/socios_list.html', context)
