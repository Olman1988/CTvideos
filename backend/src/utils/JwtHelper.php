<?php
// src/Utils/JwtHelper.php
class JwtHelper {
    private static $alg = 'HS256';
    private static $secret = 'your_super_secret_key_change_me';

    public static function generate($payload, $exp = 3600){
        $header = ['typ'=>'JWT','alg'=>self::$alg];
        $payload['iat'] = time();
        $payload['exp'] = time() + $exp;
        $b64 = function($data){ return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '='); };
        $header_enc = $b64($header);
        $payload_enc = $b64($payload);
        $signature = hash_hmac('sha256', "$header_enc.$payload_enc", self::$secret, true);
        $sig_enc = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
        return "$header_enc.$payload_enc.$sig_enc";
    }

    public static function verify($token){
        $parts = explode('.',$token);
        if(count($parts)!==3) return false;
        [$header_enc,$payload_enc,$sig_enc] = $parts;
        $signature = base64_decode(strtr($sig_enc, '-_', '+/'));
        $expected = hash_hmac('sha256', "$header_enc.$payload_enc", self::$secret, true);
        if (!hash_equals($expected, $signature)) return false;
        $payload = json_decode(base64_decode(strtr($payload_enc, '-_', '+/')), true);
        if (!$payload) return false;
        if (isset($payload['exp']) && time() > $payload['exp']) return false;
        return $payload;
    }
}
