<?php

class RoleService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function create(RoleDTO $dto): void
    {
        $dto->validate();

        $uuid = Uuid::v4();

        $sql = "
            INSERT INTO roles (
                uuid,
                nombre,
                descripcion,
                estado,
                creado_en
            ) VALUES (
                :uuid,
                :nombre,
                :descripcion,
                :activo,
                GETDATE()
            )
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre',$dto->nombre,$dto->nombre === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':descripcion',$dto->descripcion,$dto->descripcion === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $stmt->bindValue(':activo', $dto->activo ? 1 : 0, PDO::PARAM_INT);

        Logger::info("INSERT ROLE uuid={$uuid}");

        $stmt->execute();
    }
    public function getAll(){
        try {
            $sql = "
                SELECT DISTINCT * 
                    FROM roles
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar roles|{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
    public function getByUuid(string $uuid): array|null
    {
        $sql = "
            SELECT
                id,
                uuid,
                nombre,
                descripcion,
                estado
            FROM roles
            WHERE uuid = :uuid
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':uuid', $uuid);
        $stmt->execute();

        $rol = $stmt->fetch(PDO::FETCH_ASSOC);

        return $rol ?: null;
    }
    public function update(string $uuid, RoleDTO $dto): void
{
  
    $sql = "
        UPDATE roles SET
            nombre = :nombre,
            descripcion = :descripcion,
            estado = :estado,
            actualizado_en = GETDATE()
        WHERE uuid = :uuid
    ";

    $stmt = $this->db->prepare($sql);

    $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
    $stmt->bindValue(':descripcion', $dto->descripcion, PDO::PARAM_STR);
    $stmt->bindValue(':estado', $dto->estado, PDO::PARAM_INT);
    $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);

    Logger::info("UPDATE ROL uuid={$uuid}");

    $stmt->execute();
}


}
