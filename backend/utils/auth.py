import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.config.database import Usuario, get_db

SECRET_KEY = os.environ.get("SECRET_KEY", "cambia-esto-solo-para-desarrollo")
ALGORITHM = "HS256"
HORAS_VALIDEZ = 8

bearer = HTTPBearer(auto_error=False)


def crear_token(id_usuario: int, id_rol: int) -> str:
    payload = {
        "sub": str(id_usuario),
        "rol": id_rol,
        "exp": datetime.now(timezone.utc) + timedelta(hours=HORAS_VALIDEZ),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    if cred is None:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        data = jwt.decode(cred.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido o vencido")

    user = db.query(Usuario).filter_by(id_usuario=int(data["sub"])).first()
    if not user or not user.activo:
        raise HTTPException(status_code=401, detail="Usuario inactivo")
    return user
