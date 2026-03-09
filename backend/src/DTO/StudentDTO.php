<?php
final class StudentDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $primerApellido;
    public ?string $segundoApellido;
    public ?string $alias;
    public ?int $estadoId;
    public ?int $avatarId;
    public ?string $fechaNacimiento;
    public ?bool $usuarioRequerido;
    public ?UserDTO $user;

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

        $this->alias = isset($input['alias']) && trim($input['alias']) !== ''
            ? Sanitizer::string($input['alias'])
            : null;

        $this->usuarioRequerido = isset($input['usuarioRequerido'])
            ? Sanitizer::bool($input['usuarioRequerido'])
            : null;

        $this->estadoId = isset($input['estado_id'])
            ? (int) $input['estado_id']
            : 1;

        $this->avatarId = isset($input['avatar_id'])
            ? (int) $input['avatar_id']
            : null;

        $this->fechaNacimiento = isset($input['fecha_nacimiento']) && trim($input['fecha_nacimiento']) !== ''
            ? $input['fecha_nacimiento']
            : null;

        if (isset($input['centros_educativos']) && is_array($input['centros_educativos'])) {
            $this->centrosEducativos = array_map('intval', $input['centros_educativos']);
        }

        if ($this->usuarioRequerido && isset($input['user']) && is_array($input['user'])) {
			$input['user']["nombre"] = $input['nombre']." ".$input['primer_apellido']." ". $input['segundo_apellido'];
            $this->user = new UserDTO($input['user']);
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

        // 🔹 Validar usuario si es requerido
        if ($this->usuarioRequerido) {
            if (!$this->user) {
                throw new Exception('Datos del usuario son obligatorios cuando usuarioRequerido es true');
            }

            $this->user->validate(); // valida campos del usuario
        }
    }
}
