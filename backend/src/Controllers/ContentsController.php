<?php

class ContentsController{
        private ContentService $service;
    public function __construct(
        
    ) {

    $this->service = new ContentService();
    }

    public function getAll(): void
    {
        Response::json(
            $this->service->getAll(),
            200
        );
    }

    public function getAllActiveStatus(): void
    {
        Response::json(
            $this->service->getAllActiveStatus(),
            200
        );
    }
    public function getAllActiveApproaches(): void
    {
        Response::json(
            $this->service->getAllActiveApproaches(),
            200
        );
    }
    public function getAllActiveTypes(): void
    {
        Response::json(
            $this->service->getAllActiveTypes(),
            200
        );
    }

    public function getAllActiveAgeRanges(): void
    {
        Response::json(
            $this->service->getAllActiveAgeRanges(),
            200
        );
    }
    public function getAllActiveContext(): void
    {
        Response::json(
            $this->service->getAllActiveContext(),
            200
        );
    }

      public function getAllActiveTags(): void
    {
        Response::json(
            $this->service->getAllActiveTags(),
            200
        );
    }

    public function getByUuid(string $uuid): void
    {
        $Content = $this->service->getContentByUuid($uuid);

        if (!$Content) {
            Response::json(['error' => 'Contenido no encontrado'], 404);
            return;
        }

        Response::json($Content, 200);
    }
    public function create(): void
{
    try {

        $request = Request::form();
        $data  = $request['data'] ?? [];
        $files = $request['files'] ?? [];
        $dto = new ContentDTO($data);
        $contentId = $this->service->create($dto,$files);
        $tagIds = $this->service->ensureTags($dto->tags);
        $this->service->syncRelations($contentId, "contenido_tag", "tag_id", $tagIds);
        $this->service->syncRelations($contentId, "contenido_categoria", "categoria_id", $dto->categorias);
        $this->service->syncRelations($contentId, "contenido_estudiante", "estudiante_id", $dto->estudiantes);
        $this->service->syncRelations($contentId, "contenido_trivia", "trivia_id", $dto->trivias);
        $this->service->syncRelations($contentId, "contenido_centro_educativo", "centro_educativo_id", $dto->centros);
        
       Response::json([
                "message" => "Contenido creado correctamente",
                "id"    => $contentId
            ], 201);
    } catch (Throwable $e) {
            Logger::error("Error crear contenido | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
}

    public function update(string $uuid): void
    {
        try {
            $request = Request::form();
            $data = $request['data'];
            
            $files = $request['files'];

          
            $dto = new ContentDTO($data); // 👈 SOLO los campos
            $dto->validate();
        Logger::info("Error editar Contenido | {}".json_encode($dto));
        
        $contentId=$this->service->update($uuid, $dto, $files); 
        Logger::info("Error editar id | {}". $contentId);
        $tagIds = $this->service->ensureTags($dto->tags);
        $this->service->syncRelations($contentId, "contenido_tag", "tag_id", $tagIds);
        $this->service->syncRelations($contentId, "contenido_categoria", "categoria_id", $dto->categorias);
        $this->service->syncRelations($contentId, "contenido_estudiante", "estudiante_id", $dto->estudiantes);
        $this->service->syncRelations($contentId, "contenido_trivia", "trivia_id", $dto->trivias);
        $this->service->syncRelations($contentId, "contenido_centro_educativo", "centro_educativo_id", $dto->centros);
        

            Response::json(["message" => "Contenido actualizado correctamente"], 200);

        } catch (Throwable $e) {
            Logger::error("Error editar Contenido | {$e->getMessage()}");
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