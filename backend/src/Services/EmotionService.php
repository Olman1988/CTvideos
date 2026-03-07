<?php

class EmotionService
{
    private PDO $db;
     private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
         $this->imageService = new ImageUploadService();
    }

    public function getAllActive(): array
    {
        $stmt = $this->db->query("EXEC sp_emotions_get_all_active");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("EXEC sp_emotions_get_all");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUuid(string $uuid): array
    {
        $stmt = $this->db->prepare("EXEC sp_emotions_get_by_uuid :uuid");
        $stmt->bindValue(':uuid', $uuid);
        $stmt->execute();
        $emotion = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$emotion) {
            throw new Exception("Emoción no encontrada");
        }

        return $emotion;
    }

    public function create(EmotionDTO $dto): string
{
    try {
        // 🔹 Validar DTO
        $dto->validate();

        // 🔹 Subir imagen si existe
        $iconoUrl = null;
      

        // 🔹 Preparar statement para SP
        $stmt = $this->db->prepare("
            EXEC sp_emotions_insert
                :nombre,
                :icono,
                :estado_id,
                :sinonimos,
                :color
        ");
        $sinonimosStr = is_array($dto->sinonimos) ? implode(',', $dto->sinonimos) : $dto->sinonimos;
        // 🔹 Vincular parámetros
        $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
        $stmt->bindValue(':icono', $iconoUrl ?? $dto->icono, PDO::PARAM_STR);
        $stmt->bindValue(':estado_id', $dto->estado_id, PDO::PARAM_INT);
       $stmt->bindValue(':sinonimos', $sinonimosStr, PDO::PARAM_STR);
        $stmt->bindValue(':color', $dto->color, PDO::PARAM_STR);

        // 🔹 Ejecutar
        $stmt->execute();

        // 🔹 Obtener resultado
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$result || !isset($result['emotion_id'], $result['uuid'])) {
            throw new Exception("No se pudo crear la emoción");
        }

        $emotionId = (int)$result['emotion_id'];
        $uuid = $result['uuid'];

        // ================= AUDITORÍA =================
        Audit::register(
            tabla: 'emotions',
            registroId: $emotionId,
            accion: 'CREATE',
            datosAnteriores: null,
            datosNuevos: [
                'nombre' => $dto->nombre,
                'icono' => $iconoUrl ?? $dto->icono,
                'estado_id' => $dto->estado_id,
                'sinonimos' => $dto->sinonimos,
                'color' => $dto->color
            ],
            modulo: 15
        );

        Logger::info("Emoción creada ({$uuid})");

        return $uuid;

    } catch (Exception $e) {
        Logger::error("Error al crear emoción: " . $e->getMessage());
        throw new Exception("No se pudo crear la emoción");
    }
}


public function update(string $uuid, EmotionDTO $dto): void
{
    try {
        // 🔹 Validar DTO
        $dto->validate();

        // 🔹 Traer datos anteriores para auditoría
        $stmtOld = $this->db->prepare("EXEC sp_emotions_get_by_uuid :uuid");
        $stmtOld->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmtOld->execute();
        $datosAnteriores = $stmtOld->fetch(PDO::FETCH_ASSOC);
Logger::info("Emoción actualizada (UUID: {$uuid})".json_encode($datosAnteriores));
        // 🔹 Convertir sinónimos a string si vienen como array
        $sinonimosStr = is_array($dto->sinonimos) ? implode(',', $dto->sinonimos) : $dto->sinonimos;

        // 🔹 Preparar statement para SP que actualiza por UUID
        $stmt = $this->db->prepare("
            EXEC sp_emotions_update
                :uuid,
                :nombre,
                :icono,
                :estado_id,
                :sinonimos,
                :color
        ");

        // 🔹 Vincular parámetros
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
        $stmt->bindValue(':icono', $dto->icono, PDO::PARAM_STR);
        $stmt->bindValue(':estado_id', $dto->estado_id, PDO::PARAM_INT);
        $stmt->bindValue(':sinonimos', $sinonimosStr, PDO::PARAM_STR);
        $stmt->bindValue(':color', $dto->color, PDO::PARAM_STR);

        // 🔹 Ejecutar update
        $stmt->execute();

        // 🔹 Auditoría
        Audit::register(
            tabla: 'emociones',
            registroId: $datosAnteriores['id'],
            accion: 'UPDATE',
            datosAnteriores: $datosAnteriores,
            datosNuevos: [
                'nombre' => $dto->nombre,
                'icono' => $dto->icono,
                'estado_id' => $dto->estado_id,
                'sinonimos' => $dto->sinonimos,
                'color' => $dto->color
            ],
            modulo: 15
        );

        Logger::info("Emoción actualizada (UUID: {$uuid})");

    } catch (Exception $e) {
        Logger::error("Error al actualizar emoción (UUID: {$uuid}): " . $e->getMessage());
        throw new Exception("No se pudo actualizar la emoción");
    }
}



    public function delete(int $id): void
    {
        $stmt = $this->db->prepare("EXEC sp_emotions_delete :id");
        $stmt->execute([':id' => $id]);
    }
}
