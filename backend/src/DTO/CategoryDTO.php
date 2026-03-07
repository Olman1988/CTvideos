<?php

final class CategoryDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $descripcion;
    public ?int $estadoId;
    public ?string $imagen; // ruta de la imagen

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null; // opcional en create
        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;

        $this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->estadoId = isset($input['estado_id']) && $input['estado_id'] !== ''
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->imagen = isset($input['imagen']) && trim($input['imagen']) !== ''
            ? Sanitizer::string($input['imagen'])
            : null;
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
