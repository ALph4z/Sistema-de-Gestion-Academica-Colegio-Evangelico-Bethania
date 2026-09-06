import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base

# Ruta al archivo .db (generado a partir de database/bethania_sqlite.sql)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(**file**))))
DB_PATH = os.path.join(BASE_DIR, “database”, “bethania.db”)
DATABASE_URL = f”sqlite:///{DB_PATH}”

engine = create_engine(DATABASE_URL, connect_args={“check_same_thread”: False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Reflexión automática: mapea todas las tablas que ya existen en el .db,

# sin necesidad de reescribir cada modelo a mano

Base = automap_base()
Base.prepare(autoload_with=engine)

Rol = Base.classes.roles
Usuario = Base.classes.usuarios
Tutor = Base.classes.tutores
PeriodoEscolar = Base.classes.periodos_escolares
Estudiante = Base.classes.estudiantes
Curso = Base.classes.cursos
Seccion = Base.classes.secciones
Profesor = Base.classes.profesores
Asignatura = Base.classes.asignaturas
Matricula = Base.classes.matriculas
DocumentoRequerido = Base.classes.documentos_requeridos
Pago = Base.classes.pagos
Calificacion = Base.classes.calificaciones

def get_db():
db = SessionLocal()
try:
yield db
finally:
db.close()

def to_dict(obj):
“”“Convierte una fila ORM (mapeada por automap) en un diccionario serializable a JSON.”””
return {c.key: getattr(obj, c.key) for c in obj.**table**.columns}
