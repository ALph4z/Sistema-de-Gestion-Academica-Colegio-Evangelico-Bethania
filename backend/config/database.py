import os
import sqlite3

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.automap import automap_base

from backend.utils.security import hash_password

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

# En Render puedes cambiar la ruta con la variable DATABASE_PATH
DB_PATH = os.environ.get(
    "DATABASE_PATH", os.path.join(BASE_DIR, "database", "bethania.db")
)
SCHEMA_PATH = os.path.join(BASE_DIR, "database", "bethania_sqlite.sql")
PLACEHOLDER_HASH = "REEMPLAZAR_CON_HASH_REAL"


def init_db():
    """Crea la BD desde el script SQL si no existe y fija la clave del admin."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    try:
        hay_tablas = con.execute(
            "SELECT count(*) FROM sqlite_master WHERE type='table' AND name='usuarios'"
        ).fetchone()[0]
        if not hay_tablas:
            with open(SCHEMA_PATH, encoding="utf-8") as f:
                con.executescript(f.read())

        admin_pw = os.environ.get("ADMIN_PASSWORD")
        if admin_pw:
            fila = con.execute(
                "SELECT contrasena_hash FROM usuarios WHERE nombre_usuario='admin'"
            ).fetchone()
            if fila and fila[0] == PLACEHOLDER_HASH:
                con.execute(
                    "UPDATE usuarios SET contrasena_hash=? WHERE nombre_usuario='admin'",
                    (hash_password(admin_pw),),
                )
        con.commit()
    finally:
        con.close()


init_db()

engine = create_engine(
    f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False}
)


@event.listens_for(engine, "connect")
def _activar_claves_foraneas(dbapi_con, _):
    # SQLite NO aplica las FOREIGN KEY si no se activa esto en cada conexión
    cur = dbapi_con.cursor()
    cur.execute("PRAGMA foreign_keys=ON")
    cur.close()


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

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

CAMPOS_OCULTOS = {"contrasena_hash"}


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def to_dict(obj):
    """Fila ORM -> dict JSON, sin campos sensibles (hash de contraseña)."""
    return {
        c.key: getattr(obj, c.key)
        for c in obj.__table__.columns
        if c.key not in CAMPOS_OCULTOS
    }
