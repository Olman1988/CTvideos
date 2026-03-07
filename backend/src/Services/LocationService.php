<?php
class LocationService {
    private $db;

    public function __construct() {
         $this->db = Database::getConnection();
    }
public function getProvincias() {
    $stmt = $this->db->prepare("EXEC getProvincias");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function getCantones($provinciaId) {
    $stmt = $this->db->prepare("EXEC getCantonesByProvincia @provinciaId = :provinciaId");
    $stmt->bindParam(":provinciaId", $provinciaId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

public function getDistritos($cantonId) {
    $stmt = $this->db->prepare("EXEC getDistritosByCanton @cantonId = :cantonId");
    $stmt->bindParam(":cantonId", $cantonId, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
}