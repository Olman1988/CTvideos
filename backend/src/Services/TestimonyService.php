<?php

class TestimonyService
{
    private PDO $db;
    private ImageUploadService $imageService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->imageService = new ImageUploadService();
    }

    // ==========================================
    // Obtener por UUID
    // ==========================================
    public function getByUuid(string $uuid): array
    {
        try {
            $stmt = $this->db->prepare("EXEC sp_testimonios_get_by_uuid :uuid");
            $stmt->bindValue(':uuid', $uuid);
            $stmt->execute();

            $testimonio = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$testimonio) {
                throw new Exception("Testimonio no encontrado");
            }

            return $testimonio;

        } catch (PDOException $e) {
            Logger::error("Error al obtener testimonio: " . $e->getMessage());
            throw new Exception("No se pudo obtener el testimonio");
        }
    }

    // ==========================================
    // Obtener activos
    // ==========================================
    public function getAllActive(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_testimonios_get_all_active");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener testimonios activos: " . $e->getMessage());
            throw new Exception("No se pudo obtener los testimonios");
        }
    }

    // ==========================================
    // Obtener todos
    // ==========================================
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("EXEC sp_testimonios_get_all");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            Logger::error("Error al obtener testimonios: " . $e->getMessage());
            throw new Exception("No se pudo obtener los testimonios");
        }
    }

    // ==========================================
    // Crear
    // ==========================================
    public function create(TestimonyDTO $dto, array $files): string
    {
        try {
            $dto->validate();

            $imagenUrl = null;

            if (!empty($files['imagen'])) {
                $imagenUrl = $this->imageService->upload($files['imagen']);
            }

            $stmt = $this->db->prepare("
                EXEC sp_testimonios_insert
                    :nombre,
                    :mensaje,
                    :imagen,
                    :activo
            ");

            $stmt->execute([
                ':nombre' => $dto->nombre,
                ':mensaje' => $dto->mensaje,
                ':imagen' => $imagenUrl,
                ':activo' => $dto->activo ?? 1
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$result || !isset($result['testimonio_id'])) {
                throw new Exception("No se pudo crear el testimonio");
            }

            $testimonioId = (int)$result['testimonio_id'];
            $uuid = $result['uuid'];

            // ================= AUDITORÍA =================
            Audit::register(
                tabla: 'testimonios',
                registroId: $testimonioId,
                accion: 'CREATE',
                datosAnteriores: null,
                datosNuevos: [
                    'nombre' => $dto->nombre,
                    'mensaje' => $dto->mensaje,
                    'imagen' => $imagenUrl,
                    'activo' => $dto->activo ?? 1
                ],
                modulo: 14
            );

            Logger::info("Testimonio creado ({$uuid})");

            return $uuid;

        } catch (Exception $e) {
            Logger::error("Error al crear testimonio: " . $e->getMessage());
            throw new Exception("No se pudo crear el testimonio");
        }
    }

    // ==========================================
    // Actualizar
    // ==========================================
    public function update(string $uuid, TestimonyDTO $dto, array $files): void
    {
        try {
            $this->db->beginTransaction();

            // Obtener datos actuales
            $stmt = $this->db->prepare("EXEC sp_testimonios_get_by_uuid :uuid");
            $stmt->execute([':uuid' => $uuid]);
            $actual = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$actual) {
                throw new Exception("Testimonio no encontrado");
            }

            $imagenUrl = $actual['imagen'];

            if (!empty($files['imagen'])) {
                $imagenUrl = $this->imageService->upload($files['imagen']);
            }

            // Ejecutar update
            $stmt = $this->db->prepare("
                EXEC sp_testimonios_update
                    :uuid,
                    :nombre,
                    :mensaje,
                    :imagen,
                    :activo
            ");

            $stmt->execute([
                ':uuid' => $uuid,
                ':nombre' => $dto->nombre,
                ':mensaje' => $dto->mensaje,
                ':imagen' => $imagenUrl,
                ':activo' => $dto->activo
            ]);

            // ================= AUDITORÍA =================
            Audit::register(
                tabla: 'testimonios',
                registroId: (int)$actual['id'],
                accion: 'UPDATE',
                datosAnteriores: $actual,
                datosNuevos: [
                    'nombre' => $dto->nombre,
                    'mensaje' => $dto->mensaje,
                    'imagen' => $imagenUrl,
                    'activo' => $dto->activo
                ],
                modulo: 14
            );

            $this->db->commit();

            Logger::info("Testimonio actualizado ({$uuid})");

        } catch (Throwable $e) {
            $this->db->rollBack();
            Logger::error("Error actualizar testimonio: {$e->getMessage()}");
            throw new Exception("No se pudo actualizar el testimonio");
        }
    }

    // ==========================================
    // Soft Delete
    // ==========================================
    public function delete(string $uuid): void
    {
        try {
            // Obtener datos antes de eliminar
            $stmt = $this->db->prepare("EXEC sp_testimonios_get_by_uuid :uuid");
            $stmt->execute([':uuid' => $uuid]);
            $actual = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$actual) {
                throw new Exception("Testimonio no encontrado");
            }

            $stmt = $this->db->prepare("EXEC sp_testimonios_delete :uuid");
            $stmt->execute([':uuid' => $uuid]);

            // ================= AUDITORÍA =================
            Audit::register(
                tabla: 'testimonios',
                registroId: (int)$actual['id'],
                accion: 'DELETE',
                datosAnteriores: $actual,
                datosNuevos: null,
                modulo: 14
            );

            Logger::info("Testimonio eliminado ({$uuid})");

        } catch (PDOException $e) {
            Logger::error("Error eliminar testimonio: " . $e->getMessage());
            throw new Exception("No se pudo eliminar el testimonio");
        }
    }
}
