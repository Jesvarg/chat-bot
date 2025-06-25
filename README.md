# Chat Bot con IA - Flask & Google Gemini

Una aplicación web de chatbot inteligente construida con Flask y Google Gemini AI, que incluye autenticación JWT, persistencia de historial y una interfaz moderna y elegante.

## 🚀 Características

- **Interfaz moderna y minimalista**: Diseño elegante y responsive.
- **Autenticación segura**: Sistema de registro/login con JWT
- **Integración con Google Gemini 1.5 Flash**: Respuestas inteligentes y rápidas de IA
- **Historial persistente**: Guarda todas las conversaciones en base de datos
- **Efectos visuales avanzados**: Typing effect, modales de confirmación elegantes
- **Tiempo real**: Indicadores de escritura y respuestas instantáneas
- **Responsive**: Funciona perfectamente en móviles y escritorio
- **API RESTful**: Fácil integración con otras aplicaciones
- **Soporte multi-base de datos**: SQLite (desarrollo) y MySQL/PostgreSQL (producción)

## 🛠️ Tecnologías Utilizadas

- **Backend**: Python Flask + SQLAlchemy
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción)
- **Autenticación**: Flask-JWT-Extended con tokens seguros
- **IA**: Google Gemini 1.5 Flash API
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Estilos**: CSS Grid/Flexbox, animaciones CSS, modales personalizados
- **Efectos**: Typing effect, smooth scrolling, confirmaciones elegantes
- **Migración**: Flask-Migrate para control de versiones de BD
- **Seguridad**: CORS, bcrypt para passwords, JWT tokens

## 📋 Requisitos Previos

- Python 3.8 o superior
- API Key de Google Gemini
- Git (opcional)

## 🔧 Instalación

### 1. Clonar o descargar el proyecto

```bash
git clone <url-del-repositorio>
cd chat-bot
```

### 2. Crear entorno virtual

```bash
python -m venv env
```

### 3. Activar entorno virtual

**Windows:**
```bash
env\Scripts\activate
```

**macOS/Linux:**
```bash
source env/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Configurar variables de entorno

El archivo `.env` ya está incluido con la configuración básica. Asegúrate de que contenga:

```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=tu_secreto_muy_seguro_para_flask_2024
JWT_SECRET_KEY=otro_secreto_jwt_muy_seguro_2024
DATABASE_URL=sqlite:///chat.db
GEMINI_API_KEY=tu_api_key_de_gemini
```

**Importante**: En producción, cambia las claves secretas por valores seguros.

### 6. Inicializar la base de datos

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 7. Ejecutar la aplicación

```bash
python run.py
```

La aplicación estará disponible en: `http://localhost:5000`

## 🎯 Uso

### Registro y Login
1. Abre `http://localhost:5000` en tu navegador
2. Crea una cuenta nueva o inicia sesión
3. Comienza a chatear con el asistente IA

### Funcionalidades del Chat
- **Enviar mensajes**: Escribe y presiona Enter o haz clic en enviar
- **Historial persistente**: Todas las conversaciones se guardan automáticamente
- **Efecto de escritura**: El bot "escribe" gradualmente las respuestas (velocidad ajustable)
- **Modales de confirmación**: Diálogos elegantes para limpiar historial y cerrar sesión
- **Scroll automático**: Se desplaza suavemente mientras el bot escribe
- **Indicador de escritura**: Animación de puntos mientras el bot procesa
- **Contador de caracteres**: Límite visual en el input de mensajes
- **Responsive design**: Interfaz adaptable a móviles y escritorio
- **Favicon personalizado**: Icono SVG de robot con chat bubble

## 📁 Estructura del Proyecto

```
chat-bot/
├── app/
│   ├── __init__.py          # Inicialización de Flask
│   ├── config.py            # Configuración de la aplicación
│   ├── models.py            # Modelos de base de datos
│   ├── schemas.py           # Esquemas de validación
│   ├── utils.py             # Funciones auxiliares
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py          # Rutas de autenticación
│   │   └── chat.py          # Rutas del chat
│   └── static/
│       ├── index.html       # Interfaz principal
│       ├── style.css        # Estilos CSS
│       └── script.js        # Lógica JavaScript
├── migrations/              # Migraciones de base de datos
├── requirements.txt         # Dependencias Python
├── .env                     # Variables de entorno
├── run.py                   # Punto de entrada
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual
- `POST /auth/logout` - Cerrar sesión

### Chat
- `POST /chat/send` - Enviar mensaje al chatbot
- `GET /chat/history` - Obtener historial de conversaciones
- `DELETE /chat/clear` - Limpiar historial
- `GET /chat/stats` - Estadísticas del chat


## 🗄️ Base de Datos

**SQLite** - Base de datos por defecto, perfecta para desarrollo y producción pequeña.

**Para MySQL** (si necesitas integrar con Laravel):
- Consulta el archivo `mysql_setup.md` para instrucciones detalladas
- Cambia `DATABASE_URL` en `.env`
- Ejecuta las migraciones

## 🚀 Despliegue

### Para producción:
1. Cambia las claves secretas en `.env`
2. Usa MySQL si necesitas integrar con Laravel
3. Instala Gunicorn: `pip install gunicorn`
4. Ejecuta: `gunicorn -w 4 -b 0.0.0.0:5000 run:app`

## 🛠️ Personalización

- **Modelo IA**: Cambia el modelo en `app/utils.py`
- **Estilos**: Edita `app/static/style.css`
- **Funcionalidades**: Agrega rutas en `app/routes/`

## 🐛 Problemas Comunes

**Error de API Key**: Verifica tu clave de Gemini en `.env`

**Error de BD**: Ejecuta `flask db upgrade`

---

**Proyecto educativo** - Flask, SQLAlchemy, JWT y Google Gemini AI