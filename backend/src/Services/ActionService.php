<?php
class ActionService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }
    
    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_actions_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener acciones activas: " . $e->getMessage());
            throw new Exception("No se pudo obtener las acciones activas");
        }
    }

    
}



//getAllActive