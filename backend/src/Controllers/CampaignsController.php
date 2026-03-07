<?php


class CampaignsController
{
    private CampaignService $service;
    public function __construct(
        
    ) {

    $this->service = new CampaignService();
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
    public function getAllStatus(): void
    {
        Response::json(
            $this->service->getAllStatus(),
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
            $dto = new CampaignDTO($data); 
            $dto->validate();
             
            $this->service->create($dto, $files);

            Response::json(["message" => "Campaña creada correctamente"], 201);

        } catch (Throwable $e) {
            Logger::error("Error crear Campaña | {$e->getMessage()}");
            Response::json(["error" => $e->getMessage()], 400);
        }
    }
    public function update(string $uuid): void
{
    try {
        $request = Request::form();
        $data = $request['data'];
        $files = $request['files'];

        $dto = new CampaignDTO($data);
        $dto->validate();

        $this->service->update($uuid, $dto, $files);

        Response::json([
            "message" => "Campaña actualizada correctamente"
        ], 200);

    } catch (Throwable $e) {
        Logger::error("Error editar Campaña | {$e->getMessage()}");
        Response::json([
            "error" => $e->getMessage()
        ], 400);
    }
}




}
