from fastapi import FastAPI
from backend.middlewares.cors_middleware import setup_cors
from backend.routes import (
    estudiantes_routes,
    usuarios_routes,
    matriculas_routes,
    pagos_routes,
)

app = FastAPI(title="API EduBethania")

setup_cors(app)

app.include_router(estudiantes_routes.router)
app.include_router(usuarios_routes.router)
app.include_router(matriculas_routes.router)
app.include_router(pagos_routes.router)


@app.get("/")
def root():
    return {"mensaje": "API EduBethania funcionando"}
