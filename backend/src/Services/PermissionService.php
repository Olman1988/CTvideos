<?php

class PermissionService{

private PDO $db;
private ImageUploadService $imageService;
 public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }
    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_permission_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener permisos activos: " . $e->getMessage());
            throw new Exception("No se pudo obtener las permisos activas");
        }
    }
    public function getAllPermission(string $uuid): array
{
    try {
        $stmt = $this->db->prepare("EXEC sp_permission_get_by_uuid @uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        // Cambiado fetch() por fetchAll()
        $perms = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$perms) {
             Logger::error("Error al obtener permisos: no encontrados");
        }

        return $perms;

    } catch (PDOException $e) {
        Logger::error("Error al obtener permisos: " . $e->getMessage());
        throw new Exception("No se pudo obtener los permisos");
    }
}
public function updatePermissions(string $uuid, array $permissions): void
{
    try {
       
        $stmt = $this->db->prepare("EXEC sp_update_role_permissions @uuid = :uuid, @permissions = :permissions");

        // 🔹 Convertimos el array de permisos a JSON para enviarlo al procedure
        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':permissions', json_encode($permissions));
        $stmt->execute();

    } catch (PDOException $e) {
        Logger::error("Error al actualizar permisos via procedure: " . $e->getMessage());
        throw new Exception("No se pudieron actualizar los permisos");
    }
}

public function getAllModules(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_modules_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignias activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las insignias activas");
        }
    }





}