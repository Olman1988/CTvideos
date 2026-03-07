<?php

class ImageUploadService
{
    private string $basePath = __DIR__ . '/../../public/uploads/';
    private string $publicPath = '/uploads/';

    public function upload(array $file): string
    {
        if (!isset($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
    $errMsg = match($file['error'] ?? 0) {
        UPLOAD_ERR_INI_SIZE => "Archivo excede el tamaño máximo del servidor",
        UPLOAD_ERR_FORM_SIZE => "Archivo excede el tamaño máximo del formulario",
        UPLOAD_ERR_PARTIAL => "Archivo subido parcialmente",
        UPLOAD_ERR_NO_FILE => "No se subió ningún archivo",
        UPLOAD_ERR_NO_TMP_DIR => "Falta carpeta temporal",
        UPLOAD_ERR_CANT_WRITE => "Error al escribir el archivo",
        UPLOAD_ERR_EXTENSION => "Subida bloqueada por extensión",
        default => "Archivo de imagen inválido"
    };
    throw new Exception($errMsg);
}

        $this->validateImage($file);

        if (!is_dir($this->basePath)) {
            mkdir($this->basePath, 0777, true);
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = Uuid::v4() . '.' . $extension;
        $destination = $this->basePath . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception("No se pudo guardar la imagen");
        }

        return $this->publicPath . '/' . $filename;
    }
    public function uploadFile(array $file, string $dir = 'default'): string
{
    if (!isset($file['tmp_name']) || (isset($file['error']) && $file['error']!== UPLOAD_ERR_OK)) {
        throw new Exception("Error al subir archivo: code {$file['error']}");
    }

    if (!is_uploaded_file($file['tmp_name'])) {
        throw new Exception("Archivo temporal no existe o no es válido");
    }

    $targetDir = $this->basePath . '/' . $dir;

    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = Uuid::v4() . '.' . $extension;
    $destination = $targetDir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        throw new Exception("No se pudo mover el archivo a $destination");
    }

    return $this->publicPath . '/' . $dir . '/' . $filename;
}

    public function delete(?string $path): void
    {
        if (!$path) return;

        $fullPath = __DIR__ . '/../../public' . $path;

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }

    private function validateImage(array $file): void
    {
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        $maxSize = 2 * 1024 * 1024; // 2MB

        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception("Tipo de imagen no permitido");
        }

        if ($file['size'] > $maxSize) {
            throw new Exception("La imagen supera el tamaño permitido");
        }
    }
}
