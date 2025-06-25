from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, ChatMessage
from app.schemas import ChatMessageSchema
from app.utils import handle_validation_error, format_error_response, format_success_response, get_gemini_response
from marshmallow import ValidationError
from sqlalchemy import desc

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/send', methods=['POST'])
@jwt_required()
@handle_validation_error
def send_message():
    """Enviar mensaje al chatbot y obtener respuesta de Gemini"""
    current_user_id = get_jwt_identity()
    schema = ChatMessageSchema()
    
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        return format_error_response('Datos de entrada inválidos', 400, e.messages)
    
    user_message = data['content'].strip()
    
    if not user_message:
        return format_error_response('El mensaje no puede estar vacío', 400)
    
    try:
        # Guardar mensaje del usuario
        user_chat_message = ChatMessage(
            user_id=current_user_id,
            role='user',
            content=user_message
        )
        db.session.add(user_chat_message)
        
        # Obtener respuesta de Gemini
        try:
            ai_response = get_gemini_response(user_message)
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f'Error de Gemini API: {str(e)}')
            return format_error_response('Error al comunicarse con el servicio de IA', 502)
        
        # Guardar respuesta del asistente
        assistant_chat_message = ChatMessage(
            user_id=current_user_id,
            role='assistant',
            content=ai_response
        )
        db.session.add(assistant_chat_message)
        
        # Confirmar transacción
        db.session.commit()
        
        return format_success_response({
            'user_message': user_chat_message.to_dict(),
            'assistant_response': assistant_chat_message.to_dict()
        }, 'Mensaje enviado exitosamente')
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error al procesar mensaje: {str(e)}')
        return format_error_response('Error interno del servidor', 500)

@chat_bp.route('/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    """Obtener historial de chat del usuario actual"""
    current_user_id = get_jwt_identity()
    
    # Parámetros de paginación
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    
    # Limitar per_page para evitar sobrecarga
    per_page = min(per_page, 100)
    
    try:
        # Obtener mensajes paginados
        messages_query = ChatMessage.query.filter_by(user_id=current_user_id).order_by(desc(ChatMessage.timestamp))
        
        paginated_messages = messages_query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        # Convertir a diccionarios y revertir orden para mostrar cronológicamente
        messages = [msg.to_dict() for msg in reversed(paginated_messages.items)]
        
        return format_success_response({
            'messages': messages,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated_messages.total,
                'pages': paginated_messages.pages,
                'has_next': paginated_messages.has_next,
                'has_prev': paginated_messages.has_prev
            }
        })
        
    except Exception as e:
        current_app.logger.error(f'Error al obtener historial: {str(e)}')
        return format_error_response('Error interno del servidor', 500)

@chat_bp.route('/clear', methods=['DELETE'])
@jwt_required()
def clear_chat_history():
    """Limpiar todo el historial de chat del usuario"""
    current_user_id = get_jwt_identity()
    
    try:
        # Eliminar todos los mensajes del usuario
        deleted_count = ChatMessage.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()
        
        return format_success_response({
            'deleted_messages': deleted_count
        }, f'Se eliminaron {deleted_count} mensajes del historial')
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error al limpiar historial: {str(e)}')
        return format_error_response('Error interno del servidor', 500)

@chat_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_chat_stats():
    """Obtener estadísticas del chat del usuario"""
    current_user_id = get_jwt_identity()
    
    try:
        total_messages = ChatMessage.query.filter_by(user_id=current_user_id).count()
        user_messages = ChatMessage.query.filter_by(user_id=current_user_id, role='user').count()
        assistant_messages = ChatMessage.query.filter_by(user_id=current_user_id, role='assistant').count()
        
        # Obtener el último mensaje
        last_message = ChatMessage.query.filter_by(user_id=current_user_id).order_by(desc(ChatMessage.timestamp)).first()
        
        return format_success_response({
            'total_messages': total_messages,
            'user_messages': user_messages,
            'assistant_messages': assistant_messages,
            'last_message_date': last_message.timestamp.isoformat() if last_message else None
        })
        
    except Exception as e:
        current_app.logger.error(f'Error al obtener estadísticas: {str(e)}')
        return format_error_response('Error interno del servidor', 500)