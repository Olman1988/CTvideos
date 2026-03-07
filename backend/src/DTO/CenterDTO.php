<?php

final class CenterDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?int $provincia_id;
    public ?int $canton_id;
    public ?int $distrito_id;
    public ?string $direccion;
    public ?string $telefono;
    public ?string $correo;
    public ?string $codsaber;
    public ?string $codpres;
    public ?string $tipo_institucion;
    public ?string $regional;
    public ?string $circuito;
    public ?int $estado;

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;
        $this->nombre = isset($input['nombre']) ? Sanitizer::string($input['nombre']) : null;
        $this->provincia_id = isset($input['provincia_id']) ? Sanitizer::int($input['provincia_id']) : null;
        $this->canton_id = isset($input['canton_id']) ? Sanitizer::int($input['canton_id']) : null;
        $this->distrito_id = isset($input['distrito_id']) ? Sanitizer::int($input['distrito_id']) : null;
        $this->direccion = isset($input['direccion']) ? Sanitizer::string($input['direccion']) : null;
        $this->telefono = isset($input['telefono']) ? Sanitizer::string($input['telefono']) : null;
        $this->correo = isset($input['correo']) ? Sanitizer::string($input['correo']) : null;
        $this->codsaber = isset($input['codsaber']) ? Sanitizer::string($input['codsaber']) : null;
        $this->codpres = isset($input['codpres']) ? Sanitizer::string($input['codpres']) : null;
        $this->tipo_institucion = isset($input['tipo_institucion']) ? Sanitizer::int($input['tipo_institucion']) : null;
        $this->regional = isset($input['regional']) ? Sanitizer::string($input['regional']) : null;
        $this->circuito = isset($input['circuito']) ? Sanitizer::string($input['circuito']) : null;
        $this->estado = isset($input['estado']) ? Sanitizer::int($input['estado']) : 1;
    }

    public function validate(): void
    {
        $errors = [];

        if (!$this->nombre) $errors[] = 'El nombre es obligatorio';
        if (!$this->provincia_id) $errors[] = 'La provincia es obligatoria';
        if (!$this->canton_id) $errors[] = 'El cantón es obligatorio';
        if (!$this->distrito_id) $errors[] = 'El distrito es obligatorio';

        if ($errors) {
            throw new Exception(implode(', ', $errors));
        }
    }
}