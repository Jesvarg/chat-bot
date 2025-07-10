from flask import Flask
from app import create_app
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación Flask
app = create_app()

if __name__ == '__main__':
    # Configuración para localhost
    app.run(debug=True, host='localhost', port=5000)