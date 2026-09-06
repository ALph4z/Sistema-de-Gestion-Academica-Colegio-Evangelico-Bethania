from sqlalchemy.orm import Session
from backend.config.database import Usuario, to_dict
from backend.utils.security import hash_password

def get_usuarios(db: Session):
return [to_dict(u) for u in db.query(Usuario).all()]

def create_usuario(db: Session, data):
nuevo = Usuario(
nombre_usuario=data.nombre_usuario,
contrasena_hash=hash_password(data.contrasena),
nombre_completo=data.nombre_completo,
correo=data.correo,
telefono=data.telefono,
id_rol=data.id_rol,
)
db.add(nuevo)
db.commit()
db.refresh(nuevo)
return to_dict(nuevo)
