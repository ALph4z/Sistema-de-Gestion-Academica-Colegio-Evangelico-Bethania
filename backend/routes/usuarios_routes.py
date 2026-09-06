from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.config.database import get_db
from backend.models.schemas import UsuarioCreate
from backend.controllers import usuarios_controller as ctrl

router = APIRouter(prefix=”/usuarios”, tags=[“Usuarios”])

@router.get(”/”)
def listar(db: Session = Depends(get_db)):
return ctrl.get_usuarios(db)

@router.post(”/”)
def crear(data: UsuarioCreate, db: Session = Depends(get_db)):
return ctrl.create_usuario(db, data)
