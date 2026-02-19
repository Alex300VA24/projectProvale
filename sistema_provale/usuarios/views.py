from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', 'core:dashboard')
            return redirect(next_url)
        else:
            return render(request, 'usuarios/login.html', {
                'error': 'Usuario o contraseña incorrectos'
            })
    
    return render(request, 'usuarios/login.html')


def register_view(request):
    if request.method == 'POST':
        from django.contrib.auth.forms import UserCreationForm
        form = UserCreationForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Cuenta creada para {username}')
            return redirect('usuarios:login')
        else:
            return render(request, 'usuarios/register.html', {
                'errors': form.errors
            })
    
    return render(request, 'usuarios/register.html')


@login_required
def logout_view(request):
    logout(request)
    messages.info(request, 'Sesión cerrada correctamente')
    return redirect('usuarios:login')
