from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.config.database import get_db
from backend.models.schemas import PagoCreate
from backend.controllers import pagos_controller as ctrl


router = APIRouter(
    prefix="/pagos",
    tags=["Pagos"]
)


@router.get("/")
def listar(db: Session = Depends(get_db)):
    return ctrl.get_pagos(db)


@router.post("/")
def crear(
    data: PagoCreate,
    db: Session = Depends(get_db)
):
    return ctrl.create_pago(db, data)
