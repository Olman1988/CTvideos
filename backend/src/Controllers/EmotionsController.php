<?php

class EmotionsController
{
    private EmotionService $service;

    public function __construct()
    {
        $this->service = new EmotionService();
    }

    public function getAllActive(): void
    {
        Response::json($this->service->getAllActive(), 200);
    }

    public function getAll(): void
    {
        Response::json($this->service->getAll(), 200);
    }

    public function getByUuid(string $uuid): void
    {
        try {
            $emotion = $this->service->getByUuid($uuid);
            Response::json($emotion, 200);
        } catch (Throwable $e) {
            Response::json(['error' => $e->getMessage()], 404);
        }
    }

    public function create(): void
{
    try {
        // Leer JSON
        $data = Request::json(); // ya devuelve array
        $files = $_FILES ?? [];   // si hay archivos, los seguimos tomando de form-data
        $dto = new EmotionDTO($data);
        $uuid = $this->service->create($dto, $files);

        Response::json([
            "message" => "Emoción creada correctamente",
            "uuid"    => $uuid
        ], 201);

    } catch (Throwable $e) {
        Response::json(['error' => $e->getMessage()], 400);
    }
}


    public function update(string $uuid): void
    {
         try {
        // Leer JSON
        $data = Request::json(); // ya devuelve array
        $dto = new EmotionDTO($data);
       $this->service->update($uuid,$dto);

        Response::json([
            "message" => "Emoción creada correctamente",
            "uuid"    => $uuid
        ], 201);

    } catch (Throwable $e) {
        Response::json(['error' => $e->getMessage()], 400);
    }
    }

    public function delete(int $id): void
    {
        try {
            $this->service->delete($id);
            Response::json(['message' => 'Emoción eliminada', 'id' => $id], 200);
        } catch (Throwable $e) {
            Response::json(['error' => $e->getMessage()], 400);
        }
    }
}
