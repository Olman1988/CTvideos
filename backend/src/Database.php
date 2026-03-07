<?php
class Database
{
    private static ?PDO $db = null;

    public static function getConnection(): PDO
    {
        if (self::$db === null) {
            $server = Config::get('Database.Server');
            $dbname = Config::get('Database.Name');
            $user   = Config::get('Database.User');
            $pass   = Config::get('Database.Password');

            $dsn = "sqlsrv:Server=$server;Database=$dbname";

            self::$db = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        }

        return self::$db;
    }
}
