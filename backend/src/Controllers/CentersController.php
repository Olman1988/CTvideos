<?php

class CentersController
{ 
    private PDO $db;
    private CenterService $service;

    public function __construct()
    {
        $this->service=new CenterService();
    }


    public function getAllActiveCenters(): void
    {
        Response::json( 
            $this->service->getAllActiveCenters(),
            200
        );
    }
    public function create(): void
    {
        try {
            $request = Request::json();
            $dto = new CenterDTO($request);
            $dto->validate();

            $uuid = $this->service->create($dto);

            Response::json(["message" => "Centro creado correctamente", "uuid" => $uuid], 201);
        } catch (Throwable $e) {
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function getAll(): void
    {
        Response::json($this->service->getAll(), 200);
    }

    public function getByUuid(string $uuid): void
    {
        try {
            $center = $this->service->getByUuid($uuid);
            Response::json($center, 200);
        } catch (Throwable $e) {
            Response::json(["error" => $e->getMessage()], 404);
        }
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::json();
              $dto = new CenterDTO($request);
            $dto->validate();

            $this->service->update($uuid, $dto);
            Response::json(["message" => "Centro actualizado correctamente"], 200);
        } catch (Throwable $e) {
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function delete(string $uuid): void
    {
        try {
            $this->service->delete($uuid);
            Response::json(["message" => "Centro eliminado correctamente"], 200);
        } catch (Throwable $e) {
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

}
