<?php


class ActionsController
{
    private ActionService $service;
    public function __construct(
        
    ) {

    $this->service = new ActionService();
    }


    public function getAllActive(): void
    {
        Response::json(
            $this->service->getAllActive(),
            200
        );
    }



}
