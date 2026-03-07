<?php
class CampaignService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

        public function getByUuid(string $uuid): array
{
    try {
        $stmt = $this->db->prepare("EXEC sp_campanas_get_by_uuid @uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();

        // Primer conjunto: campaña
        $campaign = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$campaign) {
            throw new Exception("Campaña no encontrada");
        }

        // Segundo conjunto: acciones
        $stmt->nextRowset();
        $actions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $campaign["acciones"]=$actions;
        // Retornar todo junto
        return $campaign;
;

    } catch (PDOException $e) {
        Logger::error("Error al obtener campaña: " . $e->getMessage());
        throw new Exception("No se pudo obtener la campaña");
    }
}

    // -----------------------------
    // Obtener activas
    // -----------------------------
    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_campanas_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignias activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las insignias activas");
        }
    }

    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_campanas_get_all");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener campañas activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las campañas activas");
        }
    }
    public function getAllStatus(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_campanas_status_get_all");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener estados: " . $e->getMessage());
            throw new Exception("No se pudo obtener los estados");
        }
    }

    
public function update(string $uuid, CampaignDTO $dto, array $files): void
{
    try {
        $this->db->beginTransaction();

        // ================= OBTENER ID CAMPAÑA =================
        $stmt = $this->db->prepare("
            SELECT id FROM campanas WHERE uuid = :uuid
        ");
        $stmt->execute([':uuid' => $uuid]);
        $campanaId = $stmt->fetchColumn();

        if (!$campanaId) {
            throw new Exception("Campaña no encontrada");
        }

        // ================= IMAGEN =================
        $imagen = null;
        if (!empty($files['imagen'])) {
            $imagen = $this->imageService->upload($files['imagen']);
        }

        // ================= UPDATE CAMPAÑA =================
        $stmt = $this->db->prepare("
            EXEC sp_campanas_update
                :uuid,
                :nombre,
                :descripcion,
                :fecha_inicio,
                :fecha_fin,
                :estado_id,
                :imagen
        ");

        $stmt->execute([
            ':uuid' => $uuid,
            ':nombre' => $dto->nombre,
            ':descripcion' => $dto->descripcion,
            ':fecha_inicio' => $dto->fechaInicio,
            ':fecha_fin' => $dto->fechaFin,
            ':estado_id' => $dto->estadoId,
            ':imagen' => $imagen
        ]);

        // ================= ELIMINAR ACCIONES =================
        $stmt = $this->db->prepare("
            EXEC sp_campanas_acciones_delete :campana_id
        ");
        $stmt->execute([
            ':campana_id' => $campanaId
        ]);

        // ================= INSERTAR ACCIONES =================
        foreach ($dto->acciones as $accion) {
            $stmt = $this->db->prepare("
                EXEC sp_campanas_acciones_insert
                    :campana_id,
                    :accion_id,
                    :multiplicador,
                    :puntaje
            ");

            $stmt->execute([
                ':campana_id' => $campanaId,
                ':accion_id' => $accion['accion_id'],
                ':multiplicador' => $accion['multiplicador'],
                ':puntaje' => $accion['puntaje']
            ]);
        }

        $this->db->commit();
        Logger::info("Campaña actualizada ({$uuid})");

    } catch (Throwable $e) {
        $this->db->rollBack();
        Logger::error("Error actualizar campaña: {$e->getMessage()}");
        throw new Exception("No se pudo actualizar la campaña");
    }
}



public function create(CampaignDTO $dto, array $files): string
{
    try {
        $dto->validate();

        // subir imagen
        $imagenUrl = null;
        if (!empty($files['imagen'])) {
            $imagenUrl = $this->imageService->upload($files['imagen']);
        }

        // insertar campaña
        $stmt = $this->db->prepare("
            EXEC sp_campanas_insert
                :nombre,
                :descripcion,
                :fecha_inicio,
                :fecha_fin,
                :imagen,
                :estado_id
        ");

        $stmt->bindParam(':nombre', $dto->nombre);
        $stmt->bindParam(':descripcion', $dto->descripcion);
        $stmt->bindParam(':fecha_inicio', $dto->fechaInicio);
        $stmt->bindParam(':fecha_fin', $dto->fechaFin);
        $stmt->bindParam(':imagen', $imagenUrl);
        $stmt->bindParam(':estado_id', $dto->estadoId);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result || !isset($result['campana_id'])) {
            throw new Exception('No se pudo crear la campaña');
        }

        $campanaId = (int)$result['campana_id'];
        $uuid = $result['uuid'];

        // insertar acciones con puntaje
        foreach ($dto->acciones as $accion) {
            $stmt = $this->db->prepare("
                EXEC sp_campanas_acciones_insert
                    :campana_id,
                    :accion_id,
                    :multiplicador,
                    :puntaje
            ");

            $stmt->bindValue(':campana_id', $campanaId, PDO::PARAM_INT);
            $stmt->bindValue(':accion_id', $accion['accion_id'], PDO::PARAM_INT);
            $stmt->bindValue(':multiplicador', (float)$accion['multiplicador']);
            $stmt->bindValue(':puntaje', (int)$accion['puntaje'], PDO::PARAM_INT);

            $stmt->execute();
        }

        Logger::info("Campaña creada: {$dto->nombre} ({$uuid})");

        return $uuid;

    } catch (Exception $e) {
        Logger::error("Error al crear campaña: " . $e->getMessage());
        throw new Exception("No se pudo crear la campaña");
    }
}



}
