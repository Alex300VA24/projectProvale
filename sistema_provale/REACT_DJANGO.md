# Documentacion: React con Django

## Overview

El proyecto usa una arquitectura **Django + React hibrida** donde:
- Django renderiza templates HTML base
- React maneja la interfaz dinamica dentro de esos templates

## Estructura de Archivos

### Templates Django

```
templates/
├── base.html           # Template base con navbar
├── base_auth.html      # Template para login/register
├── core/
│   └── partials/
│       └── nav.html    # Navbar reutilizable
├── usuarios/
│   └── templates/usuarios/
│       ├── login.html
│       └── register.html
└── beneficiarios/
    └── templates/beneficiarios/
        ├── beneficiarios_list.html
        └── beneficiario_form.html
```

### Componentes React

```
frontend/src/
├── main.tsx           # Entry point - busca y monta apps
├── index.css          # Estilos Tailwind
├── pages/
│   ├── DashboardApp.tsx
│   ├── BeneficiariosApp.tsx
│   ├── BeneficiarioFormApp.tsx
│   └── AuthApp.tsx
├── components/
│   ├── common/        # Componentes reutilizables
│   └── ...
├── types/
│   └── index.ts      # Tipos TypeScript
└── utils/
    └── index.ts      # Funciones helper
```

---

## Como funciona

### 1. Paso de datos Django -> React

Los datos se pasan via el atributo `data-props` en un elemento HTML:

```html
<!-- templates/core/dashboard.html -->
{% extends "base.html" %}
{% load react_props %}

{% block content %}
<div id="dashboard-root" data-props='{{ page_data|json_script }}'></div>
{% endblock %}
```

El filtro `json_script` convierte un diccionario Python a JSON seguro.

### 2. Montaje de React

`main.tsx` busca elementos con IDs especificos y monta los componentes:

```tsx
// main.tsx
const REACT_APPS = {
  'dashboard-root': () => import('@/pages/DashboardApp'),
  'beneficiarios-root': () => import('@/pages/BeneficiariosApp'),
  'auth-root': () => import('@/pages/AuthApp'),
};

function mountApps() {
  Object.entries(REACT_APPS).forEach(([elementId, loadApp]) => {
    const rootElement = document.getElementById(elementId);
    if (!rootElement) return;

    // Obtener props del atributo data-props
    const props = getPropsFromElement(elementId);
    
    // Cargar y montar el componente
    loadApp().then(({ default: App }) => {
      createRoot(rootElement).render(<App {...props} />);
    });
  });
}
```

### 3. Obtencion de props

```ts
// utils/index.ts
export function getPropsFromElement<T>(elementId: string): T | null {
  const element = document.getElementById(elementId);
  if (!element?.dataset.props) return null;
  
  try {
    return JSON.parse(element.dataset.props);
  } catch {
    return null;
  }
}
```

---

## Sintaxis JSX/React

### Componentes Funcionales

```tsx
// Definicion de interfaz para props
interface DashboardProps {
  user: { username: string; email: string };
  kpis: KPICard[];
  activities: Activity[];
}

// Componente funcional
export default function DashboardApp(props: DashboardProps) {
  // Desestructuracion
  const { user, kpis } = props;
  
  // Hook de estado
  const [searchTerm, setSearchTerm] = useState('');
  
  // Renderizado
  return (
    <div className="p-4">
      <h1>Hola, {user.username}</h1>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.id} className="card">
            {kpi.value}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Hooks principales

```tsx
import { useState, useEffect, useMemo } from 'react';

// Estado
const [count, setCount] = useState(0);

// Efecto (como componentDidMount)
useEffect(() => {
  console.log('Componente montado');
  return () => console.log('Limpieza');
}, []); // [] = solo una vez

// Memoizacion
const filteredData = useMemo(() => {
  return data.filter(item => item.active);
}, [data]);
```

### Eventos y handlers

```tsx
function handleClick() {
  setCount(count + 1);
}

function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value);
}

<button onClick={handleClick}>Incrementar</button>
<input onChange={handleInputChange} />
```

---

## Tailwind CSS

### Clases utiles

```html
<!-- Layout -->
<div class="flex items-center justify-between">
<div class="grid grid-cols-4 gap-4">
<div class="space-y-4">

<!-- Espaciado -->
<p class="p-4 m-4">padding/margin</p>
<p class="pt-4 pb-2">eje vertical</p>
<p class="pl-2 pr-4">eje horizontal</p>

<!-- Tipografia -->
<h1 class="text-4xl font-bold">Titulo</h1>
<p class="text-sm text-gray-500">Texto pequeno</p>

<!-- Colores (custom) -->
<div class="bg-leaf text-white">Fondo verde</div>
<div class="bg-clay text-white">Fondo coral</div>
<div class="bg-sun">Fondo naranja</div>

<!-- Estados -->
<button class="hover:bg-leaf">Hover</button>
<button class="focus:outline-none">Focus</button>
<button class="disabled:opacity-50">Disabled</button>

<!-- Responsive -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### Colores personalizados disponibles

| Variable | Color |
|----------|-------|
| `--leaf` | Verde |
| `--clay` | Coral |
| `--sun` | Naranja |
| `--cream` | Crema |
| `--wheat` | Trigo |
| `--earth` | Marron |
| `--charcoal` | Carbon |

---

## Agregar nueva pagina

### 1. Crear vista Django

```python
# app/views.py
@login_required
def mi_pagina(request):
    context = {
        'page_data': {
            'titulo': 'Mi Pagina',
            'datos': [...],
        }
    }
    return render(request, 'app/mi_pagina.html', context)
```

### 2. Crear template

```html
<!-- templates/app/mi_pagina.html -->
{% extends "base.html" %}

{% block content %}
<div id="mi-pagina-root" data-props='{{ page_data|json_script }}'></div>
{% endblock %}
```

### 3. Crear componente React

```tsx
// frontend/src/pages/MiPaginaApp.tsx
interface MiPaginaProps {
  titulo: string;
  datos: any[];
}

export default function MiPaginaApp(props: MiPaginaProps) {
  return (
    <div>
      <h1>{props.titulo}</h1>
      {/* Contenido */}
    </div>
  );
}
```

### 4. Registrar en main.tsx

```tsx
const REACT_APPS = {
  // ...existing
  'mi-pagina-root': () => import('@/pages/MiPaginaApp'),
};
```

### 5. Agregar URL

```python
# app/urls.py
path('mi-pagina/', views.mi_pagina, name='mi_pagina'),
```

---

## Build y Produccion

### Desarrollo
```bash
cd frontend
npm run dev    # Servidor en puerto 3000 con hot reload
```

### Produccion
```bash
cd frontend
npm run build  # Genera static/dist/
```

El build:
- Compila TypeScript
- Optimiza React
- Genera CSS de Tailwind
- Output en `static/dist/`

### Template base incluye CSS

```html
<link rel="stylesheet" href="{% static 'dist/assets/main.css' %}">
<script type="module" src="{% static 'dist/main.js' %}"></script>
```
