<?php

class CataloguesController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getEstados(): void
    {
        try {
            $sql = "
                SELECT 
                    *
                FROM estados_catalogos
                ORDER BY id ASC
            ";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $estados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            Response::json($estados, 200);

        } catch (Throwable $e) {

            Logger::error("Error al listar estados de catálogo ]{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
}
