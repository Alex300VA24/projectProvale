# PROVALE - Sistema de Gestion Social

## Descripcion

PROVALE es un sistema de gestion social desarrollado con Django (backend) y React (frontend) para la administracion de beneficiarios, clubes de madres y seguimiento de entregas del programa social.

## Tecnologias

### Backend
- **Django 5.2** - Framework web Python
- **MSSQL** - Base de datos
- **Django REST Framework** - API

### Frontend
- **React 18** - Libreria de interfaces de usuario
- **TypeScript** - Tipado estatico
- **Tailwind CSS 3** - Estilos
- **Vite** - Build tool y servidor de desarrollo

## Estructura del Proyecto

```
sistema_provale/
├── sistema_provale/          # Configuracion Django
├── core/                    # App core (dashboard, navbar)
├── usuarios/                # App usuarios (auth, factories, seeders)
├── beneficiarios/           # App beneficiarios
├── templates/               # Templates Django
├── static/                 # Archivos estaticos
└── frontend/               # Codigo fuente React
```

## Como ejecutar

### Requisitos
- Python 3.10+
- Node.js 18+
- SQL Server (MSSQL)

### Instalacion

1. **Instalar dependencias Python:**
   ```bash
   pip install django djangorestframework mssql-django python-decouple
   ```

2. **Instalar dependencias Node:**
   ```bash
   cd frontend
   npm install
   ```

3. **Ejecutar migraciones:**
   ```bash
   python manage.py migrate
   ```

4. **Build del frontend:**
   ```bash
   cd frontend
   npm run build
   ```

5. **Ejecutar servidor:**
   ```bash
   python manage.py runserver
   ```

## Comandos utiles

### Seeders y Factories
```bash
# Poblar datos iniciales
python manage.py seed

# Generar datos de prueba
python manage.py generate_test_data --users=100
```

### Frontend
```bash
# Desarrollo
cd frontend && npm run dev

# Build produccion
cd frontend && npm run build
```

## Paginas principales

- **Dashboard:** `/` - Panel principal
- **Login:** `/login/`
- **Register:** `/register/`
- **Beneficiarios:** `/beneficiarios/`

## Contribuir

1. Fork del repositorio
2. Crear rama feature
3. Commit de cambios
4. Push y Pull Request
