# Chat Bot con IA - Flask & Google Gemini

Aplicación web de chatbot inteligente con Flask, Google Gemini AI, autenticación JWT y interfaz moderna.

## 🚀 Características

- **Interfaz moderna** y responsive
- **Autenticación JWT** segura
- **Google Gemini AI** integrado
- **Historial persistente** en base de datos
- **API RESTful** completa
- **Docker** ready
- **MySQL/SQLite** compatible

## 🛠️ Stack Tecnológico

- **Backend**: Flask, SQLAlchemy, JWT
- **Frontend**: HTML5, CSS3, JavaScript
- **Base de Datos**: SQLite / MySQL
- **IA**: Google Gemini API
- **Deployment**: Docker, Docker Compose

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

# Configurar .env con tu GEMINI_API_KEY
cp .env.example .env

# Base de datos
flask db upgrade

# Ejecutar
python run.py
```

**URL**: `http://localhost:5000`

## 🎯 Uso

1. Registrarse o iniciar sesión
2. Chatear con el asistente IA
3. Historial automático guardado

**Funcionalidades**: Typing effect, modales, responsive design, API REST

## 📁 Estructura del Proyecto

```
chat-bot/
├── app/                # Módulos de Flask (rutas, modelos, utilidades)
├── static/             # Archivos estáticos (HTML, CSS, JS)
├── migrations/         # Migraciones de base de datos
├── Dockerfile          # Imagen Docker
├── docker-compose.yml  # Configuración de servicios
├── run.py              # Punto de entrada de la app
└── README.md           # Documentación del proyecto

La aplicación sigue una estructura modular en Flask, separando rutas, modelos, utilidades y archivos estáticos para mantener un código limpio y escalable.
```

## 🔌 API Endpoints

**Auth**: `/auth/register`, `/auth/login`, `/auth/me`  
**Chat**: `/chat/send`, `/chat/history`, `/chat/clear`, `/chat/stats`

## 🗄️ Base de Datos

**SQLite** (desarrollo) / **MySQL** (producción)  
Migraciones con Flask-Migrate

## 🐳 Docker

🔧 ¿Prefieres Docker?

Consulta la guía detallada en [`README-Docker.md`](./README-Docker.md)


```bash
# Construir y ejecutar
docker build -t chat-bot .
docker run -d -p 5000:5000 -e GEMINI_API_KEY=tu_key chat-bot
```

**Docker Compose**: Ver `docker-compose.yml` para MySQL + Nginx

## 🚀 Deployment

**Manual**: Gunicorn + MySQL  
**Docker**: Dockerfile + Docker Compose  
**Producción**: Nginx + Gunicorn + SSL ready

---

**Stack**: Flask + SQLAlchemy + JWT + Google Gemini AI + Docker