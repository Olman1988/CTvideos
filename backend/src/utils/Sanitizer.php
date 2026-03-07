<?php

class Sanitizer
{
    public static function string(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return trim(strip_tags($value));
    }

    public static function int($value): ?int
    {
        return filter_var($value, FILTER_VALIDATE_INT, [
            "options" => ["min_range" => 0]
        ]) ?: null;
    }

    public static function bool($value): int
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
    }
    public static function html(?string $value): ?string
{
    if (!$value) return null;

    // 1️⃣ Quitar etiquetas peligrosas completas
    $value = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $value);
    $value = preg_replace('#<iframe(.*?)>(.*?)</iframe>#is', '', $value);
    $value = preg_replace('#<object(.*?)>(.*?)</object>#is', '', $value);
    $value = preg_replace('#<embed(.*?)>(.*?)</embed>#is', '', $value);

    // 2️⃣ Permitir solo etiquetas seguras
    $allowedTags = '
        <p><br>
        <b><strong><i><em><u>
        <ul><ol><li>
        <blockquote><code>
        <h1><h2><h3><h4><h5><h6>
        <a>
        <img>
    ';

    $value = strip_tags($value, $allowedTags);

    // 3️⃣ Limpiar atributos peligrosos tipo onclick=, onerror= etc.
    $value = preg_replace('/on\w+="[^"]*"/i', '', $value);
    $value = preg_replace("/on\w+='[^']*'/i", '', $value);

    // 4️⃣ Bloquear javascript: en href o src
    $value = preg_replace('/(href|src)=["\']javascript:[^"\']*["\']/i', '', $value);

    return $value;
}
}
