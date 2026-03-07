<?php

class ProfilesController
{
    private PDO $db;
    private ProfileService $service;
    private UserService $userService;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->service = new ProfileService();
        $this->userService = new UserService();
    }
   public function createStudent(): void
    {
        try {
            $data = Request::json();

            // 🔹 Crear StudentDTO
            $dto = new StudentDTO($data);
            $dto->validate(); // valida estudiante y usuario si es requerido

            // 🔹 Crear estudiante en base de datos
            $studentId = $this->service->createStudent($dto);
            Logger::info("creado". $studentId);
            // 🔹 Crear usuario si es requerido
            if ($dto->usuarioRequerido && $dto->user instanceof UserDTO) {
                $dto->user->nombre= $dto->nombre." ".$dto->primerApellido." ".$dto->segundoApellido;
                Logger::info("user". json_encode($dto->user));
                // Si no se pasó contraseña, asignar default
                if (empty($dto->user->password)) {
                    $dto->user->password = "Admin+1234";
                    $dto->user->confirmpassword = "Admin+1234";
                }

                $this->userService->create($dto->user);
            }

            Response::json([
                'message' => 'Estudiante creado correctamente',
                'estudiante_id' => $studentId
            ], 201);

        } catch (Exception $e) {

            Logger::warning("Error crear estudiante | {$e->getMessage()}");

            Response::json([
                'error' => $e->getMessage()
            ], 400);

        } catch (Throwable $e) {

            Logger::error(
                "Error crear estudiante | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
            );

            Response::json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function createTutor(): void
    {
        try {
            $data = Request::json();

            $dto = new TutorDTO($data);

            $tutorId = $this->service->createTutor($dto);

            Response::json([
                'message' => 'Tutor creado correctamente',
                'estudiante_id' => $tutorId
            ], 201);

        } catch (Exception $e) {

            Logger::warning(
                "Error crear tutor | {$e->getMessage()}"
            );

            Response::json([
                'error' => $e->getMessage()
            ], 400);

        } catch (Throwable $e) {

            Logger::error(
                "Error crear tutor | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
            );

            Response::json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function getAllStudents(): void
    {
        Response::json(
            $this->service->getAllStudents(),
            200
        );
    }
    public function getAllActiveStudents(): void
    {
        Response::json(
            $this->service->getAllActiveStudents(),
            200
        );
    }
    public function getAllTutors(): void
    {
        Response::json(
            $this->service->getAllTutors(),
            200
        );

    }
    public function getAllGuardians(): void
    {
        Response::json(
            $this->service->getAllGuardians(),
            200
        );

    }
    public function getStudentByUuid(string $uuid): void
    {
        try {
            $student = $this->service->getStudentByUuid($uuid);
            Response::json($student, 200);
        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
    public function getTutorByUuid(string $uuid): void
    {
        try {
            $student = $this->service->getTutorByUuid($uuid);
            Response::json($student, 200);
        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    // PUT /students/{uuid}
    public function updateStudent(string $uuid): void
    {
        try {
            $data = Request::json();
            $data['uuid'] = $uuid;

            $dto = new StudentDTO($data);
            $this->service->updateStudent($dto);

            Response::json(['message' => 'Student updated successfully'], 200);
        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function updateTutor(string $uuid): void
    {
        try {
            $data = Request::json();
            $data['uuid'] = $uuid;

            $dto = new TutorDTO($data);
            $this->service->updateTutor($dto);

            Response::json(['message' => 'Tutor actualizado'], 200);
        } catch (Throwable $e) {
            Logger::error("Error crear Role | {$e->getMessage()}");
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    public function getAllRelationship(): void
    {
        Response::json(
            $this->service->getAllRelationship(),
            200
        );

    }
    public function createGuardian(): void
    {
        try {
            $data = Request::json();

            $dto = new GuardianDTO($data);

            $guardianId = $this->service->createGuardian($dto);

            Response::json([
                'message' => 'Encargado creado correctamente',
                'encargado' => $guardianId
            ], 201);

        } catch (Exception $e) {

            Logger::warning(
                "Error crear tutor | {$e->getMessage()}"
            );

            Response::json([
                'error' => $e->getMessage()
            ], 400);

        } catch (Throwable $e) {

            Logger::error(
                "Error crear tutor | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
            );

            Response::json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }
    public function getGuardianByUuid(string $uuid): void
    {
        try {
            $guardian = $this->service->getGuardianByUuid($uuid);
            Response::json($guardian);
        } catch (Throwable $e) {
            Logger::error(
                "Error crear tutor | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
            );
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }

    }

    public function updateGuardian(string $uuid): void
    {
        try {
            $data = Request::json();

            $dto = new GuardianDTO($data);
            $dto->uuid = $uuid;
            $guardianId = $this->service->updateGuardian($dto);

            Response::json($guardianId);
        } catch (Throwable $e) {
            Logger::error(
                "Error crear tutor | {$e->getMessage()} | {$e->getFile()} | {$e->getLine()}"
            );
            Response::json(['error' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }
}
