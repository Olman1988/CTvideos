<?php



class AuthController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection(); // SQL Server vía PDO
    }

    // =========================
    //  LOGIN
    // =========================
    public function login()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            $email = $input['email'] ?? null;
            $password = $input['password'] ?? null;

            if (!$email || !$password) {
                Response::json(['error' => 'Campos requeridos'], 400);
                return;
            }

            $stmt = $this->db->prepare("
                SELECT DISTINCT
                    u.id AS usuario_id,
                    u.correo,
                    u.nombre,
                    u.password,
                    r.id AS rol_id,
                    r.nombre AS rol_nombre,
                    p.nombre AS permiso
                FROM usuarios u
                LEFT JOIN usuarios_roles ur ON ur.usuario_id = u.id
                LEFT JOIN roles r ON r.id = ur.rol_id
                LEFT JOIN roles_permisos rp ON rp.rol_id = r.id
                LEFT JOIN permisos p ON p.id = rp.permiso_id
                WHERE u.correo = ?
            ");

            $stmt->execute([$email]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!$rows) {
                Logger::warning("Login fallido: usuario no existe ($email)");
                Response::json(['error' => 'Credenciales inválidas'], 401);
                return;
            }

            // 🔐 Validar contraseña
            if (!password_verify($password, $rows[0]['password'])) {
                Logger::warning("Login fallido: password incorrecto ($email)");
                Response::json(['error' => 'Credenciales inválidas'], 401);
                return;
            }

            // 🧠 Procesar roles y permisos
            $roles = [];
            $permisos = [];

            foreach ($rows as $row) {
                if (!empty($row['rol_id'])) {
                    $roles[$row['rol_id']] = $row['rol_nombre'];
                }
                if (!empty($row['permiso'])) {
                    $permisos[$row['permiso']] = true;
                }
            }

            $roles = array_values($roles);
            $permisos = array_keys($permisos);

            Logger::info("Login exitoso ($email)");

            // 🎟️ Crear JWT
            $payload = [
                'id'        => $rows[0]['usuario_id'],
                'email'     => $rows[0]['correo'],
                'nombre'    => $rows[0]['nombre'],
                'roles'     => $roles,
                'permisos'  => $permisos
            ];

            $token = JwtHelper::generate($payload, 60 * 60 * 24 * 7); // 7 días

            Response::json([
                'token' => $token,
                'user' => [
                    'id'        => $rows[0]['usuario_id'],
                    'email'     => $rows[0]['correo'],
                    'nombre'    => $rows[0]['nombre'],
                    'roles'     => $roles,
                    'permisos'  => $permisos
                ]
            ]);

        } catch (PDOException $e) {
            Logger::error("PDO ERROR en login ($email): " . $e->getMessage());
            Response::json(['error' => 'Error de base de datos'], 500);

        } catch (Exception $e) {
            Logger::error("ERROR GENERAL en login ($email): " . $e->getMessage());
            Response::json(['error' => 'Error inesperado'], 500);
        }
    }

    // =========================
    //  REGISTER (BÁSICO)
    // =========================
    public function register()
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            $email = $input['email'] ?? null;
            $password = $input['password'] ?? null;
            $nombre = $input['nombre'] ?? null;

            if (!$email || !$password || !$nombre) {
                Response::json(['error' => 'Campos requeridos'], 400);
                return;
            }

            $hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $this->db->prepare("
                INSERT INTO usuarios (correo, password, nombre, fecha_creacion, estado_id)
                VALUES (?, ?, ?, GETDATE(), 1)
            ");

            $stmt->execute([$email, $hash, $nombre]);

            Logger::info("Usuario creado ($email)");

            Response::json([
                'ok' => true,
                'message' => 'Usuario creado correctamente'
            ], 201);

        } catch (PDOException $e) {
            Logger::error("PDO ERROR en register ($email): " . $e->getMessage());
            Response::json(['error' => 'Usuario ya existe o error de BD'], 400);

        } catch (Exception $e) {
            Logger::error("ERROR GENERAL en register ($email): " . $e->getMessage());
            Response::json(['error' => 'Error inesperado'], 500);
        }
    }
}
