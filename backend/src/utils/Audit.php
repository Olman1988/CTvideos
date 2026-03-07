<?php


class Audit
{
    public static function register(
        string $tabla,
        int $registroId,
        string $accion,
        ?array $datosAnteriores = null,
        ?array $datosNuevos = null,
        ?string $modulo = null
    ): void {

        try {
            $db = Database::getConnection(); // 👈 PDO

            $accionesPermitidas = ['INSERT','UPDATE','DELETE','CREATE'];
            $accion = strtoupper($accion);

            if (!in_array($accion, $accionesPermitidas)) {
                throw new InvalidArgumentException('Acción no válida para auditoría');
            }

            $stmt = $db->prepare("
                INSERT INTO audit_logs
                (tabla, registro_id, accion, datos_anteriores, datos_nuevos, usuario, fecha, ip, modulo)
                VALUES
                (:tabla, :registro_id, :accion, :datos_anteriores, :datos_nuevos, :usuario, GETDATE(), :ip, :modulo)
            ");

            $stmt->execute([
                ':tabla' => $tabla,
                ':registro_id' => $registroId,
                ':accion' => $accion,
                ':datos_anteriores' => $datosAnteriores ? json_encode($datosAnteriores, JSON_UNESCAPED_UNICODE) : null,
                ':datos_nuevos' => $datosNuevos ? json_encode($datosNuevos, JSON_UNESCAPED_UNICODE) : null,
                ':usuario' => $_SESSION['usuario'] ?? 'sistema',
                ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
                ':modulo' => $modulo
            ]);

        } catch (Exception $e) {
            // 🔹 Registrar error en log sin detener la ejecución
            Logger::error("Error al registrar auditoría: " . $e->getMessage() . " | Tabla: {$tabla} | RegistroID: {$registroId}");
        }
    }
}

