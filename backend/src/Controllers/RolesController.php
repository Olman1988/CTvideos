<?php

class RolesController
{ 
    private PDO $db;
    private RoleService $service;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->service=new RoleService();
    }
    public function create(): void
    {
        try {
            $request = Request::json();
            $data = $request; 

            $dto = new RoleDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->create($dto, $files);

            Response::json(["message" => "Role creado correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function getAllRoles(): void
    {
        Response::json( 
            $this->service->getAll(),
            200
        );
    }
    public function getByUuid(string $uuid): void
    {
        try {
            $rol = $this->service->getByUuid($uuid);

            if (!$rol) {
                Logger::error("Rol no encontradoy");
                Response::json(['error' => 'Rol no encontrado'], 404);
                return;
            }

            Response::json($rol, 200);
        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(['error' => 'Error al obtener el rol'], 500);
        }
    }

    public function update(string $uuid): void
    {
        try{
            $request = Request::json();
            $data = $request; 
            $dto = new RoleDTO($data); // 👈 SOLO los campos
            $dto->validate();
            $this->service->update($uuid, $dto);

            Response::json(['message' => 'Rol actualizado correctamente'], 200);
        } catch (Throwable $e) {
            Logger::error("Error editar rol | {$e->getMessage()}");
            Response::json(['error' => 'Error al actualizar el rol'], 500);
        }

    }
}
