<?php



class LocationsController {
    private $service;

    public function __construct() {
        $this->service = new LocationService(); 
    }

    public function getProvincias() {
        $provincias = $this->service->getProvincias();
        echo json_encode($provincias);
    }

    public function getCantones($provinciaId) {
        $cantones = $this->service->getCantones($provinciaId);
        echo json_encode($cantones);
    }

    public function getDistritos($cantonId) {
        $distritos = $this->service->getDistritos($cantonId);
        echo json_encode($distritos);
    }
}