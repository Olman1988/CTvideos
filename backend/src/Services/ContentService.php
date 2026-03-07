<?php

class ContentService
{
    private PDO $db;
    private ImageUploadService $fileService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->fileService = new ImageUploadService();
    }

    public function getAllActiveStatus(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_status");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener estados: " . $e->getMessage());
            throw new Exception("No se pudo obtener las estados");
        }
    }
    public function getAllActiveApproaches(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_approaches");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener abordajes: " . $e->getMessage());
            throw new Exception("No se pudo obtener las abordajes");
        }
    }
    public function getAllActiveTypes(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_types");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener tipos: " . $e->getMessage());
            throw new Exception("No se pudo obtener los tipos");
        }
    }
    public function getAllActiveAgeRanges(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_ages");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener rangos de edad: " . $e->getMessage());
            throw new Exception("No se pudo obtener rangos de edad");
        }
    }

    public function getAllActiveContext(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_context");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener contextos: " . $e->getMessage());
            throw new Exception("No se pudo obtener contextos");
        }
    }

      public function getAllActiveTags(){
         try {
            $stmt = $this->db->query("EXEC sp_contents_get_all_active_tags");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener etiquetas: " . $e->getMessage());
            throw new Exception("No se pudo obtener etiquetas");
        }
    }

    

    // -----------------------------
    // Crear categoría
    // -----------------------------
    public function create(ContentDTO $dto, array $files): int
{
    $dto->validate();
        if (!isset($files['imagen_principal'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->fileService->upload($files['imagen_principal']);
        if (!$dto->uuid) {
            $dto->uuid = Uuid::v4(); // tu clase Uuid
        }
        
        $usuarioId = Auth::id();

        if (!$usuarioId) {
            http_response_code(401);
            echo json_encode(['error' => 'No autenticado']);
            exit;
        }

    $stmt = $this->db->prepare("
        EXEC sp_contenidos_insert
            :titulo,
            :descripcion,
            :vimeo_url,
            :imagen,
            :tipo_contenido_id,
            :rango_edad_id,
            :contexto_id,
            :usuario_id,
            :estado_id,
            :uuid,
            :abordaje_id,
            :youtube_url
    ");

    $stmt->execute([
        ':titulo' => $dto->titulo,
        ':descripcion' => $dto->descripcion,
        ':vimeo_url' => $dto->vimeoUrl,
        ':imagen' => $imagenUrl,
        ':tipo_contenido_id' => $dto->tipoContenidoId,
        ':rango_edad_id' => $dto->rangoEdadId,
        ':contexto_id' => $dto->contextoId,
        ':usuario_id' => $usuarioId,
        ':estado_id' => $dto->estadoId,
        ':uuid' => $dto->uuid,
        ':abordaje_id' =>$dto->abordajeId,
        ':youtube_url' => $dto->youtubeUrl
    ]);

    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if (isset($files['files'])) {

    foreach ($files['files']['tmp_name'] as $index => $tmpName) {

        if ($files['files']['error'][$index] !== 0) continue;

        $fileData = [
            'name' => $files['files']['name'][$index],
            'type' => $files['files']['type'][$index],
            'tmp_name' => $tmpName,
            'size' => $files['files']['size'][$index],
            'uuid' => Uuid::v4(),
        ];

        // Subir archivo al storage
        $fileData['url'] = $this->fileService->uploadFile($fileData,"contents");

        // Guardar registro en DB
        $this->saveContentFile((int) $result['id'], $fileData);
    }
}

    return (int) $result['id'];
}   
    public function syncRelations(
            int $contentId,
            string $table,
            string $column,
            array $ids
        ): void {
            $this->db->beginTransaction();
                try {
                    // borrar
                    $stmt = $this->db->prepare("DELETE FROM {$table} WHERE contenido_id = ?");
                    $stmt->execute([$contentId]);

                    // insertar
                    if (!empty($ids)) {
                        $stmt = $this->db->prepare("INSERT INTO {$table} (contenido_id, {$column}) VALUES (?, ?)");
                        foreach ($ids as $id) {
                            $stmt->execute([$contentId, $id]);
                        }
                    }

                    $this->db->commit();
                } catch (PDOException $e) {
                      Logger::error("Error al crear contenidos: " . $e->getMessage());
                    $this->db->rollBack();
                    
                }
        }
    // -----------------------------
    // Traer todas las categorías
    // -----------------------------
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_get_all_content");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener contenidos: " . $e->getMessage());
            throw new Exception("No se pudo obtener los contenidos");
        }
      
    }

    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("SELECT c.*, es.nombre AS estado_catalogo FROM categorias c LEFT JOIN estados_catalogos es ON es.id=c.estado_id
            WHERE c.estado_id=1 ORDER BY creado_en DESC");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Logger::info("Se consultaron " . count($result) . " categorías");
            return $result;
        } catch (PDOException $e) {
            Logger::error("Error al obtener categorías: " . $e->getMessage());
            throw new Exception("No se pudo obtener las categorías");
        }
    }
    // -----------------------------
    // Traer categoría por UUID
    // -----------------------------
    public function getByUuid(string $uuid): array
    {
        try {
            $stmt = $this->db->prepare("SELECT id, uuid, nombre, descripcion, estado_id, imagen, creado_en FROM categorias WHERE uuid = :uuid");
            $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
            $stmt->execute();

            $category = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$category) {
                throw new Exception("Categoría no encontrada");
            }

            Logger::info("Categoría encontrada: {$uuid}");
            return $category;
        } catch (PDOException $e) {
            Logger::error("Error al obtener categoría: " . $e->getMessage());
            throw new Exception("No se pudo obtener la categoría");
        }
    }

    // -----------------------------
    // Actualizar categoría
    // -----------------------------
    public function update(string $uuid, ContentDTO $dto, array $files): int
{
    try{
    $dto->validate();
    Logger::info("Error de contenido: " . json_encode($dto) ."");
    // 1️⃣ Obtener ID real del contenido por UUID
    $stmt = $this->db->prepare("SELECT id, imagen FROM contenidos WHERE uuid = :uuid");
    $stmt->execute([':uuid' => $uuid]);
    $content = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$content) {
        throw new Exception("Contenido no encontrado");
    }

    $contentId = (int) $content['id'];
    $imagenUrl = $content['imagen']; // mantener imagen actual por defecto

    // 2️⃣ Si viene nueva imagen, subirla
    if (isset($files['imagen_principal']) && $files['imagen_principal']['error'] === 0) {
        $imagenUrl = $this->fileService->upload($files['imagen_principal']);
    }

    // 3️⃣ Ejecutar SP de update
    $stmt = $this->db->prepare("
        EXEC sp_contenidos_update
            :titulo,
            :descripcion,
            :vimeo_url,
            :imagen,
            :tipo_contenido_id,
            :rango_edad_id,
            :contexto_id,
            :estado_id,
            :abordaje_id,
            :youtube_url,
            :uuid
    ");

    $stmt->execute([
        ':titulo' => $dto->titulo,
        ':descripcion' => $dto->descripcion,
        ':vimeo_url' => $dto->vimeoUrl,
        ':imagen' => $imagenUrl,
        ':tipo_contenido_id' => $dto->tipoContenidoId,
        ':rango_edad_id' => $dto->rangoEdadId,
        ':contexto_id' => $dto->contextoId,
        ':estado_id' => $dto->estadoId,
        ':abordaje_id' => $dto->abordajeId,
        ':youtube_url' => $dto->youtubeUrl,
        ':uuid' => $uuid
    ]);

    // 4️⃣ Guardar archivos nuevos si vienen
    $this->syncFiles($contentId, $dto, $files);

    return $contentId;
     } catch (PDOException $e) {
            Logger::error("Error de contenido: " . $e->getMessage());
            throw new Exception("Error al crear contenido");
        }
}
private function syncFiles(int $contentId, ContentDTO $dto, array $files): void
{
    try{
    // 1️⃣ Obtener archivos actuales
    $stmt = $this->db->prepare("
        SELECT id 
        FROM archivos  
        WHERE contenido_id = :id
    ");
    $stmt->execute([':id' => $contentId]);
    $currentFiles = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // 2️⃣ Archivos que deben mantenerse (vienen del frontend)
    $keepFiles = $dto->existingFiles ?? [];
$currentFiles = array_map('intval', $currentFiles);
$keepFiles    = array_map('intval', $keepFiles);
Logger::info("Current Files: " . json_encode($currentFiles));
Logger::info("Keep Files: " . json_encode($keepFiles));
$filesToDelete = array_diff($currentFiles, $keepFiles);

if (!empty($filesToDelete)) {

    $in = implode(',', array_fill(0, count($filesToDelete), '?'));

    $deleteStmt = $this->db->prepare("
        DELETE FROM archivos  
        WHERE id IN ($in)
    ");

    $deleteStmt->execute(array_values($filesToDelete));
}
    // 4️⃣ Insertar archivos nuevos si vienen
    if (isset($files['new_files']) && !empty($files['new_files']['tmp_name'])) {

    foreach ($files['new_files']['tmp_name'] as $index => $tmpName) {

        if ($files['new_files']['error'][$index] !== 0) {
            continue;
        }

        $fileData = [
            'name'     => $files['new_files']['name'][$index],
            'type'     => $files['new_files']['type'][$index],
            'tmp_name' => $tmpName,
            'size'     => $files['new_files']['size'][$index],
            'uuid'     => Uuid::v4(),
        ];

        $fileData['url'] = $this->fileService->uploadFile($fileData, "contents");

        $this->saveContentFile($contentId, $fileData);
    }
}
 } catch (PDOException $e) {
            Logger::error("Error de contenido: " . $e->getMessage());
            throw new Exception("Error al crear contenido");
        }
}
public function delete(string $uuid): void
{
    try {
        // Opcional: obtener la categoría antes de eliminar (para borrar imagen si existe)
        $stmt = $this->db->prepare("SELECT imagen FROM Categorias WHERE uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();
        $category = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$category) {
            throw new Exception("Categoría no encontrada");
        }

        // Borrar imagen si existe
        if (!empty($category['imagen']) && file_exists(__DIR__ . '/../../public/uploads' . $category['imagen'])) {
            unlink(__DIR__ . '/../../public/uploads' . $category['imagen']);
            Logger::info("Imagen de categoría eliminada: " . $category['imagen']);
        }

        // Borrar categoría
        $stmt = $this->db->prepare("DELETE FROM Categorias WHERE uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();

        Logger::info("Categoría eliminada: $uuid");
    } catch (PDOException $e) {
        Logger::error("Error al eliminar categoría: " . $e->getMessage());
        throw new Exception("No se pudo eliminar la categoría");
    }
}
private function saveContentFile(int $contentId, array $fileData): void
{
    $stmt = $this->db->prepare("
        INSERT INTO archivos (contenido_id, nombre, ruta, tipo, peso, uuid, created_at)
        VALUES (:contenido_id, :nombre, :ruta, :tipo, :peso, :uuid, GETDATE())
    ");

    $stmt->execute([
        ':contenido_id' => $contentId,
        ':nombre' => $fileData['name'],
        ':ruta' => $fileData['url'],     // la ruta devuelta por tu fileService
        ':tipo' => $fileData['type'],
        ':peso' => $fileData['size'],
        ':uuid' => $fileData['uuid'],    // puedes generar uno con Uuid::v4()
    ]);
}
public function getContentByUuid(string $uuid): array
{
    try{
    // Obtener datos principales
  $stmt = $this->db->prepare("EXEC sp_get_all_content_byuuid @uuid = :uuid");
    $stmt->execute([':uuid' => $uuid]);
    $content = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$content) throw new Exception("Contenido no encontrado");

    $contentId = $content['id'];

    // Archivos asociados
    $stmtFiles = $this->db->prepare("SELECT * FROM archivos WHERE contenido_id = :id");
    $stmtFiles->execute([':id' => $contentId]);
    $files = $stmtFiles->fetchAll(PDO::FETCH_ASSOC);

    // Centros
    $stmtCenters = $this->db->prepare("
        SELECT ce.id, ce.nombre
        FROM contenido_centro_educativo cce
        INNER JOIN centros_educativos ce ON ce.id = cce.centro_educativo_id
        WHERE cce.contenido_id = :id
    ");
    $stmtCenters->execute([':id' => $contentId]);
    $centers = $stmtCenters->fetchAll(PDO::FETCH_ASSOC);

    // Categorías
    $stmtCategories = $this->db->prepare("
        SELECT cat.id, cat.nombre
        FROM contenido_categoria cc
        INNER JOIN categorias cat ON cat.id = cc.categoria_id
        WHERE cc.contenido_id = :id
    ");
    $stmtCategories->execute([':id' => $contentId]);
    $categories = $stmtCategories->fetchAll(PDO::FETCH_ASSOC);

    // Trivias
    $stmtTrivias = $this->db->prepare("
        SELECT t.id, t.trivia
        FROM contenido_trivia ct
        INNER JOIN trivias t ON t.id = ct.trivia_id
        WHERE ct.contenido_id = :id
    ");
    $stmtTrivias->execute([':id' => $contentId]);
    $trivias = $stmtTrivias->fetchAll(PDO::FETCH_ASSOC);

    // Estudiantes
    $stmtStudents = $this->db->prepare("
        SELECT s.id, s.nombre, s.primer_apellido, s.alias
        FROM contenido_estudiante cs
        INNER JOIN estudiantes s ON s.id = cs.estudiante_id
        WHERE cs.contenido_id = :id
    ");
    $stmtStudents->execute([':id' => $contentId]);
    $students = $stmtStudents->fetchAll(PDO::FETCH_ASSOC);

    // Tags (si están guardados en JSON)
    $stmtTags = $this->db->prepare("
        SELECT  e.nombre  
        FROM contenido_tag ct LEFT JOIN etiquetas e ON ct.tag_id=e.id 
        WHERE ct.contenido_id = :id
    ");
    $stmtTags->execute([':id' => $contentId]);
    $tags = $stmtTags->fetchAll(PDO::FETCH_ASSOC);
    return [
        'contenido' => $content,
        'files' => $files,
        'centros' => $centers,
        'categorias' => $categories,
        'trivias' => $trivias,
        'estudiantes' => $students,
        'tags' => $tags
    ];
    } catch (PDOException $e) {
        Logger::error("Error al cargar datos: " . $e->getMessage());
        throw new Exception("No se pudo eliminar la categoría");
    }
}
public function ensureTags(array $tags): array {
    $tagIds = [];

    foreach ($tags as $tagName) {
        // 1️⃣ Buscar si ya existe
        $stmt = $this->db->prepare("SELECT id FROM etiquetas WHERE nombre = ?");
        $stmt->execute([$tagName]);
        $tag = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($tag) {
            // Existe, guardamos el id
            $tagIds[] = (int)$tag['id'];
        } else {
            // No existe, insertamos
            $stmt = $this->db->prepare("INSERT INTO etiquetas (nombre) VALUES (?)");
            $stmt->execute([$tagName]);
            $tagIds[] = (int)$this->db->lastInsertId();
        }
    }

    return $tagIds;
}


}
