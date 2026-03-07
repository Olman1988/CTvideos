<?php

class Logger
{
    private static string $logFile = __DIR__ . '/../logs/app.log';

    private static function write(string $level, string $message): void
    {
        $date = date('Y-m-d H:i:s');
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'CLI';

        $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
        $caller = $trace[1] ?? [];

        $file = $caller['file'] ?? 'unknown file';
        $lineNumber = $caller['line'] ?? 'unknown line';
        $function = $caller['function'] ?? '';
        $class = $caller['class'] ?? '';

        $location = "$file:$lineNumber";
        if ($class || $function) {
            $location .= " ($class::$function)";
        }

        $line = "[$date] [$level] [$ip] [$location] $message" . PHP_EOL;

        file_put_contents(self::$logFile, $line, FILE_APPEND | LOCK_EX);
    }

    public static function info(string $message): void
    {
        self::write('INFO', $message);
    }

    public static function warning(string $message): void
    {
        self::write('WARNING', $message);
    }

    public static function error(string $message): void
    {
        self::write('ERROR', $message);
    }
}

