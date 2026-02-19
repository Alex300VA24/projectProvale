from django.contrib import admin
from .models import Parentesco, TipoBeneficio, MotivoInhabilitacion, Beneficiario, HistoricoBeneficiario, DatosObstetricos


@admin.register(Parentesco)
class ParentescoAdmin(admin.ModelAdmin):
    list_display = ('cod_parentesco', 'descripcion', 'fecha_registro')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(TipoBeneficio)
class TipoBeneficioAdmin(admin.ModelAdmin):
    list_display = ('cod_tipo_beneficio', 'descripcion', 'edad_minima', 'edad_maxima', 'prioridad')
    search_fields = ('descripcion',)
    ordering = ('prioridad',)


@admin.register(MotivoInhabilitacion)
class MotivoInhabilitacionAdmin(admin.ModelAdmin):
    list_display = ('cod_motivo_inhabilitacion', 'descripcion')
    search_fields = ('descripcion',)
    ordering = ('descripcion',)


@admin.register(Beneficiario)
class BeneficiarioAdmin(admin.ModelAdmin):
    list_display = ('cod_beneficiario', 'persona', 'socio', 'parentesco', 'fecha_registro')
    search_fields = ('persona__nombres', 'persona__apellido_paterno', 'socio__persona__nombres')
    list_filter = ('parentesco',)
    ordering = ('persona',)


class DatosObstetricosInline(admin.StackedInline):
    """
    Muestra DatosObstetricos embebido dentro del HistoricoBeneficiario.
    Solo aparece cuando es relevante (gestante/lactante).
    """
    model = DatosObstetricos
    extra = 0
    can_delete = True


@admin.register(HistoricoBeneficiario)
class HistoricoBeneficiarioAdmin(admin.ModelAdmin):
    list_display = ('cod_historico_beneficiario', 'beneficiario', 'tipo_beneficio', 'estado', 'fecha_inicio', 'fecha_termino')
    search_fields = ('beneficiario__persona__nombres', 'beneficiario__persona__apellido_paterno')
    list_filter = ('estado', 'tipo_beneficio')
    ordering = ('-fecha_inicio',)
    inlines = [DatosObstetricosInline]