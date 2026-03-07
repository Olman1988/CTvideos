<?php


class TriviasController
{
    private TriviaService $service;
    public function __construct(
        
    ) {

    $this->service = new TriviaService();
    }

    public function getAll(): void
    {
        Response::json(
            $this->service->getAll(),
            200
        );
    }

    public function getAllActive(): void
    {
        Response::json(
            $this->service->getAllActive(),
            200
        );
    }

    public function getAllStatus()
    {
        Response::json(
            $this->service->getAllStatus(),
            200
        );
    }

    public function getByUuid(string $uuid): void
    {
        $Trivia = $this->service->getByUuid($uuid);

        if (!$Trivia) {
            Response::json(['error' => 'Trivia no encontrado'], 404);
            return;
        }

        Response::json($Trivia, 200);
    }
    public function create(): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new TriviaDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->create($dto, $files);

            Response::json(["message" => "Trivia creado correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear Trivia | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new TriviaDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->update($uuid, $dto, $files);

            Response::json(["message" => "Trivia actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar Trivia | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
    public function delete(string $uuid): void
{
    try {
        $this->service->delete($uuid);

        Response::json([
            "message" => "Trivia eliminada correctamente",
            "uuid" => $uuid
        ]);
    } catch (Exception $e) {
        Logger::error("Error en TriviasController::delete - " . $e->getMessage());
        Response::json(["error" => $e->getMessage()], 400);
    }
}


}
