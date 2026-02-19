import json
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def json_script(value, element_id=None):
    """
    Convierte un objeto Python a JSON seguro para usar en atributos data-*.
    
    Uso:
        <div id="root" data-props="{{ data|json_script }}"></div>
    """
    if value is None:
        return '{}'
    return mark_safe(json.dumps(value, default=str))


@register.simple_tag
def react_props(data, element_id='react-root'):
    """
    Genera un div con datos JSON para React.
    
    Uso:
        {% react_props dashboard_data "dashboard-root" %}
    """
    json_data = json.dumps(data, default=str)
    return mark_safe(f'<div id="{element_id}" data-props="{json_data}"></div>')


@register.filter
def react_data(value):
    """
    Convierte datos para uso en React via window.__PROVALE_PROPS__
    
    Uso:
        {{ dashboard_data|react_data }}
    """
    return mark_safe(f'<script>window.__PROVALE_PROPS__ = window.__PROVALE_PROPS__ || {{}}; window.__PROVALE_PROPS__.dashboard = {json.dumps(value, default=str)};</script>')
