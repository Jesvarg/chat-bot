# Usar imagen oficial de Python 3.11 slim para menor tamaño
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY . .

# Crear directorio para la base de datos SQLite
RUN mkdir -p /app/instance

# Exponer puerto 5000
EXPOSE 5000

# Crear usuario no-root para seguridad
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

# Comando por defecto (desarrollo)
CMD ["python", "run.py"]

# Para producción, usar Gunicorn (descomenta la línea siguiente)
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "run:app"]