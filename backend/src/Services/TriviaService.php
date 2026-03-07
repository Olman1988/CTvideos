<?php
class TriviaService
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
    public function create(TriviaDTO $dto, array $files): string
{
     try {
    $dto->validate();

    /* ===================== IMAGEN ===================== */
    if (!isset($files['imagen']) || $files['imagen']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("La imagen es obligatoria");
    }

    $imagenUrl = $this->imageService->upload($files['imagen']);

    /* ===================== UUID ===================== */
    if (!$dto->uuid) {
        $dto->uuid = Uuid::v4();
    }

    /* ===================== SANITIZACIÓN ===================== */
    $trivia = trim($dto->trivia);
    $descripcion = trim($dto->descripcion ?? '');

    // Sanitizar texto simple (evita caracteres raros invisibles)
    $trivia = filter_var($trivia, FILTER_SANITIZE_SPECIAL_CHARS);
    $descripcion = filter_var($descripcion, FILTER_SANITIZE_SPECIAL_CHARS);

    $estadoId = (int) $dto->estadoId;

    $preguntasJson = json_encode($dto->preguntas, JSON_UNESCAPED_UNICODE);

    if ($preguntasJson === false) {
        throw new Exception("Error al convertir preguntas a JSON");
    }

    /* ===================== PREPARE ===================== */
    $stmt = $this->db->prepare("
        EXEC sp_trivias_create_full
            @uuid = :uuid,
            @trivia = :trivia,
            @descripcion = :descripcion,
            @imagen = :imagen,
            @estado_id = :estado_id,
            @preguntas = :preguntas
    ");

    /* ===================== BIND VALUES ===================== */
    $stmt->bindValue(':uuid', $dto->uuid, PDO::PARAM_STR);
    $stmt->bindValue(':trivia', $trivia, PDO::PARAM_STR);
    $stmt->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
    $stmt->bindValue(':imagen', $imagenUrl, PDO::PARAM_STR);
    $stmt->bindValue(':estado_id', $estadoId, PDO::PARAM_INT);
    $stmt->bindValue(':preguntas', $preguntasJson, PDO::PARAM_STR);

    /* ===================== EXECUTE ===================== */
    $stmt->execute();

    Logger::info("Trivia creada {$dto->uuid}");

    return $dto->uuid;
    } catch (PDOException $e) {
            Logger::error("Error al crear trivias: " . $e->getMessage());
            throw new Exception("Error crear trivias");
        }
}


    // -----------------------------
    // Obtener todas
    // -----------------------------
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_trivias_get_all");
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
            $stmt = $this->db->query("EXEC sp_trivias_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener trivias activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las trivias activas");
        }
    }

    // -----------------------------
    // Obtener por UUID
    // -----------------------------
    public function getByUuid(string $uuid): array
    {
        try {

            $stmt = $this->db->prepare("
                EXEC sp_trivias_get_by_uuid @uuid = :uuid
            ");

            $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
            $stmt->execute();

            /* ==========================
            1️⃣ Trivia (fetchAll)
            ========================== */
            $trivias = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($trivias)) {
                throw new Exception("Trivia no encontrada");
            }

            $trivia = $trivias[0];

            /* ==========================
            2️⃣ Preguntas
            ========================== */
            $stmt->nextRowset();
            $preguntas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            /* ==========================
            3️⃣ Respuestas
            ========================== */
            $stmt->nextRowset();
            $respuestas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            /* ==========================
            4️⃣ Armar estructura
            ========================== */

            $preguntasMap = [];

            foreach ($preguntas as $p) {
                $p['respuestas'] = [];
                $preguntasMap[$p['id']] = $p;
            }

            foreach ($respuestas as $r) {
                $preguntaId = $r['pregunta_id'];

                if (isset($preguntasMap[$preguntaId])) {
                    $preguntasMap[$preguntaId]['respuestas'][] = $r;
                }
            }

            $trivia['preguntas'] = array_values($preguntasMap);

            return $trivia;

        } catch (PDOException $e) {
            Logger::error("Error al obtener trivia: " . $e->getMessage());
            throw new Exception("No se pudo obtener la trivia");
        }
    }


   public function update(string $uuid, TriviaDTO $dto, array $files): void
{
    try{
    $dto->validate();

    /* =========================
       1️⃣ Obtener ID e imagen actual
    ========================== */
    $stmt = $this->db->prepare("
        SELECT id, imagen
        FROM trivias
        WHERE uuid = :uuid
    ");

    $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
    $stmt->execute();

    $trivia = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$trivia) {
        throw new RuntimeException("Trivia no encontrada");
    }

    $imagenUrl = $trivia['imagen'];

    /* =========================
       2️⃣ Subir imagen si viene nueva
    ========================== */
    if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
        $imagenUrl = $this->imageService->upload($files['imagen']);
    }

    /* =========================
       3️⃣ Sanitización
    ========================== */
    $titulo = trim($dto->trivia);
    $descripcion = trim($dto->descripcion ?? '');

    $titulo = filter_var($titulo, FILTER_SANITIZE_SPECIAL_CHARS);
    $descripcion = filter_var($descripcion, FILTER_SANITIZE_SPECIAL_CHARS);

    $estadoId = (int) $dto->estadoId;

    $preguntasJson = json_encode($dto->preguntas, JSON_UNESCAPED_UNICODE);

    if ($preguntasJson === false) {
        throw new RuntimeException("Error al convertir preguntas a JSON");
    }

    /* =========================
       4️⃣ Ejecutar Stored Procedure
    ========================== */
    $stmt = $this->db->prepare("
    EXEC sp_trivias_update_full
        @uuid = :uuid,
        @trivia = :trivia,
        @descripcion = :descripcion,
        @estado_id = :estado_id,
        @imagen = :imagen,
        @preguntas = :preguntas
");

    $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
    $stmt->bindValue(':trivia', $titulo, PDO::PARAM_STR);
    $stmt->bindValue(':descripcion', $descripcion, PDO::PARAM_STR);
    $stmt->bindValue(':imagen', $imagenUrl, PDO::PARAM_STR);
    $stmt->bindValue(':estado_id', $estadoId, PDO::PARAM_INT);
    $stmt->bindValue(':preguntas', $preguntasJson, PDO::PARAM_STR);

    $stmt->execute();

    Logger::info("Trivia actualizada uuid={$uuid}");
    } catch (PDOException $e) {
            Logger::error("Error al actualizar trivias: " . $e->getMessage());
            throw new Exception("Error actualizar trivias");
        }
}


    // -----------------------------
    // Eliminar insignia
    // -----------------------------
    public function delete(string $uuid): void
    {
      
    }
    public function getAllStatus(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_trivias_status_get_all");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener insignias: " . $e->getMessage());
            throw new Exception("No se pudo obtener las insignias");
        }
    }
}
