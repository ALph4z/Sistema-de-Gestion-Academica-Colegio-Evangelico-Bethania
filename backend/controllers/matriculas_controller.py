from sqlalchemy.orm import Session
from backend.config.database import Matricula, to_dict

def get_matriculas(db: Session):
return [to_dict(m) for m in db.query(Matricula).all()]

def create_matricula(db: Session, data):
nueva = Matricula(estado=“Pendiente”, **data.dict())
db.add(nueva)
db.commit()
db.refresh(nueva)
return to_dict(nueva)
