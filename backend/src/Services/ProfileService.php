<?php

class ProfileService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }
    public function createTutor(TutorDTO $dto): int
    {
        $dto->validate();

        $uuid = Uuid::v4();
        $centrosJson = json_encode($dto->centrosEducativos); 

        $stmt = $this->db->prepare("
            EXEC sp_create_new_tutor
                @uuid = :uuid,
                @nombre = :nombre,
                @primer_apellido = :primer_apellido,
                @segundo_apellido = :segundo_apellido,
                @estado_id = :estado_id,
                @centros_json = :centros_json
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':primer_apellido', $dto->primerApellido);
        $stmt->bindValue(':segundo_apellido', $dto->segundoApellido, $dto->segundoApellido ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':centros_json', $centrosJson);

        Logger::info("EXEC sp_create_new_tutor uuid={$uuid}");

        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }
    public function createGuardian(GuardianDTO $dto): int
    {
        $dto->validate();

        $uuid = Uuid::v4();
        $estudiantesJson = json_encode($dto->estudiantes); // [{"estudiante_id":4,"parentesco_id":2}, ...]

        $stmt = $this->db->prepare("
        EXEC sp_create_guardian
            @uuid = :uuid,
            @nombre = :nombre,
            @primer_apellido = :primer_apellido,
            @segundo_apellido = :segundo_apellido,
            @dni = :dni,
            @telefono = :telefono,
            @email = :email,
            @estado_id = :estado_id,
            @estudiantes_json = :estudiantes_json
    ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':primer_apellido', $dto->primerApellido);
        $stmt->bindValue(':segundo_apellido', $dto->segundoApellido ?: null, $dto->segundoApellido ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':dni', $dto->dni);
        $stmt->bindValue(':telefono', $dto->telefono ?: null, $dto->telefono ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':email', $dto->email ?: null, $dto->email ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':estudiantes_json', $estudiantesJson, PDO::PARAM_STR);

        $stmt->execute();

        return (int) $stmt->fetchColumn(); // devuelve guardian_id
    }


    public function createStudent(StudentDTO $dto): int
    {
        $dto->validate();

        $uuid = Uuid::v4();
        $centrosJson = json_encode($dto->centrosEducativos);

        $stmt = $this->db->prepare("
            EXEC sp_create_student
                @uuid = :uuid,
                @nombre = :nombre,
                @primer_apellido = :primer_apellido,
                @segundo_apellido = :segundo_apellido,
                @alias = :alias,
                @estado_id = :estado_id,
                @avatar_id = :avatar_id,
                @fecha_nacimiento = :fecha_nacimiento,
                @centros_json = :centros_json
        ");

        $stmt->bindValue(':uuid', $uuid);
        $stmt->bindValue(':nombre', $dto->nombre);
        $stmt->bindValue(':primer_apellido', $dto->primerApellido);
        $stmt->bindValue(':segundo_apellido', $dto->segundoApellido, $dto->segundoApellido ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':alias', $dto->alias, $dto->alias ? PDO::PARAM_STR : PDO::PARAM_NULL);
        $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
        $stmt->bindValue(':avatar_id', $dto->avatarId, $dto->avatarId ? PDO::PARAM_INT : PDO::PARAM_NULL);
        $stmt->bindValue(':fecha_nacimiento', $dto->fechaNacimiento);
        $stmt->bindValue(':centros_json', $centrosJson);

        Logger::info("EXEC sp_create_student uuid={$uuid}");

        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }
    public function getAllStudents()
    {
        try {
            $sql = "EXEC sp_students_list";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar estudiantes |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }

    public function getAllActiveStudents()
    {
        try {
            $sql = "EXEC sp_students_list_active";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar estudiantes |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }
    public function getStudentByUuid(string $uuid): array
    {
        $stmt = $this->db->prepare("EXEC sp_students_get_by_uuid :uuid");
        $stmt->execute(['uuid' => $uuid]);

        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {
            throw new Exception('Student not found', 404);
        }

        $student['educational_center_ids'] = $student['educational_center_ids']
            ? explode(',', $student['educational_center_ids'])
            : [];

        return $student;
    }

    public function getTutorByUuid(string $uuid): array
    {
        $stmt = $this->db->prepare("EXEC sp_tutor_get_by_uuid :uuid");
        $stmt->execute(['uuid' => $uuid]);

        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$student) {
            throw new Exception('Student not found', 404);
        }

        $student['educational_center_ids'] = $student['educational_center_ids']
            ? explode(',', $student['educational_center_ids'])
            : [];

        return $student;
    }

    public function updateStudent(StudentDTO $dto): void
    {
        $dto->validate();

        $centers = implode(',', $dto->centrosEducativos);


        $stmt = $this->db->prepare("
            EXEC sp_students_update
                :uuid,
                :nombre,
                :primer_apellido,
                :segundo_apellido,
                :alias,
                :fecha_nacimiento,
                :estado_id,
                :avatar_id,
                :centros
        ");

        $stmt->execute([
            'uuid' => $dto->uuid,
            'nombre' => $dto->nombre,
            'primer_apellido' => $dto->primerApellido,
            'segundo_apellido' => $dto->segundoApellido,
            'alias' => $dto->alias,
            'fecha_nacimiento' => $dto->fechaNacimiento,
            'estado_id' => $dto->estadoId,
            'avatar_id' => $dto->avatarId,
            'centros' => $centers
        ]);
    }

    public function updateTutor(TutorDTO $dto): void
    {
        $dto->validate();

        $centrosJson = json_encode($dto->centrosEducativos);
        try {
            $stmt = $this->db->prepare("
            EXEC sp_update_tutor
                :uuid,
                :nombre,
                :primer_apellido,
                :segundo_apellido,
                :estado_id,
                :centros
        ");

            $resp = $stmt->execute([
                'uuid' => $dto->uuid,
                'nombre' => $dto->nombre,
                'primer_apellido' => $dto->primerApellido,
                'segundo_apellido' => $dto->segundoApellido,
                'estado_id' => $dto->estadoId,
                'centros' => $centrosJson
            ]);

        } catch (Throwable $e) {

            Logger::error("Error al listar tutores |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }

    public function getAllTutors()
    {
        try {
            $sql = "EXEC sp_GetTutores";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar tutores |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }

    public function getAllGuardians()
    {
        try {
            $sql = "EXEC sp_get_encargados";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar tutores |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }
    }

    public function getAllRelationship()
    {
        try {
            $sql = "EXEC sp_get_relationship";

            $stmt = $this->db->prepare($sql);
            $stmt->execute();

            $roles = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // ✅ ORDEN CORRECTO
            return $roles;

        } catch (Throwable $e) {

            Logger::error("Error al listar tutores |{$e->getMessage()}");

            Response::json([
                "error" => "Error interno del servidor"
            ], 500);
        }

    }

    public function getGuardianByUuid(string $uuid): array
    {
        // 1️⃣ Preparar y ejecutar el procedimiento
        $stmt = $this->db->prepare("EXEC sp_get_guardian_by_uuid :uuid");
        $stmt->execute(['uuid' => $uuid]);

        // 2️⃣ Obtener el resultado
        $guardian = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$guardian) {
            throw new Exception('Encargado no encontrado', 404);
        }

        // 3️⃣ Convertir estudiantes_json de string a array
        $guardian['estudiantes'] = $guardian['estudiantes_json']
            ? json_decode($guardian['estudiantes_json'], true)
            : [];

        unset($guardian['estudiantes_json']);

        return $guardian;
    }
    public function updateGuardian(GuardianDTO $dto): bool
    {
        try {

            $dto->validate();
            Logger::error("datos:" . json_encode($dto));
            $estudiantesJson = json_encode($dto->estudiantes);

            $stmt = $this->db->prepare("
        EXEC sp_update_guardian
            @uuid = :uuid,
            @nombre = :nombre,
            @primer_apellido = :primer_apellido,
            @segundo_apellido = :segundo_apellido,
            @dni = :dni,
            @telefono = :telefono,
            @email = :email,
            @estado_id = :estado_id,
            @estudiantes_json = :estudiantes_json
    ");

            $stmt->bindValue(':uuid', $dto->uuid);
            $stmt->bindValue(':nombre', $dto->nombre);
            $stmt->bindValue(':primer_apellido', $dto->primerApellido);

            $stmt->bindValue(
                ':segundo_apellido',
                $dto->segundoApellido ?: null,
                $dto->segundoApellido ? PDO::PARAM_STR : PDO::PARAM_NULL
            );

            $stmt->bindValue(':dni', $dto->dni);

            $stmt->bindValue(
                ':telefono',
                $dto->telefono ?: null,
                $dto->telefono ? PDO::PARAM_STR : PDO::PARAM_NULL
            );

            $stmt->bindValue(
                ':email',
                $dto->email ?: null,
                $dto->email ? PDO::PARAM_STR : PDO::PARAM_NULL
            );

            $stmt->bindValue(':estado_id', $dto->estadoId, PDO::PARAM_INT);
            $stmt->bindValue(':estudiantes_json', $estudiantesJson, PDO::PARAM_STR);

            return $stmt->execute();
        } catch (Throwable $e) {

            Logger::error("Error al actualizar encargado |{$e->getMessage()}");

            return false;
        }
    }



}
