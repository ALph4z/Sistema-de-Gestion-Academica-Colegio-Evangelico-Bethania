from typing import Literal, Optional

from pydantic import BaseModel, Field


class EstudianteCreate(BaseModel):
    nombre: str = Field(min_length=1)
    apellido1: str = Field(min_length=1)
    apellido2: Optional[str] = None
    fecha_nacimiento: str
    sexo: Literal["M", "F"]
    acta_nacimiento: Optional[str] = None
    direccion: Optional[str] = None
    telefono_contacto: Optional[str] = None
    tanda: Literal["Matutina", "Vespertina"]
    condicion_especial: Optional[str] = None


class UsuarioCreate(BaseModel):
    nombre_usuario: str = Field(min_length=3)
    contrasena: str = Field(min_length=8)
    nombre_completo: str
    correo: Optional[str] = None
    telefono: Optional[str] = None
    id_rol: int


class MatriculaCreate(BaseModel):
    id_estudiante: int
    id_seccion: int
    tipo: Literal["Nueva", "Reinscripción"]
    id_usuario: int


class PagoCreate(BaseModel):
    id_matricula: int
    numero_comprobante: str = Field(min_length=1)
    monto: float = Field(gt=0)
    tipo_pago: Literal["Completo", "Parcial"]
    metodo_pago: Literal["Efectivo", "Transferencia", "Tarjeta"]
    id_usuario: int
