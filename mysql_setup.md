# Configuración MySQL para Chat Bot

## Guía paso a paso para migrar de SQLite a MySQL

### 1. Instalar dependencias MySQL

```bash
pip install PyMySQL mysqlclient
```

### 2. Actualizar requirements.txt

Agregar estas líneas al archivo `requirements.txt`:

```txt
PyMySQL==1.1.0
mysqlclient==2.2.0
```

### 3. Crear base de datos MySQL

```sql
-- Conectar a MySQL como root
mysql -u root -p

-- Crear base de datos
CREATE DATABASE chatbot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico (opcional pero recomendado)
CREATE USER 'chatbot_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON chatbot_db.* TO 'chatbot_user'@'localhost';
FLUSH PRIVILEGES;

-- Salir
EXIT;
```

### 4. Configurar variables de entorno

Actualizar el archivo `.env`:

```env
# Cambiar esta línea:
# DATABASE_URL=sqlite:///chat.db

# Por esta (usando usuario específico):
DATABASE_URL=mysql+pymysql://chatbot_user:tu_password_seguro@localhost:3306/chatbot_db

# O usando root (no recomendado para producción):
# DATABASE_URL=mysql+pymysql://root:tu_password_root@localhost:3306/chatbot_db

# Para integración con Laravel (misma BD):
# DATABASE_URL=mysql+pymysql://usuario_laravel:password@localhost:3306/laravel_db
```

### 5. Migrar datos existentes (opcional)

Si tienes datos en SQLite que quieres conservar:

```bash
# Exportar datos de SQLite
sqlite3 instance/chat.db .dump > backup_sqlite.sql

# Convertir y importar a MySQL (requiere edición manual del archivo)
# O usar herramientas como sqlite3-to-mysql
```

### 6. Ejecutar migraciones

```bash
# Eliminar migraciones existentes (si es necesario)
rm -rf migrations/

# Reinicializar migraciones
flask db init
flask db migrate -m "Initial MySQL migration"
flask db upgrade
```

### 7. Verificar conexión

Ejecutar la aplicación y verificar que se conecte correctamente:

```bash
python run.py
```

## Configuración (Ejemplo especifico para Laravel)

### Opción 1: Base de datos compartida

1. Usar la misma configuración de BD que Laravel
2. Configurar `DATABASE_URL` apuntando a la BD de Laravel
3. Las tablas del chat se crearán automáticamente sin conflictos

### Opción 2: Bases de datos separadas con comunicación

```python
# En app/config.py - agregar configuración adicional
class Config:
    # ... configuración existente ...
    
    # Base de datos principal del chat
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    
    # Base de datos de Laravel (para consultas de usuarios)
    LARAVEL_DATABASE_URI = os.environ.get('LARAVEL_DATABASE_URL')
```

## Troubleshooting

### Error de conexión MySQL

```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS
# En Windows: Services.msc -> MySQL

# Verificar puerto
netstat -tlnp | grep :3306
```

### Error de autenticación

```sql
-- Si usas MySQL 8.0+, puede requerir cambio de plugin de autenticación
ALTER USER 'chatbot_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```

### Error de charset

```sql
-- Verificar charset de la base de datos
SHOW CREATE DATABASE chatbot_db;

-- Cambiar si es necesario
ALTER DATABASE chatbot_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Ventajas de MySQL vs SQLite

✅ **MySQL:**
- Mejor rendimiento con múltiples usuarios
- Soporte completo para transacciones concurrentes
- Integración nativa con Laravel
- Mejor para producción
- Soporte para replicación y backup

⚠️ **SQLite:**
- Perfecto para desarrollo
- Sin configuración adicional
- Archivo único y portable
- Limitado para concurrencia

## Recomendación

**Para desarrollo:** Mantener SQLite
**Para producción/Laravel:** Migrar a MySQL

La aplicación está diseñada para funcionar con ambas sin cambios en el código.