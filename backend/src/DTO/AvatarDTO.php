<?php

final class AvatarDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?int $estadoId;
    public ?string $imagen; // ruta de la imagen
    public array $insignias;

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null; // opcional en create
        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;


        $this->estadoId = isset($input['estado_id']) && $input['estado_id'] !== ''
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->imagen = isset($input['imagen']) && trim($input['imagen']) !== ''
            ? Sanitizer::string($input['imagen'])
            : null;
        if (!empty($input['insignias'])) {

    // Si viene como JSON string
    if (is_string($input['insignias'])) {
        $decoded = json_decode($input['insignias'], true);

        if (is_array($decoded)) {
            $this->insignias = array_map('intval', $decoded);
        } elseif (is_numeric($decoded)) {
            $this->insignias = [(int)$decoded];
        } else {
            $this->insignias = [];
        }

    }
    // Si viene como array directamente
    elseif (is_array($input['insignias'])) {
        $this->insignias = array_map('intval', $input['insignias']);
    }
    // Si viene como número
    elseif (is_numeric($input['insignias'])) {
        $this->insignias = [(int)$input['insignias']];
    } else {
        $this->insignias = [];
    }

} else {
    $this->insignias = [];
}
    }

    public function validate(): void
    {
        $errors = [];

        if (!$this->nombre) {
            $errors[] = 'El nombre de la categoría es obligatorio';
        }

        if (!$this->estadoId) {
            $errors[] = 'El estado de la categoría es obligatorio';
        }

        if ($errors) {
            throw new Exception(implode(', ', $errors));
        }
    }
}
