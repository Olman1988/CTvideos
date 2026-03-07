<?php
final class RoleDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $descripcion;
    public ?bool $estado;

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;
            $this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->estado = isset($input['estado'])
            ? (bool)$input['estado'] 
            : true; 
    }

    public function validate(): void
    {
        if (!$this->nombre) {
            Logger::error("Error crear Role | El nombre del rol es obligatorio");
            throw new Exception('El nombre del rol es obligatorio');

        }
        if (!$this->descripcion) {
            Logger::error("Error crear Role | La descripción del rol es obligatorio");
            throw new Exception('La descripción del rol es obligatorio');
        }
        
    }
}
