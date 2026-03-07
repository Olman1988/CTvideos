<?php
class ContentDTO
{
    public ?string $uuid;
    public ?string $titulo;
    public ?string $descripcion;
    public ?string $youtubeUrl;
    public ?string $vimeoUrl;

    public ?int $tipoContenidoId;
    public ?int $rangoEdadId;
    public ?int $contextoId;
    public ?int $estadoId;
    public ?int $abordajeId;

    public array $tags;
    public array $categorias;
    public array $estudiantes;
    public array $trivias;
    public array $centros;
    public array $existingFiles;

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->titulo = isset($input['titulo']) && trim($input['titulo']) !== ''
            ? Sanitizer::string($input['titulo'])
            : null;
$this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
    ? strip_tags(
        $input['descripcion'],
        '<p><br><strong><b><em><i><ul><ol><li><blockquote><code><h1><h2><h3><h4><h5><h6><span>'
      )
    : null;

        $this->youtubeUrl = isset($input['youtube_url']) && trim($input['youtube_url']) !== ''
            ? Sanitizer::string($input['youtube_url'])
            : null;

        $this->vimeoUrl = isset($input['vimeo_url']) && trim($input['vimeo_url']) !== ''
            ? Sanitizer::string($input['vimeo_url'])
            : null;

        $this->tipoContenidoId = isset($input['tipo_contenido_id']) && $input['tipo_contenido_id'] !== ''
            ? Sanitizer::int($input['tipo_contenido_id'])
            : null;

        $this->rangoEdadId = isset($input['rango_edad_id']) && $input['rango_edad_id'] !== ''
            ? Sanitizer::int($input['rango_edad_id'])
            : null;

        $this->contextoId = isset($input['contexto_id']) && $input['contexto_id'] !== ''
            ? Sanitizer::int($input['contexto_id'])
            : null;

        $this->estadoId = isset($input['estado_id']) && $input['estado_id'] !== ''
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->abordajeId = isset($input['abordaje_id']) && $input['abordaje_id'] !== ''
            ? Sanitizer::int($input['abordaje_id'])
            : null;

        $this->tags = !empty($input['tags'])
    ? json_decode($input['tags'], true) // convierte string JSON a array
    : [];

$this->categorias = !empty($input['categorias'])
    ? array_map('intval', json_decode($input['categorias'], true))
    : [];
    $this->existingFiles = !empty($input['existingFiles'])
    ? $input['existingFiles']
    : [];

    

$this->estudiantes = !empty($input['estudiantes'])
    ? array_map('intval', json_decode($input['estudiantes'], true))
    : [];

$this->trivias = !empty($input['trivias'])
    ? array_map('intval', json_decode($input['trivias'], true))
    : [];

$this->centros = !empty($input['centros'])
    ? array_map('intval', json_decode($input['centros'], true))
    : [];
    }

    public function validate(): void
    {
        if (!$this->titulo) {
            throw new Exception("El título es obligatorio");
        }

        if (strlen($this->titulo) > 255) {
            throw new Exception("El título supera el máximo permitido");
        }
    }
}