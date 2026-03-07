<?php
final class UserService
{
    private PDO $db;
    public function __construct(){
    $this->db = Database::getConnection(); 
    }
    public function create(UserDTO $userDTO): int
    {
        
        $uuid = Uuid::v4();
        $userDTO->validate();
        $passwordHash = password_hash($userDTO->password, PASSWORD_BCRYPT);

        // Preparar el Stored Procedure
        $stmt = $this->db->prepare("
            EXEC sp_usuario_crear
                :uuid,
                :nombre,
                :correo,
                :password,
                :estado_id
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $userDTO->nombre);
        $stmt->bindValue(':correo', $userDTO->correo);
        $stmt->bindValue(':password', $passwordHash);
        $stmt->bindValue(':estado_id', $userDTO->estadoId ?? 1, PDO::PARAM_INT);

        $stmt->execute();

        // Retornar el ID insertado
        return (int)$stmt->fetchColumn();
    }
}