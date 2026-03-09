<?php

class UserRoleService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function syncRoles(int $usuarioId, array $roles): void
    {
        // Normalizar roles
        $roles = array_unique(array_map('intval', $roles));

        // 🔹 Validar usuario
        $stmtUser = $this->db->prepare("
            SELECT id 
            FROM usuarios 
            WHERE id = :id
        ");
        $stmtUser->execute([':id' => $usuarioId]);

        if (!$stmtUser->fetch()) {
            Logger::warning("syncRoles fallido | Usuario no existe | id={$usuarioId}");
            throw new RuntimeException("Usuario no existe", 404);
        }

        // 🔹 Obtener roles actuales
        $stmt = $this->db->prepare("
            SELECT rol_id 
            FROM usuarios_roles 
            WHERE usuario_id = :id
        ");
        $stmt->execute([':id' => $usuarioId]);

        $rolesActuales = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $rolesAEliminar = array_diff($rolesActuales, $roles);
        $rolesAInsertar = array_diff($roles, $rolesActuales);

        // 🔹 Eliminar roles removidos
        if (!empty($rolesAEliminar)) {
            $stmtDelete = $this->db->prepare("
                DELETE FROM usuarios_roles
                WHERE usuario_id = :uid AND rol_id = :rid
            ");

            foreach ($rolesAEliminar as $rolId) {
                $stmtDelete->execute([
                    ':uid' => $usuarioId,
                    ':rid' => $rolId
                ]);
            }
        }

        // 🔹 Insertar roles nuevos
        if (!empty($rolesAInsertar)) {

            // Validar existencia de roles
            $placeholders = implode(',', array_fill(0, count($rolesAInsertar), '?'));

            $stmtRoles = $this->db->prepare("
                SELECT id 
                FROM roles 
                WHERE id IN ($placeholders)
            ");
            $stmtRoles->execute(array_values($rolesAInsertar));

            $rolesValidos = $stmtRoles->fetchAll(PDO::FETCH_COLUMN);

            if (count($rolesValidos) !== count($rolesAInsertar)) {
                Logger::warning(
                    "syncRoles fallido | Roles inválidos | Usuario={$usuarioId}"
                );
                throw new RuntimeException("Uno o más roles no existen", 400);
            }

            $stmtInsert = $this->db->prepare("
                INSERT INTO usuarios_roles (usuario_id, rol_id)
                VALUES (:uid, :rid)
            ");

            foreach ($rolesAInsertar as $rolId) {
                $stmtInsert->execute([
                    ':uid' => $usuarioId,
                    ':rid' => $rolId
                ]);
            }
        }
    }
}
