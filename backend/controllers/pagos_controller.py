from sqlalchemy.orm import Session
from backend.config.database import Pago, to_dict

def get_pagos(db: Session):
return [to_dict(p) for p in db.query(Pago).all()]

def create_pago(db: Session, data):
nuevo = Pago(**data.dict())
db.add(nuevo)
db.commit()
db.refresh(nuevo)
return to_dict(nuevo)
