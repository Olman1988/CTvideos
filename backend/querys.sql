CREATE TABLE estados_perfiles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(50) NOT NULL,
    descripcion NVARCHAR(255) NULL
);


CREATE TABLE dbo.avatares (
    id INT IDENTITY(1,1) PRIMARY KEY,
    uuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    imagen NVARCHAR(1000) NOT NULL,
    estado BIT NOT NULL DEFAULT 1,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    actualizado_en DATETIME2 NULL
);

CREATE TABLE dbo.estudiantes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    uuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),

    nombre NVARCHAR(100) NOT NULL,
    primer_apellido NVARCHAR(100) NOT NULL,
    segundo_apellido NVARCHAR(100) NULL,
    alias NVARCHAR(50) NULL,

    estado_id INT NOT NULL,
    avatar_id INT NULL,

    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    actualizado_en DATETIME2 NULL,
	fecha_nacimiento DATE NOT NULL,
    CONSTRAINT FK_estudiantes_estado
        FOREIGN KEY (estado_id)
        REFERENCES estados_perfiles(id),

    CONSTRAINT FK_estudiantes_avatar
        FOREIGN KEY (avatar_id)
        REFERENCES avatares(id)
);

CREATE TABLE dbo.usuarios_perfiles (
    id INT IDENTITY(1,1) PRIMARY KEY,

    usuario_id INT NOT NULL,
    estudiante_id INT NOT NULL,

    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_usuarios_perfiles_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT FK_usuarios_perfiles_estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES estudiantes(id),

    CONSTRAINT UQ_usuario_estudiante
        UNIQUE (usuario_id, estudiante_id)
);

CREATE TABLE centros_educativos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    uuid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),

    nombre NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(255) NULL,

    provincia_id INT NOT NULL,
    canton_id INT NOT NULL,
    distrito_id INT NOT NULL,

    direccion NVARCHAR(255) NULL,

    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    actualizado_en DATETIME2 NULL
);

CREATE TABLE dbo.perfiles_centros_educativos (
    id INT IDENTITY(1,1) PRIMARY KEY,

    estudiante_id INT NOT NULL,
    centro_educativo_id INT NOT NULL,

    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_pce_estudiante
        FOREIGN KEY (estudiante_id)
        REFERENCES estudiantes(id),

    CONSTRAINT FK_pce_centro
        FOREIGN KEY (centro_educativo_id)
        REFERENCES centros_educativos(id),

    CONSTRAINT UQ_estudiante_centro
        UNIQUE (estudiante_id, centro_educativo_id)
);
