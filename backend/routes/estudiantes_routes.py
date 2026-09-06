from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.config.database import get_db
from backend.models.schemas import EstudianteCreate
from backend.controllers import estudiantes_controller as ctrl


router = APIRouter(
    prefix="/estudiantes",
    tags=["Estudiantes"]
)


@router.get("/")
def listar(db: Session = Depends(get_db)):
    return ctrl.get_estudiantes(db)


@router.get("/{id_estudiante}")
def obtener(
    id_estudiante: int,
    db: Session = Depends(get_db)
):
    resultado = ctrl.get_estudiante(db, id_estudiante)

    if not resultado:
        raise HTTPException(
            status_code=404,
            detail="Estudiante no encontrado"
        )

    return resultado


@router.post("/")
def crear(
    data: EstudianteCreate,
    db: Session = Depends(get_db)
):
    return ctrl.create_estudiante(db, data)
