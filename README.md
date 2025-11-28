# Chatbot con IA - Flask & Google Gemini

Aplicación web de chatbot inteligente con Flask, Google Gemini AI, autenticación JWT e interfaz moderna.

## 🚀 Características

- **Interfaz moderna** y responsive
- **Autenticación JWT** segura
- **Google Gemini AI** integrado
- **Historial persistente** en base de datos
- **API RESTful**
- **Docker** ready
- **MySQL/SQLite** compatible

## 🏗️ Stack

**Backend**: Flask + SQLAlchemy + JWT + Google Gemini AI  
**Frontend**: HTML5 + CSS3 + JavaScript  
**Database**: SQLite/MySQL + Flask-Migrate
**Deploy**: Docker + Docker Compose + Nginx

## 📋 Requisitos

- Python 3.8+
- Google Gemini API Key
- Docker (opcional)

## 🔧 Instalación

```bash
# Clonar proyecto
git clone https://github.com/Jesvarg/chat-bot
cd chat-bot

# Entorno virtual
python -m venv env
env\Scripts\activate  # Windows
# source env/bin/activate  # Linux/Mac

# Dependencias
pip install -r requirements.txt

Configurar .env con tu GEMINI_API_KEY
El archivo `.env.example` ya está incluido con la configuración básica.
cp .env.example .env.local

# Inicializar base de datos
flask db upgrade

# Ejecutar
python run.py
```

**URL**: `http://localhost:5000`

## 🎯 Uso

1. Registrarse o iniciar sesión
2. Chatear con el asistente IA
3. Historial automático guardado

## 📁 Estructura del Proyecto

```
chat-bot/
├── app/                # Módulos de Flask (rutas, modelos, utilidades)
│   ├── routes/         # Rutas de la API
│   ├── static/         # Archivos estáticos (HTML, CSS, JS)
│   ├── models.py       # Modelos de base de datos
│   └── utils.py        # Utilidades y helpers
├── migrations/         # Migraciones de base de datos
├── Dockerfile          # Imagen Docker
├── docker-compose.yml  # Configuración de servicios
├── run.py              # Punto de entrada de la app
└── README.md           # Documentación del proyecto
```

> La aplicación sigue una **estructura modular** en Flask, separando rutas, modelos, utilidades y archivos estáticos para mantener un código limpio y escalable.

## 🔌 API Endpoints

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Perfil del usuario

### Chat
- `POST /chat/send` - Enviar mensaje
- `GET /chat/history` - Historial de chat
- `DELETE /chat/clear` - Limpiar historial
- `GET /chat/stats` - Estadísticas del chat

## Base de Datos

- **SQLite** (desarrollo)
- **MySQL** (producción)
- **Migraciones** con Flask-Migrate

## 🐳 Docker

**Instalación con Docker**

Consulta la guía en [`README-Docker.md`](./README-Docker.md)

```bash
# Construir y ejecutar
docker build -t chat-bot .
docker run -d -p 5000:5000 -e GEMINI_API_KEY=tu_key chat-bot
```

**Docker Compose**: Ver `docker-compose.yml` para MySQL + Nginx + Gunicorn

## 🚀 Despliegue

### Opciones de Despliegue
- **Manual**: Gunicorn + MySQL
- **Docker**: Dockerfile + Docker Compose
- **Producción**: Nginx + Gunicorn + SSL ready

---
