<?php

final class GuardianDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $primerApellido;
    public ?string $segundoApellido;
    public ?string $dni;
    public ?string $telefono;
    public ?string $email;
    public ?int $estadoId;
    public ?bool $usuarioRequerido;

    /** @var array<int, array{estudiante_id: int, parentesco_id: int}> */
    public array $estudiantes = [];

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;

        $this->primerApellido = isset($input['primer_apellido']) && trim($input['primer_apellido']) !== ''
            ? Sanitizer::string($input['primer_apellido'])
            : null;

        $this->segundoApellido = isset($input['segundo_apellido']) && trim($input['segundo_apellido']) !== ''
            ? Sanitizer::string($input['segundo_apellido'])
            : null;

        $this->dni = isset($input['dni']) && trim($input['dni']) !== ''
            ? Sanitizer::string($input['dni'])
            : null;

        $this->usuarioRequerido = isset($input['usuarioRequerido']) && trim($input['usuarioRequerido']) !== ''
            ? Sanitizer::bool($input['usuarioRequerido'])
            : null;    

        $this->telefono = $input['telefono'] ?? null;
        $this->email = $input['email'] ?? null;
        $this->estadoId = isset($input['estado_id'])
            ? (int) $input['estado_id']
            : 1;

        if (isset($input['estudiantes']) && is_array($input['estudiantes'])) {
            $this->estudiantes = array_map(function ($item) {
                return [
                    'estudiante_id' => (int) ($item['estudiante_id'] ?? 0),
                    'parentesco_id' => (int) ($item['parentesco_id'] ?? 0),
                ];
            }, $input['estudiantes']);
        }

    }

    public function validate(): void
    {
        if (!$this->nombre) {
            throw new Exception('El nombre del encargado es obligatorio');
        }

        if (!$this->primerApellido) {
            throw new Exception('El primer apellido del encargado es obligatorio');
        }

        if (!$this->dni) {
            throw new Exception('El DNI del encargado es obligatorio');
        }

        if (empty($this->estudiantes)) {
            throw new Exception('Debe asociar al menos un estudiante con el encargado');
        }
    }
}
