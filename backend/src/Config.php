<?php

class Config
{
    private static array $config = [];
    private static bool $loaded = false;

    public static function load(string $path = 'appsettings.json'): void
    {
        if (!file_exists($path)) {
            throw new Exception("Archivo de configuración no encontrado: $path");
        }

        $json = file_get_contents($path);

        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Error parseando JSON: " . json_last_error_msg());
        }

        self::$config = $data;
        self::$loaded = true;
    }

    public static function get(string $key, $default = null)
    {
        if (!self::$loaded) {
            throw new Exception("Config no ha sido cargado. Debes llamar Config::load()");
        }

        $parts = explode('.', $key);
        $value = self::$config;

        foreach ($parts as $part) {
            if (!is_array($value) || !array_key_exists($part, $value)) {
                return $default;
            }
            $value = $value[$part];
        }

        return $value;
    }
}