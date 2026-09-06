PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS calificaciones;
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS matricula_documentos;
DROP TABLE IF EXISTS documentos_requeridos;
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS profesor_seccion_asignatura;
DROP TABLE IF EXISTS asignaturas;
DROP TABLE IF EXISTS profesores;
DROP TABLE IF EXISTS secciones;
DROP TABLE IF EXISTS cursos;
DROP TABLE IF EXISTS estudiante_tutor;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS tutores;
DROP TABLE IF EXISTS periodos_escolares;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_rol TEXT NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario TEXT NOT NULL UNIQUE,
    contrasena_hash TEXT NOT NULL,
    nombre_completo TEXT NOT NULL,
    correo TEXT UNIQUE,
    telefono TEXT,
    id_rol INTEGER NOT NULL,
    activo INTEGER NOT NULL DEFAULT 1 CHECK (activo IN (0, 1)),
    fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE tutores (
    id_tutor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido1 TEXT NOT NULL,
    apellido2 TEXT,
    cedula TEXT UNIQUE,
    telefono TEXT NOT NULL,
    correo TEXT,
    direccion TEXT,
    id_usuario INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE periodos_escolares (
    id_periodo INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    fecha_inicio TEXT NOT NULL,
    fecha_fin TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Activo'
        CHECK (estado IN ('Activo', 'Cerrado'))
);

CREATE TABLE estudiantes (
    id_estudiante INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido1 TEXT NOT NULL,
    apellido2 TEXT,
    fecha_nacimiento TEXT NOT NULL,
    sexo TEXT NOT NULL CHECK (sexo IN ('M', 'F')),
    acta_nacimiento TEXT,
    direccion TEXT,
    telefono_contacto TEXT,
    tanda TEXT NOT NULL CHECK (tanda IN ('Matutina', 'Vespertina')),
    condicion_especial TEXT,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estudiante_tutor (
    id_estudiante INTEGER NOT NULL,
    id_tutor INTEGER NOT NULL,
    parentesco TEXT NOT NULL,
    es_principal INTEGER NOT NULL DEFAULT 0 CHECK (es_principal IN (0, 1)),
    PRIMARY KEY (id_estudiante, id_tutor),
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
    FOREIGN KEY (id_tutor) REFERENCES tutores(id_tutor) ON DELETE CASCADE
);

CREATE TABLE cursos (
    id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    nivel TEXT NOT NULL CHECK (nivel IN ('Inicial', 'Básica', 'Media'))
);

CREATE TABLE secciones (
    id_seccion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_curso INTEGER NOT NULL,
    id_periodo INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    tanda TEXT NOT NULL CHECK (tanda IN ('Matutina', 'Vespertina')),
    cupo_maximo INTEGER NOT NULL DEFAULT 30,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso),
    FOREIGN KEY (id_periodo) REFERENCES periodos_escolares(id_periodo),
    UNIQUE (id_curso, id_periodo, nombre, tanda)
);

CREATE TABLE profesores (
    id_profesor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido1 TEXT NOT NULL,
    apellido2 TEXT,
    cedula TEXT UNIQUE,
    telefono TEXT,
    correo TEXT,
    id_usuario INTEGER,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE asignaturas (
    id_asignatura INTEGER PRIMARY KEY AUTOINCREMENT,
    id_curso INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

CREATE TABLE profesor_seccion_asignatura (
    id_profesor INTEGER NOT NULL,
    id_seccion INTEGER NOT NULL,
    id_asignatura INTEGER NOT NULL,
    PRIMARY KEY (id_profesor, id_seccion, id_asignatura),
    FOREIGN KEY (id_profesor) REFERENCES profesores(id_profesor),
    FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion),
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura)
);

CREATE TABLE matriculas (
    id_matricula INTEGER PRIMARY KEY AUTOINCREMENT,
    id_estudiante INTEGER NOT NULL,
    id_seccion INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Nueva', 'Reinscripción')),
    estado TEXT NOT NULL DEFAULT 'Pendiente'
        CHECK (estado IN ('Pendiente', 'Pagada', 'Confirmada', 'Cancelada')),
    fecha_matricula TEXT DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    FOREIGN KEY (id_seccion) REFERENCES secciones(id_seccion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    UNIQUE (id_estudiante, id_seccion)
);

CREATE TABLE documentos_requeridos (
    id_documento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    obligatorio INTEGER NOT NULL DEFAULT 1 CHECK (obligatorio IN (0, 1))
);

CREATE TABLE matricula_documentos (
    id_matricula INTEGER NOT NULL,
    id_documento INTEGER NOT NULL,
    entregado INTEGER NOT NULL DEFAULT 0 CHECK (entregado IN (0, 1)),
    fecha_entrega TEXT,
    PRIMARY KEY (id_matricula, id_documento),
    FOREIGN KEY (id_matricula) REFERENCES matriculas(id_matricula) ON DELETE CASCADE,
    FOREIGN KEY (id_documento) REFERENCES documentos_requeridos(id_documento)
);

CREATE TABLE pagos (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_matricula INTEGER NOT NULL,
    numero_comprobante TEXT NOT NULL UNIQUE,
    monto REAL NOT NULL,
    tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('Completo', 'Parcial')),
    metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Transferencia', 'Tarjeta')),
    fecha_pago TEXT DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER NOT NULL,
    FOREIGN KEY (id_matricula) REFERENCES matriculas(id_matricula),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE calificaciones (
    id_calificacion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_estudiante INTEGER NOT NULL,
    id_asignatura INTEGER NOT NULL,
    id_periodo INTEGER NOT NULL,
    calificacion REAL NOT NULL,
    fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    FOREIGN KEY (id_asignatura) REFERENCES asignaturas(id_asignatura),
    FOREIGN KEY (id_periodo) REFERENCES periodos_escolares(id_periodo)
);

INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Docente'),
('Tutor');

INSERT INTO documentos_requeridos (nombre, obligatorio) VALUES
('Acta de nacimiento', 1),
('Copia de cédula del tutor', 1),
('Foto 2x2', 1),
('Boletín de calificaciones del año anterior', 0),
('Certificado médico', 0);

INSERT INTO usuarios (
    nombre_usuario,
    contrasena_hash,
    nombre_completo,
    id_rol
) VALUES (
    'admin',
    'REEMPLAZAR_CON_HASH_REAL',
    'Administrador del Sistema',
    1
);
