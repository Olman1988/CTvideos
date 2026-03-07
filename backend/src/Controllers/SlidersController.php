<?php


class SlidersController
{
    private SliderService $service;
    public function __construct(
        
    ) {

    $this->service = new SliderService();
    }

    public function getAllActive():void
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
        $slider = $this->service->getByUuid($uuid);

        if (!$slider) {
            Response::json(['error' => 'Slider no encontrado'], 404);
            return;
        }

        Response::json($slider, 200);
    }
    public function create(): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new SliderDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->create($dto, $files);

            Response::json(["message" => "Slider creado correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear slider | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new SliderDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->update($uuid, $dto, $files);

            Response::json(["message" => "Slider actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar slider | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
    public function delete(string $uuid): void
{
    try {
        $this->service->delete($uuid);

        Response::json([
            "message" => "Slider eliminado correctamente",
            "uuid" => $uuid
        ]);
    } catch (Exception $e) {
        Logger::error("Error en SlidersController::delete - " . $e->getMessage());
        Response::json(["error" => $e->getMessage()], 400);
    }
}
}
