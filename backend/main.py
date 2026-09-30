import os

from fastapi import Depends, FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError

from backend.middlewares.cors_middleware import setup_cors
from backend.routes import (
    auth_routes,
    estudiantes_routes,
    usuarios_routes,
    matriculas_routes,
    pagos_routes,
)
from backend.utils.auth import get_current_user

app = FastAPI(title="API EduBethania")

setup_cors(app)


@app.exception_handler(IntegrityError)
async def integridad_handler(request: Request, exc: IntegrityError):
    # Duplicados, claves foráneas inexistentes, CHECK fallidos -> 409 en vez de 500
    return JSONResponse(
        status_code=409,
        content={"detail": "Datos inválidos o duplicados (violación de integridad)"},
    )


@app.get("/health")
def health():
    return {"estado": "ok"}


# Login público
app.include_router(auth_routes.router, prefix="/api")

# Todo lo demás exige token
protegido = [Depends(get_current_user)]
for r in (
    estudiantes_routes,
    usuarios_routes,
    matriculas_routes,
    pagos_routes,
):
    app.include_router(r.router, prefix="/api", dependencies=protegido)

# Frontend estático (debe ir al final para no tapar /api ni /health)
FRONTEND_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend"
)
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
