<?php

class Auth
{
    private static ?object $user = null;

    public static function user(): ?object
    {
        if (self::$user !== null) {
            return self::$user;
        }

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? null;

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authHeader);

        $payload = JwtHelper::verify($token);

        if (!$payload) {
            return null;
        }

        // Convertimos el array en objeto
        self::$user = (object) $payload;

        return self::$user;
    }

    public static function id(): ?int
    {
        return self::user()->id ?? null;
    }

    public static function email(): ?string
    {
        return self::user()->email ?? null;
    }

    public static function name(): ?string
    {
        return self::user()->nombre ?? null;
    }

    public static function roles(): array
    {
        return self::user()->roles ?? [];
    }

    public static function permisos(): array
    {
        return self::user()->permisos ?? [];
    }

    public static function check(string $permiso): bool
    {
        return in_array($permiso, self::permisos());
    }
}