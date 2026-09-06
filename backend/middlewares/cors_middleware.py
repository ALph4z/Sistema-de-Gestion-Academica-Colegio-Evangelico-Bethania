from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
app.add_middleware(
CORSMiddleware,
allow_origins=[”*”],  # en producción, restringe al dominio real del frontend
allow_methods=[”*”],
allow_headers=[”*”],
)
