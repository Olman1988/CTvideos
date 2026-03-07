<?php

class SliderService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

    public function create(SliderDTO $dto, array $files): void
    {
        $dto->validate();

        if (!isset($files['imagen'])) {
            throw new Exception("La imagen es obligatoria");
        }

        $imagenUrl = $this->imageService->upload($files['imagen']);

        $sql = "
            INSERT INTO sliders (
                titulo, descripcion, imagen_url,
                boton1_texto, boton1_enlace,
                boton2_texto, boton2_enlace,
                estado_id, orden
            ) VALUES (
                :titulo, :descripcion, :imagen,
                :b1t, :b1u,
                :b2t, :b2u,
                :estado, :orden
            )
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->bindValue(':titulo', $dto->titulo);
        $stmt->bindValue(':descripcion', $dto->descripcion);
        $stmt->bindValue(':imagen', $imagenUrl);
        $stmt->bindValue(':b1t', $dto->boton1Texto);
        $stmt->bindValue(':b1u', $dto->boton1Enlace);
        $stmt->bindValue(':b2t', $dto->boton2Texto);
        $stmt->bindValue(':b2u', $dto->boton2Enlace);
        $stmt->bindValue(':estado', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':orden', $dto->orden, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function update(string $uuid, SliderDTO $dto, array $files): void
    {
        $dto->validate();

        $sqlImagen = '';
        $imagenUrl = null;

        if (!empty($files['imagen']) && $files['imagen']['error'] === UPLOAD_ERR_OK) {
            $imagenUrl = $this->imageService->upload($files['imagen']);
            $sqlImagen = ', imagen_url = :imagen';
        }

        $sql = "
            UPDATE sliders SET
                titulo = :titulo,
                descripcion = :descripcion,
                boton1_texto = :b1t,
                boton1_enlace = :b1u,
                boton2_texto = :b2t,
                boton2_enlace = :b2u,
                estado_id = :estado,
                orden = :orden
                {$sqlImagen},
                actualizado_en = GETDATE()
            WHERE uuid = :uuid
        ";

        $stmt = $this->db->prepare($sql);

        $stmt->bindValue(':titulo', $dto->titulo);
        $stmt->bindValue(':descripcion', $dto->descripcion);
        $stmt->bindValue(':b1t', $dto->boton1Texto);
        $stmt->bindValue(':b1u', $dto->boton1Enlace);
        $stmt->bindValue(':b2t', $dto->boton2Texto);
        $stmt->bindValue(':b2u', $dto->boton2Enlace);
        $stmt->bindValue(':estado', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':orden', $dto->orden, PDO::PARAM_INT);
        $stmt->bindValue(':uuid', $uuid);

        if ($imagenUrl !== null) {
            $stmt->bindValue(':imagen', $imagenUrl);
        }

        Logger::error("UPDATE SLIDER uuid={$uuid}");

        $stmt->execute();
    }

    public function getAll(): array
    {
        $sql = "
            SELECT 
                s.*, es.nombre AS estado_catalogo
            FROM sliders s
            LEFT JOIN estados_catalogos es ON s.estado_id = es.id
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllActive():array
    {
        $sql = "
            SELECT 
                s.[uuid]
      ,s.[titulo]
      ,s.[descripcion]
      ,s.[imagen_url]
      ,s.[boton1_texto]
      ,s.[boton1_enlace]
      ,s.[boton2_texto]
      ,s.[boton2_enlace]
      ,s.[orden], es.nombre AS estado_catalogo
            FROM sliders s
            LEFT JOIN estados_catalogos es ON s.estado_id = es.id where s.[estado_id]=1 ORDER BY s.orden asc;
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUuid(string $uuid): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM sliders WHERE uuid = :uuid"
        );
        $stmt->bindParam(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
    public function delete(string $uuid): void
{
    try {
        // Opcional: obtener la categoría antes de eliminar (para borrar imagen si existe)
        $stmt = $this->db->prepare("SELECT imagen_url FROM sliders WHERE uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();
        $slider = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$slider) { 
            throw new Exception("Slider no encontrada");
        }

        // Borrar imagen si existe
        if (!empty($slider['imagen_url']) && file_exists(__DIR__ . '/../../public/uploads' . $slider['imagen_url'])) {
            unlink(__DIR__ . '/../../public/uploads' . $slider['imagen_url']);
            Logger::info("Imagen de slider eliminada: " . $slider['imagen_url']);
        }

        // Borrar slider
        $stmt = $this->db->prepare("DELETE FROM sliders WHERE uuid = :uuid");
        $stmt->bindValue(':uuid', $uuid, PDO::PARAM_STR);
        $stmt->execute();

        Logger::info("Slider eliminado: $uuid");
    } catch (PDOException $e) {
        Logger::error("Error al eliminar slider: " . $e->getMessage());
        throw new Exception("No se pudo eliminar el slider");
    }
}
}
