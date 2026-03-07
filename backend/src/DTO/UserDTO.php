<?php

final class UserDTO
{
    public ?string $uuid;
    public ?string $nombre;
    public ?string $correo;
    public ?string $password;
    public ?string $confirmpassword;
    public ?int $estadoId;

    /** @var int[] */
    public array $roles = [];

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->nombre = isset($input['nombre']) && trim($input['nombre']) !== ''
            ? Sanitizer::string($input['nombre'])
            : null;

        $this->correo = isset($input['correo']) && trim($input['correo']) !== ''
            ? Sanitizer::string($input['correo'])
            : null;

        $this->password = isset($input['password']) && trim($input['password']) !== ''
            ? $input['password']
            : null;

        $this->confirmpassword = isset($input['confirmpassword']) && trim($input['confirmpassword']) !== ''
            ? $input['confirmpassword']
            : null;

        $this->estadoId = isset($input['estado_id'])
            ? (int)$input['estado_id']
            : 1;

        if (isset($input['roles']) && is_array($input['roles'])) {
            $this->roles = array_map('intval', $input['roles']);
        }
    }

    public function validate(): void
    {
        if (!$this->nombre) {
            throw new Exception('El nombre del usuario es obligatorio');
        }

        if (!$this->correo) {
            throw new Exception('El correo es obligatorio');
        }

        if (!$this->password) {
            throw new Exception('La contraseña es obligatoria');
        }

        if ($this->password !== $this->confirmpassword) {
            throw new Exception('Las contraseñas no coinciden');
        }
    }

    public function toArray(): array
    {
        return [
            'uuid'      => $this->uuid,
            'nombre'    => $this->nombre,
            'correo'    => $this->correo,
            'password'  => $this->password,
            'estado_id' => $this->estadoId,
            'roles'     => $this->roles,
        ];
    }
}