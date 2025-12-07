# Docker - Chatbot

## Resumen
- Integración con **Google Gemini AI**
- Autenticación **JWT** segura
- Despliegue rápido con **Docker** y **Docker Compose**
- Compatible con **MySQL** y **SQLite**
- Preparado para producción con **Nginx + Gunicorn**
- Código limpio y profesional

## Inicio Rápido

```bash
# Construir y ejecutar
docker build -t chat-bot .
docker run -d -p 5000:5000 -e GEMINI_API_KEY=tu_key chat-bot

# Con persistencia de datos
docker run -d -p 5000:5000 \
  -e GEMINI_API_KEY=tu_key \
  -v $(pwd)/data:/app/instance \
  chat-bot
```

## Comandos Útiles

```bash
docker logs chat-bot        # Ver logs
docker stop chat-bot        # Detener
docker restart chat-bot     # Reiniciar
```

## Base de Datos

**SQLite** (por defecto, desarrollo)  
**MySQL** (producción, con `docker-compose.yml`)

```bash
# Configuración MySQL
cp .env.docker.example .env.local
docker-compose up -d
# Migraciones
docker-compose exec chat-bot flask db upgrade
```

## Desarrollo

```bash
# Hot-reload para desarrollo
# (requiere docker-compose.dev.yml)
docker-compose -f docker-compose.dev.yml up
```

## Producción

**Recomendado:** Usar **Nginx + Gunicorn** para servir Flask en producción.

```bash
# Despliegue producción
# (modifica Dockerfile para usar Gunicorn)
docker-compose up -d
```

> Ejemplo de configuración mínima de Nginx:
>
> ```nginx
> server {
>     listen 80;
>     server_name tu-dominio.com;
> 
>     location / {
>         proxy_pass http://chat-bot:5000;
>         proxy_set_header Host $host;
>         proxy_set_header X-Real-IP $remote_addr;
>         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>         proxy_set_header X-Forwarded-Proto $scheme;
>     }
> }

## Docker Compose

**Multi-servicio:** MySQL + Nginx + Flask

```bash
# Despliegue full stack
cp .env.docker.example .env.local
docker-compose up -d --build
```

**Ventajas:** Redes automáticas, gestión de variables, arquitectura escalable

---

**Stack:** Docker + Docker Compose + Nginx + Gunicorn + MySQL + Flask
