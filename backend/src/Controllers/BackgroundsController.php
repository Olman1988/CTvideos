<?php

class BackgroundsController
{
    private BackgroundService $service;

    public function __construct()
    {
        $this->service = new BackgroundService();
    }

    public function create(): void
    {
        try {
            $request = Request::form();
            $dto = new BackgroundDTO($request['data']);
            $dto->validate();

            $this->service->create($dto, $request['files']);

            Response::json(["message" => "Background creado correctamente"], 201);

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
        Response::json($this->service->getByUuid($uuid), 200);
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $dto = new BackgroundDTO($request['data']);
            $dto->validate();

            $this->service->update($uuid, $dto, $request['files']);

            Response::json(["message" => "Background actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
}