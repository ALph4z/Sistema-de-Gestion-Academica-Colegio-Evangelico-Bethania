from sqlalchemy.orm import Session
from backend.config.database import Estudiante, to_dict

def get_estudiantes(db: Session):
return [to_dict(e) for e in db.query(Estudiante).all()]

def get_estudiante(db: Session, id_estudiante: int):
e = db.query(Estudiante).filter_by(id_estudiante=id_estudiante).first()
return to_dict(e) if e else None

def create_estudiante(db: Session, data):
nuevo = Estudiante(**data.dict())
db.add(nuevo)
db.commit()
db.refresh(nuevo)
return to_dict(nuevo)
