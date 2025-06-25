from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User
from app.schemas import UserRegistrationSchema, UserLoginSchema
from app.utils import handle_validation_error, format_error_response, format_success_response
from marshmallow import ValidationError

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@handle_validation_error
def register():
    """Registrar un nuevo usuario"""
    schema = UserRegistrationSchema()
    
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        return format_error_response('Datos de entrada inválidos', 400, e.messages)
    
    # Verificar si el usuario ya existe
    if User.query.filter_by(email=data['email']).first():
        return format_error_response('El email ya está registrado', 409)
    
    # Crear nuevo usuario
    user = User(email=data['email'])
    user.set_password(data['password'])
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # Crear token JWT
        access_token = create_access_token(identity=user.id)
        
        return format_success_response({
            'user': user.to_dict(),
            'access_token': access_token
        }, 'Usuario registrado exitosamente', 201)
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error al registrar usuario: {str(e)}')
        return format_error_response('Error interno del servidor', 500)

@auth_bp.route('/login', methods=['POST'])
@handle_validation_error
def login():
    """Iniciar sesión de usuario"""
    schema = UserLoginSchema()
    
    try:
        data = schema.load(request.get_json())
    except ValidationError as e:
        return format_error_response('Datos de entrada inválidos', 400, e.messages)
    
    # Buscar usuario
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return format_error_response('Credenciales inválidas', 401)
    
    # Crear token JWT
    access_token = create_access_token(identity=user.id)
    
    return format_success_response({
        'user': user.to_dict(),
        'access_token': access_token
    }, 'Inicio de sesión exitoso')

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Obtener información del usuario actual"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return format_error_response('Usuario no encontrado', 404)
    
    return format_success_response(user.to_dict())

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Cerrar sesión (en el frontend se debe eliminar el token)"""
    return format_success_response({}, 'Sesión cerrada exitosamente')