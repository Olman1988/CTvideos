<?php

class BackgroundService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

    public function getAll()
    {
        $stmt = $this->db->prepare("EXEC sp_get_all_backgrounds");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUuid(string $uuid): array
    {
        $stmt = $this->db->prepare("EXEC sp_marcos_get_by_uuid @uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        $bg = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$bg) {
            throw new Exception("Background no encontrado");
        }

        return $bg;
    }

    public function create(BackgroundDTO $dto, array $files): string
    {
        if (!isset($files['imagen'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->imageService->uploadFile($files['imagen'], "backgrounds");

        if (!$dto->uuid) {
            $dto->uuid = Uuid::v4();
        }

        $stmt = $this->db->prepare("
            EXEC sp_background_create
                @uuid = :uuid,
                @nombre = :nombre,
                @estado_id = :estado_id,
                @imagen = :imagen,
                @insignias = :insignias
        ");

        $stmt->bindValue(':uuid', $dto->uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':imagen', $imagenUrl);
        $stmt->bindValue(':insignias', json_encode($dto->insignias));

        $stmt->execute();

        return $dto->uuid;
    }

    public function update(string $uuid, BackgroundDTO $dto, array $files): void
    {
        try{
        $stmt = $this->db->prepare("
            SELECT id, imagen
            FROM marcos
            WHERE uuid = :uuid
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        $bg = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$bg) {
            throw new Exception("Marco no encontrado");
        }

        $imagenUrl = $bg['imagen'];

        if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
            $imagenUrl = $this->imageService->uploadFile($files['imagen'], 'backgrounds');
        }

        $stmt = $this->db->prepare("
            EXEC sp_backgrounds_update_full
                @uuid = :uuid,
                @nombre = :nombre,
                @estado_id = :estado_id,
                @imagen = :imagen,
                @insignias = :insignias
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre,PDO::PARAM_STR);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':imagen', $imagenUrl,PDO::PARAM_STR);
        $stmt->bindValue(':insignias', json_encode($dto->insignias));

        $stmt->execute();
        } catch (PDOException $e) {
        Logger::error("Error al actualizar avatar: " . $e->getMessage());
        throw new Exception("No se pudo actualizar el avatar");
    }
    }
}