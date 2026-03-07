<?php
class AuthMiddleware {
    public function handle(){
        $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s(\S+)/', $hdr, $m)){
            $token = $m[1];
            $payload = JwtHelper::verify($token);
            if ($payload) {
                // inyectar user en global para controllers (ejemplo)
                $GLOBALS['auth_user'] = $payload;
                return true;
            }
        }
        return false;
    }
}
