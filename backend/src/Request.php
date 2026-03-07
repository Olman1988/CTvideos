<?php

class Request
{
    /**
     * Devuelve los datos enviados en JSON
     * @return array
     * @throws Exception si el JSON es inválido
     */
    public static function json(): array
    {
        $input = file_get_contents('php://input');

        if (!$input) {
            Logger::info('Request::json() sin body JSON (posible multipart/form-data)');
            return [];
        }

        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Logger::error('Request::json() JSON inválido: ' . json_last_error_msg() .
                ' | Raw: ' . substr($input, 0, 500));
            throw new Exception('JSON inválido');
        }

        Logger::info('Request::json() cargado correctamente'.$input);
        return $data;
    }

    /**
     * Devuelve los datos de POST y archivos (multipart/form-data)
     * @return array
     */
    public static function form(): array
    {
        $data = $_POST ?? [];
        $files = $_FILES ?? [];
                Logger::info('Request . ' .json_encode($_FILES));
Logger::info('Request post . ' .json_encode($_POST));
if (isset($data['existingFiles']) && is_string($data['existingFiles'])) {
    $data['existingFiles'] = json_decode($data['existingFiles'], true) ?? [];
}
        Logger::info('Request::form() cargado con ' . count($data) . ' campos y ' . count($files) . ' archivos');

        return ['data' => $data, 'files' => $files];
    }
}
