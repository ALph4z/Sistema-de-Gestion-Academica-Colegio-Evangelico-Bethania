from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.config.database import Usuario, get_db
from backend.utils.auth import crear_token
from backend.utils.security import verify_password

router = APIRouter(prefix="/auth", tags=["Autenticación"])


class LoginData(BaseModel):
    nombre_usuario: str
    contrasena: str


@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(Usuario).filter_by(nombre_usuario=data.nombre_usuario).first()
    if (
        not user
        or not user.activo
        or not verify_password(data.contrasena, user.contrasena_hash)
    ):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    return {
        "access_token": crear_token(user.id_usuario, user.id_rol),
        "token_type": "bearer",
        "usuario": {
            "id_usuario": user.id_usuario,
            "nombre_completo": user.nombre_completo,
            "id_rol": user.id_rol,
        },
    }
