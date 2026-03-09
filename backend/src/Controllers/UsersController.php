<?php


class UsersController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }
        public function createUser(): void
{
    try {
        $data = Request::json();

        // 🔹 Validaciones básicas
        if (
            empty($data['nombre']) ||
            empty($data['correo']) ||
            empty($data['password']) ||
            empty($data['confirmpassword'])
        ) {
            Logger::warning("Creación usuario fallida | Datos incompletos");
            Response::json(['error' => 'Datos incompletos'], 400);
            return;
        }

        if ($data['password'] !== $data['confirmpassword']) {
            Logger::warning("Creación usuario fallida | Contraseñas no coinciden");
            Response::json(['error' => 'Las contraseñas no coinciden'], 400);
            return;
        }

        // 🔹 Iniciar transacción
        $this->db->beginTransaction();

        // 🔹 Validar correo duplicado
        $stmtCheck = $this->db->prepare("
            SELECT id 
            FROM usuarios 
            WHERE correo = :correo
        ");
        $stmtCheck->execute([
            ':correo' => $data['correo']
        ]);

        if ($stmtCheck->fetch()) {
            $this->db->rollBack();
            Logger::warning(
                "Creación usuario fallida | Correo duplicado | {$data['correo']}"
            );
            Response::json(['error' => 'El correo ya está registrado'], 409);
            return;
        }

        // 🔹 Insertar usuario (SQL Server compatible)
        $uuid = Uuid::v4();
        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmtUser = $this->db->prepare("
            INSERT INTO usuarios (uuid, nombre, correo, password, estado_id)
            OUTPUT INSERTED.id
            VALUES (:uuid, :nombre, :correo, :password, :estado_id)
        ");

        $stmtUser->execute([
            ':uuid'      => $uuid,
            ':nombre'    => $data['nombre'],
            ':correo'    => $data['correo'],
            ':password'  => $passwordHash,
            ':estado_id' => 1
        ]);

        $usuarioId = (int)$stmtUser->fetchColumn();

        // 🔹 Sincronizar roles
        if (!empty($data['roles']) && is_array($data['roles'])) {
            $userRoleService = new UserRoleService();
            $userRoleService->syncRoles($usuarioId, $data['roles']);
        }

        // 🔹 Commit final
        $this->db->commit();

        Response::json([
            'message' => 'Usuario creado correctamente',
            'usuario_id' => $usuarioId
        ], 201);

    } catch (RuntimeException $e) {

        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }

        Logger::warning(
            "Creación usuario fallida | " .
            "Mensaje={$e->getMessage()} | Código={$e->getCode()}"
        );

        Response::json([
            'error' => $e->getMessage()
        ], $e->getCode() ?: 400);

    } catch (Throwable $e) {

        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }

        Logger::error(
            "Error al crear usuario | " .
            "Mensaje={$e->getMessage()} | " .
            "Archivo={$e->getFile()} | " .
            "Línea={$e->getLine()}"
        );

        Response::json([
            'error' => 'Error interno del servidor'
        ], 500);
    }
}

    /**
     * GET /api/usuarios/all
     */
    public function getAllUsers(): void
    {
        try {
            $sql = "
          SELECT
    u.id AS usuario_id,
    u.uuid,
    u.correo,
    u.nombre,
    eu.nombre AS estado_nombre,
    STRING_AGG(r.nombre, ',') AS roles
FROM usuarios u
LEFT JOIN usuarios_roles ur ON ur.usuario_id = u.id
LEFT JOIN roles r ON r.id = ur.rol_id
LEFT JOIN estados_usuario eu ON eu.id = u.estado_id
GROUP BY
    u.id, u.uuid, u.correo, u.nombre, eu.nombre
";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            Response::json($users, 200);

        } catch (Throwable $e) {

            Logger::error("Error al listar usuarios", [
                "error" => $e->getMessage()
            ]);

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
    public function getByUuid(string $uuid): void
{
    try {
        $stmt = $this->db->prepare("
            SELECT 
                u.id,
                u.uuid,
                u.nombre,
                u.correo
            FROM usuarios u
            WHERE u.uuid = :uuid
        ");
        $stmt->execute(['uuid' => $uuid]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            Response::json(['error' => 'Usuario no encontrado'], 404);
            return;
        }

        $roles = $this->db->prepare("
            SELECT r.id, r.nombre
            FROM usuarios_roles ur
            JOIN roles r ON r.id = ur.rol_id
            WHERE ur.usuario_id = :id
        ");
        $roles->execute(['id' => $user['id']]);

        $user['roles'] = $roles->fetchAll(PDO::FETCH_ASSOC);

        Response::json($user, 200);

    } catch (Throwable $e) {
        Logger::error("Error obtener usuario | {$e->getMessage()}");
        Response::json(['error' => 'Error interno'], 500);
    }
}


public function update(string $uuid): void
{
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['nombre']) || empty($data['correo'])) {
            Response::json(['error' => 'Datos incompletos'], 400);
            return;
        }

        // 🔎 Obtener ID interno
        $userStmt = $this->db->prepare("
            SELECT id FROM usuarios WHERE uuid = :uuid
        ");
        $userStmt->execute(['uuid' => $uuid]);
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            Response::json(['error' => 'Usuario no encontrado'], 404);
            return;
        }

        $userId = (int) $user['id'];

        // 🔎 Validar correo (excepto el mismo usuario)
        $check = $this->db->prepare("
            SELECT id FROM usuarios 
            WHERE correo = :correo AND id != :id
        ");
        $check->execute([
            'correo' => $data['correo'],
            'id' => $userId
        ]);

        if ($check->fetch()) {
            Response::json(['error' => 'Credenciales inválidas'], 401);
            return;
        }

        $this->db->beginTransaction();

        $sql = "UPDATE usuarios SET nombre = :nombre, correo = :correo";
        $params = [
            'nombre' => $data['nombre'],
            'correo' => $data['correo'],
            'id' => $userId
        ];

        if (!empty($data['password'])) {
            $sql .= ", password = :password";
            $params['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $sql .= " WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        // 🎭 Roles
        if (isset($data['roles']) && is_array($data['roles'])) {

            // borrar
            $delete = $this->db->prepare(
                "DELETE FROM usuarios_roles WHERE usuario_id = :id"
            );
            $delete->execute(['id' => $userId]);

            // insertar
            $insert = $this->db->prepare(
                "INSERT INTO usuarios_roles (usuario_id, rol_id)
                 VALUES (:usuario_id, :rol_id)"
            );

            foreach ($data['roles'] as $rolId) {
                $insert->execute([
                    'usuario_id' => $userId,
                    'rol_id' => (int) $rolId
                ]);
            }
        }

        $this->db->commit();

        Response::json(['message' => 'Usuario actualizado'], 200);

    } catch (Throwable $e) {

        if ($this->db->inTransaction()) {
            $this->db->rollBack();
        }

        Logger::error(
            "Error actualizar usuario | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
        );

        Response::json(['error' => 'Error interno'], 500);
    }
}



}
