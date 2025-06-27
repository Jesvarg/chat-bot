from functools import wraps
from flask import jsonify, current_app
import google.generativeai as genai
import os
from marshmallow import ValidationError
from functools import wraps

def handle_validation_error(func):
    """Decorador para manejar errores de validación de Marshmallow"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ValidationError as e:
            return jsonify({
                'error': 'Datos de entrada inválidos',
                'details': e.messages
            }), 400
        except Exception as e:
            current_app.logger.error(f'Error inesperado: {str(e)}')
            return jsonify({
                'error': 'Error interno del servidor'
            }), 500
    return wrapper

def get_gemini_response(user_message):
    """Función para obtener respuesta de Google Gemini"""
    try:
        # Configurar la API de Gemini
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        
        # Crear el modelo (usando gemini-1.5-flash que es más reciente y gratuito)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generar respuesta
        response = model.generate_content(user_message)
        
        if response.text:
            return response.text
        else:
            return "Lo siento, no pude generar una respuesta en este momento."
            
    except Exception as e:
        current_app.logger.error(f'Error al comunicarse con Gemini: {str(e)}')
        raise Exception("Error al comunicarse con el servicio de IA")

def format_error_response(message, status_code=400, details=None):
    """Función auxiliar para formatear respuestas de error"""
    response = {'error': message}
    if details:
        response['details'] = details
    return jsonify(response), status_code

def format_success_response(data, message=None, status_code=200):
    """Función auxiliar para formatear respuestas exitosas"""
    response = {'data': data}
    if message:
        response['message'] = message
    return jsonify(response), status_code