from django.db import models


# Create your views here.
class Estado(models.Model):
    """
    Tabla: Estados
    Estados genéricos reutilizados por múltiples entidades del sistema
    (activo, inactivo, suspendido, etc.)
    """
    cod_estado = models.AutoField(primary_key=True, db_column='codEstado')
    abreviatura = models.CharField(max_length=3, unique=True, db_column='abreviatura')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    
    class Meta:
        db_table = 'Estados'
        verbose_name = 'Estado'
        verbose_name_plural = 'Estados'
        ordering = ['descripcion']
    
    def __str__(self):
        return f'{self.abreviatura} - {self.descripcion}'
    

class Rol(models.Model):
    """
    Tabla: Roles
    Roles de acceso para los usuarios del sistema.
    """
    cod_rol = models.AutoField(primary_key=True, db_column='codRol')
    descripcion = models.CharField(max_length=100, unique=True, db_column='descripcion')
    fecha_registro = models.DateTimeField(auto_now_add=True, db_column='fechaRegistro')
    
    class Meta:
        db_table = 'Roles'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'
        ordering = ['descripcion']
        
    def __str__(self):
        return self.descripcion