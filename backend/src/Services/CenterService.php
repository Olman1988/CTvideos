<?php

class CenterService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }
    public function getAllActiveCenters(){
        try {
            $sql = "EXEC sp_get_all_centers_active";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $centers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $centers;

        } catch (Throwable $e) {

            Logger::error("Error al listar centros |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
    public function getAll(): array
    {
        $stmt = $this->db->prepare("EXEC sp_centers_get_all");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUuid(string $uuid): array
    {
        $stmt = $this->db->prepare("EXEC sp_centers_get_by_uuid @uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        $center = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$center) throw new Exception("Centro educativo no encontrado");

        return $center;
    }

    public function create(CenterDTO $dto): string
    {
        if (!$dto->uuid) $dto->uuid = Uuid::v4();

        $stmt = $this->db->prepare("
            EXEC sp_centers_create
                @uuid = :uuid,
                @nombre = :nombre,
                @provincia_id = :provincia_id,
                @canton_id = :canton_id,
                @distrito_id = :distrito_id,
                @direccion = :direccion,
                @telefono = :telefono,
                @correo = :correo,
                @codsaber = :codsaber,
                @codpres = :codpres,
                @tipo_institucion = :tipo_institucion,
                @regional = :regional,
                @circuito = :circuito,
                @estado = :estado
        ");

        $stmt->bindValue(':uuid', $dto->uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':provincia_id', $dto->provincia_id, PDO::PARAM_INT);
        $stmt->bindValue(':canton_id', $dto->canton_id, PDO::PARAM_INT);
        $stmt->bindValue(':distrito_id', $dto->distrito_id, PDO::PARAM_INT);
        $stmt->bindValue(':direccion', $dto->direccion);
        $stmt->bindValue(':telefono', $dto->telefono);
        $stmt->bindValue(':correo', $dto->correo);
        $stmt->bindValue(':codsaber', $dto->codsaber);
        $stmt->bindValue(':codpres', $dto->codpres);
        $stmt->bindValue(':tipo_institucion', $dto->tipo_institucion);
        $stmt->bindValue(':regional', $dto->regional);
        $stmt->bindValue(':circuito', $dto->circuito);
        $stmt->bindValue(':estado', $dto->estado, PDO::PARAM_INT);

        $stmt->execute();

        return $dto->uuid;
    }

    public function update(string $uuid, CenterDTO $dto): void
    {
        $stmt = $this->db->prepare("
            EXEC sp_centers_update
                @uuid = :uuid,
                @nombre = :nombre,
                @provincia_id = :provincia_id,
                @canton_id = :canton_id,
                @distrito_id = :distrito_id,
                @direccion = :direccion,
                @telefono = :telefono,
                @correo = :correo,
                @codsaber = :codsaber,
                @codpres = :codpres,
                @tipo_institucion = :tipo_institucion,
                @regional = :regional,
                @circuito = :circuito,
                @estado = :estado
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':provincia_id', $dto->provincia_id, PDO::PARAM_INT);
        $stmt->bindValue(':canton_id', $dto->canton_id, PDO::PARAM_INT);
        $stmt->bindValue(':distrito_id', $dto->distrito_id, PDO::PARAM_INT);
        $stmt->bindValue(':direccion', $dto->direccion);
        $stmt->bindValue(':telefono', $dto->telefono);
        $stmt->bindValue(':correo', $dto->correo);
        $stmt->bindValue(':codsaber', $dto->codsaber);
        $stmt->bindValue(':codpres', $dto->codpres);
        $stmt->bindValue(':tipo_institucion', $dto->tipo_institucion);
        $stmt->bindValue(':regional', $dto->regional);
        $stmt->bindValue(':circuito', $dto->circuito);
        $stmt->bindValue(':estado', $dto->estado, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function delete(string $uuid): void
    {
        $stmt = $this->db->prepare("EXEC sp_centers_delete @uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();
    }

}
