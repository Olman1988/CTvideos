<?php

final class BadgeDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $descripcion;
    public ?bool $activo;
    public ?float $multiplicador;
    public ?int $rangoInicio;
    public ?int $rangoFin;
    public ?int $accionId;
    public ?string $imagen;
    public ?int $campanaId;

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;

        $this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->activo = isset($input['activo'])
            ? (bool) Sanitizer::int($input['activo'])
            : null;

        $this->multiplicador = isset($input['multiplicador']) && $input['multiplicador'] !== ''
            ? (float) Sanitizer::string($input['multiplicador'])
            : null;

        $this->rangoInicio = isset($input['rango_inicio']) && $input['rango_inicio'] !== ''
            ? Sanitizer::int($input['rango_inicio'])
            : null;

        $this->rangoFin = isset($input['rango_fin']) && $input['rango_fin'] !== ''
            ? Sanitizer::int($input['rango_fin'])
            : null;

        $this->accionId = isset($input['accion_id']) && $input['accion_id'] !== ''
            ? Sanitizer::int($input['accion_id'])
            : null;
            $this->campanaId = isset($input['campana_id']) && $input['campana_id'] !== ''
            ? Sanitizer::int($input['campana_id'])
            : null;

        $this->imagen = isset($input['imagen']) && trim($input['imagen']) !== ''
            ? Sanitizer::string($input['imagen'])
            : null;
    }

    public function validate(): void
    {
        $errors = [];

        if (!$this->nombre) {
            $errors[] = 'El nombre de la insignia es obligatorio';
        }

        
        if ($this->multiplicador === null) {
            $errors[] = 'El multiplicador es obligatorio';
        }

        if (
            $this->rangoInicio !== null &&
            $this->rangoFin !== null &&
            $this->rangoFin < $this->rangoInicio
        ) {
            $errors[] = 'El rango fin no puede ser menor que el rango inicio';
        }

       

        if ($errors) {
            throw new Exception(implode(', ', $errors));
        }
    }
}
