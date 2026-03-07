<?php

class CategoryService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

    // -----------------------------
    // Crear categoría
    // -----------------------------
    public function create(CategoryDTO $dto,array $files): string
    {
        $dto->validate();
        if (!isset($files['imagen'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->imageService->upload($files['imagen']);

        if (!$dto->uuid) {
            $dto->uuid = Uuid::v4(); // tu clase Uuid
        }

        $stmt = $this->db->prepare("
            INSERT INTO Categorias (uuid, nombre, descripcion, estado_id, imagen)
            VALUES (:uuid, :nombre, :descripcion, :estado_id, :imagen)
        ");

        $stmt->bindValue(':uuid', $dto->uuid, PDO::PARAM_STR);
        $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $dto->descripcion, PDO::PARAM_STR);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':imagen', $imagenUrl, PDO::PARAM_STR);

        try {
            $stmt->execute();
            Logger::info("Categoría creada: {$dto->nombre} ({$dto->uuid})");
            return $dto->uuid;
        } catch (PDOException $e) {
            Logger::error("Error al crear categoría: " . $e->getMessage());
            throw new Exception("No se pudo crear la categoría");
        }
    }

    // -----------------------------
    // Traer todas las categorías
    // -----------------------------
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("SELECT 
            c.[uuid]
      ,c.[nombre]
      ,c.[descripcion]
      ,c.[estado_id]
      ,c.[imagen]
            , es.nombre AS estado_catalogo FROM categorias c LEFT JOIN estados_catalogos es ON es.id=c.estado_id
            ORDER BY c.creado_en DESC");
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Logger::info("Se consultaron " . count($result) . " categorías");
            return $result;
        } catch (PDOException $e) {
            Logger::error("Error al obtener categorías: " . $e->getMessage());
            throw new Exception("No se pudo obtener las categorías");
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
    public function update(string $uuid, CategoryDTO $dto, array $files): void
{
    // Validar DTO
    $dto->validate();

    $sqlImagen = '';
    $imagenUrl = null;

    // Manejar imagen si se sube
    if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
        $imagenUrl = $this->imageService->upload($files['imagen']);
        $sqlImagen = ', imagen = :imagen';
    }

    // SQL dinámico
    $sql = "
        UPDATE categorias SET
            nombre = :nombre,
            descripcion = :descripcion,
            estado_id = :estado
            {$sqlImagen},
            actualizado_en = GETDATE()
        WHERE uuid = :uuid
    ";

    $stmt = $this->db->prepare($sql);

    $stmt->bindValue(':nombre', $dto->nombre, PDO::PARAM_STR);
    $stmt->bindValue(':descripcion', $dto->descripcion, PDO::PARAM_STR);
    $stmt->bindValue(':estado', $dto->estadoId, PDO::PARAM_INT);
    $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);

    if ($imagenUrl !== null) {
        $stmt->bindValue(':imagen', $imagenUrl, PDO::PARAM_STR);
    }

    Logger::info("UPDATE CATEGORÍA uuid={$uuid}");

    $stmt->execute();
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


}
