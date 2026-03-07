<?php

class TestimonyDTO
{
    public string $nombre;
    public string $mensaje;
    public ?string $imagen;
    public int $activo;

    public function __construct(array $data)
    {
        $this->nombre  = trim($data['nombre'] ?? '');
        $this->mensaje = trim($data['mensaje'] ?? '');
        $this->imagen  = $data['imagen'] ?? null;

        // Por defecto activo = 1
        $this->activo  = isset($data['activo']) 
            ? (int)$data['activo'] 
            : 1;
    }

    // =====================================
    // Validaciones
    // =====================================
    public function validate(): void
    {
        if ($this->nombre === '') {
            throw new InvalidArgumentException("El nombre es obligatorio");
        }

        if (strlen($this->nombre) > 150) {
            throw new InvalidArgumentException("El nombre no puede superar los 150 caracteres");
        }

        if ($this->mensaje === '') {
            throw new InvalidArgumentException("El mensaje es obligatorio");
        }

        if (!in_array($this->activo, [0, 1], true)) {
            throw new InvalidArgumentException("El estado activo debe ser 0 o 1");
        }
    }

    // =====================================
    // Convertir a array (útil para auditoría)
    // =====================================
    public function toArray(): array
    {
        return [
            'nombre'  => $this->nombre,
            'mensaje' => $this->mensaje,
            'imagen'  => $this->imagen,
            'activo'  => $this->activo
        ];
    }
}
