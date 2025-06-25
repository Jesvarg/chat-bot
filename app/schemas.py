from marshmallow import Schema, fields, validate

class UserRegistrationSchema(Schema):
    email = fields.Email(required=True, validate=validate.Length(min=5, max=120))
    password = fields.Str(required=True, validate=validate.Length(min=6, max=50))

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)

class ChatMessageSchema(Schema):
    content = fields.Str(required=True, validate=validate.Length(min=1, max=5000))

class ChatResponseSchema(Schema):
    role = fields.Str()
    content = fields.Str()
    timestamp = fields.DateTime()

class ChatHistorySchema(Schema):
    messages = fields.List(fields.Nested(ChatResponseSchema))
    total = fields.Int()