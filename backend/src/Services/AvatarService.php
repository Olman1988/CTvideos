<?php

class AvatarService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }
    public function getAllActive(){
        try {
            $sql = "EXEC sp_get_all_avatars_active";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar estudiantes |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
    public function getAll(){
        try {
            $sql = "EXEC sp_get_all_avatars";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar avatares |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
      public function create(AvatarDTO $dto, array $files): string
    {
        $dto->validate();

        if (!isset($files['imagen'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->imageService->uploadFile($files['imagen'],"avatars");

        if (!$dto->uuid) {
            $dto->uuid = Uuid::v4();
        }
          Logger::info("Error crear service".json_encode($dto));
        $stmt = $this->db->prepare("
                EXEC sp_avatar_create 
                    @uuid = :uuid,
                    @imagen = :imagen,
                    @nombre = :nombre,
                    @estado_id = :estado_id,
                    @insignias = :insignias
            ");

            $stmt->bindValue(':uuid', $dto->uuid);
            $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
            $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
            $stmt->bindValue(':imagen', $imagenUrl, PDO::PARAM_STR);

            $insigniasJson = !empty($dto->insignias)
                ? json_encode($dto->insignias)
                : null;

            $stmt->bindValue(':insignias', $insigniasJson, PDO::PARAM_STR);

        try {
            $stmt->execute();
            Logger::info("Avatar creado: {$dto->nombre} ({$dto->uuid})");
            return $dto->uuid;
        } catch (PDOException $e) {
            Logger::error("Error al crear avatar: " . $e->getMessage());
            throw new Exception("No se pudo crear el avatar");
        }
    }
    public function getByUuid(string $uuid): array
    {
        try {
            $stmt = $this->db->prepare("EXEC sp_avatars_get_by_uuid @uuid = :uuid");
            $stmt->bindValue(':uuid', $uuid);
            $stmt->execute();

            $avatar = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$avatar) {
                throw new Exception("Avatar no encontrada");
            }

            return $avatar;
        } catch (PDOException $e) {
            Logger::error("Error al obtener Avatar: " . $e->getMessage());
            throw new Exception("No se pudo obtener la Avatar");
        }
    }

    // -----------------------------
    // Actualizar Avatar
    // -----------------------------
 public function update(string $uuid, AvatarDTO $dto, array $files): void
{
    try {

        $dto->validate();

        // 1️⃣ Obtener ID interno desde UUID
        $stmt = $this->db->prepare("
            SELECT id, imagen
            FROM avatares
            WHERE uuid = :uuid
        ");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();

        $avatar = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$avatar) {
            throw new RuntimeException("Avatar no encontrado");
        }

        $avatarId = (int) $avatar['id'];
        $imagenUrl = $avatar['imagen'];

        // 2️⃣ Subir imagen solo si viene nueva
        if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
            $imagenUrl = $this->imageService->uploadFile($files['imagen'],'avatars');
        }

        // 3️⃣ Ejecutar SP
        $stmt = $this->db->prepare("
            EXEC sp_avatars_update_full
                @id = :id,
                @uuid = :uuid,
                @nombre = :nombre,
                @estado_id = :estado_id,
                @imagen = :imagen,
                @insignias = :insignias
        ");
        Logger::info("info datos".json_encode($dto));
        $stmt->bindValue(':id', $avatarId, PDO::PARAM_INT);
        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':imagen', $imagenUrl);
        $stmt->bindValue(':insignias', json_encode($dto->insignias));

        $stmt->execute();

        Logger::info("Avatar actualizado uuid={$uuid}");

    } catch (PDOException $e) {
        Logger::error("Error al actualizar avatar: " . $e->getMessage());
        throw new Exception("No se pudo actualizar el avatar");
    }
}

}
