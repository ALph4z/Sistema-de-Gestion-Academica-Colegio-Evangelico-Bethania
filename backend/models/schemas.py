from pydantic import BaseModel
from typing import Optional


class EstudianteCreate(BaseModel):
    nombre: str
    apellido1: str
    apellido2: Optional[str] = None
    fecha_nacimiento: str
    sexo: str
    acta_nacimiento: Optional[str] = None
    direccion: Optional[str] = None
    telefono_contacto: Optional[str] = None
    tanda: str
    condicion_especial: Optional[str] = None


class UsuarioCreate(BaseModel):
    nombre_usuario: str
    contrasena: str
    nombre_completo: str
    correo: Optional[str] = None
    telefono: Optional[str] = None
    id_rol: int


class MatriculaCreate(BaseModel):
    id_estudiante: int
    id_seccion: int
    tipo: str
    id_usuario: int


class PagoCreate(BaseModel):
    id_matricula: int
    numero_comprobante: str
    monto: float
    tipo_pago: str
    metodo_pago: str
    id_usuario: int
