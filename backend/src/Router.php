<?php
class Router {
    private $routes = [];

    public function add($method, $path, $handler, $middlewares = []) {
        $this->routes[] = compact('method','path','handler','middlewares');
    }

    public function get($path,$handler,$middlewares=[]){
        $this->add('GET',$path,$handler,$middlewares);
    }

    public function post($path,$handler,$middlewares=[]){
        $this->add('POST',$path,$handler,$middlewares);
    }

    public function delete($path,$handler,$middlewares=[]){
        $this->add('DELETE',$path,$handler,$middlewares);
    }

    public function dispatch(){
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // quitar prefijo /api SOLO si existe
        if (str_starts_with($uri, '/api')) {
            $uri = substr($uri, 4);
        }

        if ($uri === '') {
            $uri = '/';
        }


        // 🔥 LOG INMEDIATO
        $logFile = __DIR__ . '/debug_router.log';
        file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] $method $uri\n", FILE_APPEND);

        foreach($this->routes as $r){
            $pattern = preg_replace('#\{[a-zA-Z0-9_]+\}#','([a-zA-Z0-9_\-]+)',$r['path']);
            $pattern = "#^" . $pattern . "$#";

            if ($r['method'] === $method && preg_match($pattern, $uri, $matches)) {

                file_put_contents($logFile, "  ✔ Route match: {$r['path']}\n", FILE_APPEND);

                array_shift($matches);

                // Middlewares
                foreach($r['middlewares'] as $m){
                    $ok = $m->handle();

                    if (!$ok) {
                        file_put_contents($logFile, "  ✖ Middleware blocked\n", FILE_APPEND);

                        http_response_code(401);
                        echo json_encode(['error'=>'Unauthorized']);
                        return;
                    }
                }

                file_put_contents($logFile, "  → Executing handler\n", FILE_APPEND);

                call_user_func_array($r['handler'], $matches);
                return;
            }
        }

        file_put_contents($logFile, "  ✖ No route matched\n", FILE_APPEND);

        http_response_code(404);
        echo json_encode(['error'=>'Not found2']);
    }
}
