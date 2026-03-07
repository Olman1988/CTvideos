<?php

class EmotionDTO
{
    public string $nombre;
    public ?string $icono;
    public int $estado_id;
    public string $color;
    public array $sinonimos;

    public function __construct(array $data)
    {
        $this->nombre = trim($data['nombre'] ?? '');
        $this->icono = $data['icono'] ?? null;
        $this->estado_id = isset($data['estado_id']) ? (int)$data['estado_id'] : 1;
        $this->color = trim($data['color'] ?? '#000000');
        $this->sinonimos = isset($data['sinonimos']) && is_array($data['sinonimos'])
            ? array_map('trim', $data['sinonimos'])
            : [];
    }

    public function validate(): void
    {
        if ($this->nombre === '') {
            throw new InvalidArgumentException("El nombre es obligatorio");
        }
        if (strlen($this->nombre) > 100) {
            throw new InvalidArgumentException("El nombre no puede superar 100 caracteres");
        }

        if ($this->icono === null || $this->icono === '') {
            throw new InvalidArgumentException("El icono es obligatorio");
        }

        if (!is_int($this->estado_id)) {
            throw new InvalidArgumentException("El estado_id es obligatorio y debe ser un entero");
        }

        if (!preg_match('/^#([0-9A-Fa-f]{6})$/', $this->color)) {
            throw new InvalidArgumentException("El color debe ser un valor hexadecimal válido (ej. #FF0000)");
        }

        foreach ($this->sinonimos as $s) {
            if (!is_string($s) || strlen($s) === 0) {
                throw new InvalidArgumentException("Cada sinónimo debe ser un texto válido");
            }
            if (strlen($s) > 50) {
                throw new InvalidArgumentException("Cada sinónimo no puede superar 50 caracteres");
            }
        }
    }

    public function toArray(): array
    {
        return [
            'nombre' => $this->nombre,
            'icono' => $this->icono,
            'estado_id' => $this->estado_id,
            'color' => $this->color,
            'sinonimos' => $this->sinonimos
        ];
    }
}
