from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from usuarios.factories import UsuarioFactory, EstadoFactory, RolFactory

Usuario = get_user_model()

class Command(BaseCommand):
    help = "Genera datos de prueba masivos"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=50,
            help="Numero de usuarios a generar",
        )

    def handle(self, *args, **options):
        num_users = options["users"]

        self.stdout.write(f"Generando {num_users} usuarios de prueba...")

        estado_activo, _ = EstadoFactory._create(EstadoFactory, abreviatura="ACT", descripcion="Activo")
        estado_inactivo, _ = EstadoFactory._create(EstadoFactory, abreviatura="INA", descripcion="Inactivo")
        
        rol_usuario, _ = RolFactory._create(RolFactory, descripcion="Usuario")
        rol_gerente, _ = RolFactory._create(RolFactory, descripcion="Gerente")
        
        for i in range(num_users):
            estado = estado_activo if i % 2 == 0 else estado_inactivo
            rol = rol_usuario if i % 3 != 0 else rol_gerente
            
            UsuarioFactory(
                estado=estado,
                rol=rol,
            )
            
            if (i + 1) % 10 == 0:
                self.stdout.write(f"{i + 1}/{num_users} usuarios generados...")

        self.stdout.write(self.style.SUCCESS(f"{num_users} usuarios de prueba generados"))
        self.stdout.write(self.style.SUCCESS("Datos de prueba generados exitosamente!"))
