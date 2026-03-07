<?php
class BadgeService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

    // -----------------------------
    // Crear insignia
    // -----------------------------
    public function create(BadgeDTO $dto, array $files): string
    {
        $dto->validate();

        if (!isset($files['imagen'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->imageService->upload($files['imagen']);

        if (!$dto->uuid) {
            $dto->uuid = Uuid::v4();
        }

        $stmt = $this->db->prepare("
            EXEC sp_insignias_create_full 
                @uuid = :uuid,
                @nombre = :nombre,
                @descripcion = :descripcion,
                @activo = :activo,
                @multiplicador = :multiplicador,
                @rango_inicio = :rango_inicio,
                @rango_fin = :rango_fin,
                @accion_id = :accion_id,
                @imagen = :imagen,
                @campana_id = :campana_id
        ");

        $stmt->bindValue(':uuid', $dto->uuid);
        $stmt->bindValue(':nombre', $dto->nombre,PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $dto->descripcion,PDO::PARAM_STR);
        $stmt->bindValue(':activo', $dto->activo, PDO::PARAM_BOOL);
        $stmt->bindValue(':multiplicador', $dto->multiplicador);
        $stmt->bindValue(':rango_inicio', $dto->rangoInicio, PDO::PARAM_INT);
        $stmt->bindValue(':rango_fin', $dto->rangoFin, PDO::PARAM_INT);
        $stmt->bindValue(':accion_id',  $dto->accionId ?: null,PDO::PARAM_INT);
        $stmt->bindValue(':campana_id',  $dto->campanaId ?: null,PDO::PARAM_INT);
        $stmt->bindValue(':imagen', $imagenUrl);

        try {
            $stmt->execute();
            Logger::info("Insignia creada: {$dto->nombre} ({$dto->uuid})");
            return $dto->uuid;
        } catch (PDOException $e) {
            Logger::error("Error al crear insignia: " . $e->getMessage());
            throw new Exception("No se pudo crear la insignia");
        }
    }

    // -----------------------------
    // Obtener todas
    // -----------------------------
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_insignias_get_all");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignias: " . $e->getMessage());
            throw new Exception("No se pudo obtener las insignias");
        }
    }

    // -----------------------------
    // Obtener activas
    // -----------------------------
    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_insignias_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignias activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las insignias activas");
        }
    }

    // -----------------------------
    // Obtener por UUID
    // -----------------------------
    public function getByUuid(string $uuid): array
    {
        try {
            $stmt = $this->db->prepare("EXEC sp_insignias_get_by_uuid @uuid = :uuid");
            $stmt->bindValue(':uuid', $uuid);
            $stmt->execute();

            $insignia = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$insignia) {
                throw new Exception("Insignia no encontrada");
            }

            return $insignia;
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignia: " . $e->getMessage());
            throw new Exception("No se pudo obtener la insignia");
        }
    }

    // -----------------------------
    // Actualizar insignia
    // -----------------------------
    public function update(string $uuid, BadgeDTO $dto, array $files): void
{
    $dto->validate();

    // 1️⃣ Obtener ID interno desde UUID
    $stmt = $this->db->prepare("
        SELECT id, imagen 
        FROM insignias 
        WHERE uuid = :uuid
    ");
    $stmt->bindValue(':uuid', $uuid);
    $stmt->execute();

    $insignia = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$insignia) {
        throw new RuntimeException("Insignia no encontrada");
    }

    $insigniaId = (int) $insignia['id'];
    $imagenUrl = $insignia['imagen'];

    // 2️⃣ Subir imagen solo si viene nueva
    if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
        $imagenUrl = $this->imageService->upload($files['imagen']);
    }

    // 3️⃣ Ejecutar SP real
    $stmt = $this->db->prepare("
        EXEC sp_insignias_update_full
            @id = :id,
            @uuid = :uuid,
            @nombre = :nombre,
            @descripcion = :descripcion,
            @activo = :activo,
            @multiplicador = :multiplicador,
            @rango_inicio = :rango_inicio,
            @rango_fin = :rango_fin,
            @accion_id = :accion_id,
            @imagen = :imagen,
            @campana_id = :campana_id
    ");

    $stmt->bindValue(':id', $insigniaId, PDO::PARAM_INT);
    $stmt->bindValue(':uuid', $uuid);
    $stmt->bindValue(':nombre', $dto->nombre);
    $stmt->bindValue(':descripcion', $dto->descripcion);
    $stmt->bindValue(':activo', $dto->activo, PDO::PARAM_BOOL);
    $stmt->bindValue(':multiplicador', $dto->multiplicador);
    $stmt->bindValue(':rango_inicio', $dto->rangoInicio, PDO::PARAM_INT);
    $stmt->bindValue(':rango_fin', $dto->rangoFin, PDO::PARAM_INT);
    $stmt->bindValue(':accion_id', $dto->accionId, PDO::PARAM_INT);
    $stmt->bindValue(':imagen', $imagenUrl);
    $stmt->bindValue(':campana_id', $dto->campanaId, PDO::PARAM_INT);

    $stmt->execute();

    Logger::info("Insignia actualizada uuid={$uuid}");
}


    // -----------------------------
    // Eliminar insignia
    // -----------------------------
    public function delete(string $uuid): void
    {
        try {
            $stmt = $this->db->prepare("EXEC sp_insignias_delete @uuid = :uuid");
            $stmt->bindValue(':uuid', $uuid);
            $stmt->execute();

            Logger::info("Insignia eliminada: {$uuid}");
        } catch (PDOException $e) {
            Logger::error("Error al eliminar insignia: " . $e->getMessage());
            throw new Exception("No se pudo eliminar la insignia");
        }
    }
}
