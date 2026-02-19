from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Estado, Rol
from usuarios.factories import EstadoFactory, RolFactory, UsuarioFactory

Usuario = get_user_model()

class Command(BaseCommand):
    help = "Pobla la base de datos con datos iniciales"

    def add_arguments(self, parser):
        parser.add_argument(
            "--users",
            type=int,
            default=5,
            help="Numero de usuarios a crear",
        )

    def handle(self, *args, **options):
        num_users = options["users"]

        self.stdout.write("Creando estados...")
        estados_data = [
            {"abreviatura": "ACT", "descripcion": "Activo"},
            {"abreviatura": "INA", "descripcion": "Inactivo"},
            {"abreviatura": "SUS", "descripcion": "Suspendido"},
        ]
        for estado_data in estados_data:
            Estado.objects.get_or_create(
                abreviatura=estado_data["abreviatura"],
                defaults={"descripcion": estado_data["descripcion"]}
            )
        self.stdout.write(self.style.SUCCESS(f"Estados creados: {len(estados_data)}"))

        self.stdout.write("Creando roles...")
        roles_data = [
            "Administrador",
            "Gerente",
            "Usuario",
            "Consultor",
        ]
        for rol_desc in roles_data:
            Rol.objects.get_or_create(descripcion=rol_desc)
        self.stdout.write(self.style.SUCCESS(f"Roles creados: {len(roles_data)}"))

        self.stdout.write(f"Creando {num_users} usuarios...")
        estado_activo = Estado.objects.get(abreviatura="ACT")
        rol_admin = Rol.objects.get(descripcion="Administrador")
        
        if not Usuario.objects.filter(username="admin").exists():
            Usuario.objects.create_superuser(
                username="admin",
                email="admin@provale.com",
                password="admin123",
                nombres="Administrador",
                apellido_paterno="Sistema",
                apellido_materno="",
                dni="12345678",
                cui="1234567890123",
                rol=rol_admin,
                estado=estado_activo,
            )
            self.stdout.write(self.style.SUCCESS("Usuario admin creado"))

        for i in range(num_users):
            UsuarioFactory()
        
        self.stdout.write(self.style.SUCCESS(f"{num_users} usuarios creados"))
        self.stdout.write(self.style.SUCCESS("Seed completado exitosamente!"))
