import factory
from factory.django import DjangoModelFactory
from django.contrib.auth import get_user_model
from core.models import Estado, Rol

Usuario = get_user_model()

class EstadoFactory(DjangoModelFactory):
    class Meta:
        model = Estado
    
    abreviatura = factory.Sequence(lambda n: f"{'ACT' if n % 3 == 0 else 'INA' if n % 3 == 1 else 'SUS'}")
    descripcion = factory.LazyAttribute(lambda obj: 
        "Activo" if obj.abreviatura == "ACT" else 
        "Inactivo" if obj.abreviatura == "INA" else "Suspendido"
    )


class RolFactory(DjangoModelFactory):
    class Meta:
        model = Rol
    
    descripcion = factory.Sequence(lambda n: f"Rol {n}")


class UsuarioFactory(DjangoModelFactory):
    class Meta:
        model = Usuario
    
    username = factory.Sequence(lambda n: f"usuario{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
    nombres = factory.Faker("first_name")
    apellido_paterno = factory.Faker("last_name")
    apellido_materno = factory.Faker("last_name")
    dni = factory.Sequence(lambda n: f"{10000000 + n}")
    cui = factory.Sequence(lambda n: f"{1000000000000 + n}")
    password = factory.PostGenerationMethodCall("set_password", "password123")
    is_active = True
    estado = factory.SubFactory(EstadoFactory)
    rol = factory.SubFactory(RolFactory)
