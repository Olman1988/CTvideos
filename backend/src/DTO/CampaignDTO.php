<?php

final class CampaignDTO
{
    public ?string $nombre;
    public ?string $descripcion;
    public ?string $fechaInicio;
    public ?string $fechaFin;
    public ?int $estadoId;
    public ?string $imagen;

    /** @var array<int, array{accion_id:int, multiplicador:float}> */
    public array $acciones = [];

    public function __construct(array $input)
    {
        $this->nombre = !empty($input['nombre'])
            ? Sanitizer::string($input['nombre'])
            : null;

        $this->descripcion = !empty($input['descripcion'])
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->fechaInicio = $input['fecha_inicio'] ?? null;
        $this->fechaFin = $input['fecha_fin'] ?? null;

        $this->estadoId = isset($input['estado_id'])
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->imagen = $input['imagen'] ?? null;

        // acciones viene como JSON string
        if (!empty($input['acciones'])) {
            $acciones = json_decode($input['acciones'], true);

            if (is_array($acciones)) {
                foreach ($acciones as $accion) {
                    if (
                        isset($accion['accion_id']) &&
                        isset($accion['multiplicador'])
                    ) {
                        $this->acciones[] = [
                            'accion_id' => (int)$accion['accion_id'],
                            'multiplicador' => (float)$accion['multiplicador'],
                            'puntaje'=> (int)$accion['puntaje'],
                        ];
                    }
                }
            }
        }
    }

    public function validate(): void
    {
        $errors = [];

        if (!$this->nombre) {
            $errors[] = 'El nombre es obligatorio';
        }

        if (!$this->fechaInicio || !$this->fechaFin) {
            $errors[] = 'Fecha inicio y fin son obligatorias';
        }

        if (strtotime($this->fechaFin) <= strtotime($this->fechaInicio)) {
            $errors[] = 'La fecha fin debe ser mayor a la fecha inicio';
        }

        if (!$this->estadoId) {
            $errors[] = 'El estado es obligatorio';
        }

        if (empty($this->acciones)) {
            $errors[] = 'Debe agregar al menos una acción';
        }

        if ($errors) {
            throw new Exception(implode(', ', $errors));
        }
    }
}
