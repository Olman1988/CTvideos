<?php
final class TutorDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $primerApellido;
    public ?string $segundoApellido;
    public ?int $estadoId;
    public ?string $fechaNacimiento;
     public ?bool $usuarioRequerido;

    /** @var int[] */
    public array $centrosEducativos = [];

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

        $this->estadoId = isset($input['estado_id'])
            ? (int) $input['estado_id']
            : 1;
        $this->usuarioRequerido = isset($input['usuarioRequerido']) && trim($input['usuarioRequerido']) !== ''
            ? Sanitizer::bool($input['usuarioRequerido'])
            : null;      

        if (isset($input['centros_educativos']) && is_array($input['centros_educativos'])) {
            $this->centrosEducativos = array_map('intval', $input['centros_educativos']);
        }
    }

    public function validate(): void
    {
        if (!$this->nombre) {
            throw new Exception('El nombre del estudiante es obligatorio');
        }

        if (!$this->primerApellido) {
            throw new Exception('El primer apellido es obligatorio');
        }

        if (empty($this->centrosEducativos)) {
            throw new Exception('Debe seleccionar al menos un centro educativo');
        }
    }
}
