<?php
class PermissionsController{

private $service;

public function __construct(){
    $this->service = new PermissionService();
}
public function getAllModules(){
    Response::json(
            $this->service->getAllModules(),
            200
        );

}
public function getAllActive(string $uuid): void
{
   $Data = [];

try {
    $AllActive = $this->service->getAllActive();
    $AllPermission = $this->service->getAllPermission($uuid);

    // Asegurar que AllPermission sea array de arrays
    if (isset($AllPermission['permiso_id'])) {
        $AllPermission = [$AllPermission];
    }
    $AllPermission = array_map(function($item){
        return is_array($item) ? $item : (array)$item;
    }, $AllPermission);

    foreach ($AllActive as $Permission) {
        $perm = $Permission;
        $perm['active'] = false;

        foreach ($AllPermission as $value) {
            if ((int)$Permission['id'] == (int)$value['permiso_id']) {
                $perm['active'] = true;
                break; // ya encontrado
            }
        }

        $Data[] = $perm;
    }

    Response::json($Data, 200);

} catch (\Throwable $e) {
    Logger::error("Error al obtener permisos: " . $e->getMessage());
    Response::json(["error" => "No se pudieron obtener los permisos"], 500);
}


}

public function updatePermissions(string $uuid): void
{
    try {
        $request = Request::json();
        $permissionsData = $request['permissions'] ?? [];

        if (empty($permissionsData)) {
            throw new Exception("No se recibieron permisos para actualizar");
        }

        // Validación básica
        foreach ($permissionsData as $perm) {
            if (!isset($perm['id']) || !isset($perm['active'])) {
                throw new Exception("Formato de permisos inválido");
            }
        }

        // 🔹 Llamada al service con procedure
        $this->service->updatePermissions($uuid, $permissionsData);

        Response::json(["message" => "Permisos actualizados correctamente"], 200);

    } catch (Throwable $e) {
        Logger::error("Error actualizar permisos | {$e->getMessage()}");
        Response::json(["error" => $e->getMessage()], 400);
    }
}

}
