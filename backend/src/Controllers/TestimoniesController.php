<?php

class TestimoniesController
{
    private TestimonyService $service;

    public function __construct()
    {
        $this->service = new TestimonyService();
    }

    // ==========================================
    // Obtener activos (frontend)
    // ==========================================
    public function getAllActive(): void
    {
        Response::json(
            $this->service->getAllActive(),
            200
        );
    }

    // ==========================================
    // Obtener todos (admin)
    // ==========================================
    public function getAll(): void
    {
        Response::json(
            $this->service->getAll(),
            200
        );
    }

    // ==========================================
    // Obtener por UUID
    // ==========================================
    public function getByUuid(string $uuid): void
    {
        try {
            $testimonio = $this->service->getByUuid($uuid);

            Response::json($testimonio, 200);

        } catch (Throwable $e) {
            Logger::error("Error obtener testimonio | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 404);
        }
    }

    // ==========================================
    // Crear
    // ==========================================
    public function create(): void
    {
        try {
            $request = Request::form();

            $data  = $request['data'] ?? [];
            $files = $request['files'] ?? [];

            $dto = new TestimonyDTO($data);
            $dto->validate();

            $uuid = $this->service->create($dto, $files);

            Response::json([
                "message" => "Testimonio creado correctamente",
                "uuid"    => $uuid
            ], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear testimonio | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    // ==========================================
    // Actualizar
    // ==========================================
    public function update(string $uuid): void
    {
        try {
            $request = Request::form();

            $data  = $request['data'] ?? [];
            $files = $request['files'] ?? [];

            $dto = new TestimonyDTO($data);
            $dto->validate();

            $this->service->update($uuid, $dto, $files);

            Response::json([
                "message" => "Testimonio actualizado correctamente",
                "uuid"    => $uuid
            ], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar testimonio | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }

    // ==========================================
    // Eliminar (soft delete)
    // ==========================================
    public function delete(string $uuid): void
    {
        try {
            $this->service->delete($uuid);

            Response::json([
                "message" => "Testimonio eliminado correctamente",
                "uuid"    => $uuid
            ], 200);

        } catch (Throwable $e) {
            Logger::error("Error eliminar testimonio | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
}
