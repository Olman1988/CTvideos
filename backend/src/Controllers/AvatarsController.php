<?php

class AvatarsController
{ 
    private PDO $db;
    private AvatarService $service;

    public function __construct()
    {
        $this->service=new AvatarService();
    }
    public function create(): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new AvatarDTO($data);
            $dto->validate();

            $this->service->create($dto, $files); 

            Response::json(["message" => "Avatar creado correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear Avatar | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function getAllActive(): void
    {
        Response::json( 
            $this->service->getAllActive(),
            200
        );
    }
      public function getAll(): void
    {
        Response::json( 
            $this->service->getAll(),
            200
        );
    }
     public function getByUuid(string $uuid): void
    {
        $Badge = $this->service->getByUuid($uuid);

        if (!$Badge) {
            Response::json(['error' => 'Badge no encontrado'], 404);
            return;
        }

        Response::json($Badge, 200);
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new AvatarDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->update($uuid, $dto, $files);
 
            Response::json(["message" => "Badge actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar Badge | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
}
