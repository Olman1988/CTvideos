<?php


class CategoriesController
{
    private CategoryService $service;
    public function __construct(
        
    ) {

    $this->service = new CategoryService();
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

    public function getByUuid(string $uuid): void
    {
        $Category = $this->service->getByUuid($uuid);

        if (!$Category) {
            Response::json(['error' => 'Category no encontrado'], 404);
            return;
        }

        Response::json($Category, 200);
    }
    public function create(): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new CategoryDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->create($dto, $files);

            Response::json(["message" => "Category creado correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear Category | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            $files = $request['files'];
            $dto = new CategoryDTO($data); // 👈 SOLO los campos
            $dto->validate();

            $this->service->update($uuid, $dto, $files);

            Response::json(["message" => "Category actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar Category | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
    public function delete(string $uuid): void
{
    try {
        $this->service->delete($uuid);

        Response::json([
            "message" => "Categoría eliminada correctamente",
            "uuid" => $uuid
        ]);
    } catch (Exception $e) {
        Logger::error("Error en CategoriesController::delete - " . $e->getMessage());
        Response::json(["error" => $e->getMessage()], 400);
    }
}


}
