from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.config.database import get_db
from backend.models.schemas import MatriculaCreate
from backend.controllers import matriculas_controller as ctrl

router = APIRouter(prefix=”/matriculas”, tags=[“Matriculas”])

@router.get(”/”)
def listar(db: Session = Depends(get_db)):
return ctrl.get_matriculas(db)

@router.post(”/”)
def crear(data: MatriculaCreate, db: Session = Depends(get_db)):
return ctrl.create_matricula(db, data)
