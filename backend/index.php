<?php

define('ENV', 'development'); // cambiar a 'production' en servidor

if (ENV === 'development') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

if (ENV === 'development') {
    header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: false");
} 


// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}



define('APP_PATH', __DIR__ . '/src');

spl_autoload_register(function ($class) {

    $folders = [
        'Middlewares/',
        'utils/',
        'DTO/',
        'Services/',
        'Controllers/'
    ];

    foreach ($folders as $folder) {
        $file = APP_PATH . '/' . $folder . $class . '.php';

        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }

    // Opcional: log si no encuentra la clase
    // error_log("Autoload: clase $class no encontrada.");
});

// LOGGER
require_once APP_PATH . '/utils/Logger.php';

// ERRORES GLOBALES
set_error_handler(function ($severity, $message, $file, $line) {
    Logger::error("PHP Error: $message en $file:$line");
});
set_exception_handler(function ($exception) {
    Logger::error("Excepción no capturada: " . $exception->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "server error"]);
});
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error) {
        Logger::error("Fatal Error: {$error['message']} en {$error['file']}:{$error['line']}");
    }
});

// LOG DE REQUEST
Logger::info(json_encode([
    'method' => $_SERVER['REQUEST_METHOD'],
    'uri' => $_SERVER['REQUEST_URI'],
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'agent' => $_SERVER['HTTP_USER_AGENT'] ?? null
]));

// ARCHIVOS INDISPENSABLES
require_once APP_PATH . '/Config.php';
require_once APP_PATH . '/Database.php';
require_once APP_PATH . '/Router.php';
require_once APP_PATH . '/Request.php';
require_once APP_PATH . '/Response.php';

// ===============================
// CONFIG
// ===============================
Config::load(APP_PATH . '/appsettings.json');

// ===============================
// ROUTER
// ===============================
$router = new Router();

//PUBLIC SECTION
$router->get('/sliders/active', [new SlidersController(), 'getAllActive']);
$router->get('/categories/active', [new CategoriesController(), 'getAllActive']);
$router->get('/testimonies/active', [new TestimoniesController(), 'getAllActive']);


// Auth
$router->post('/auth/login', [new AuthController(), 'login']);

// Test protegido
$router->get('/test', function () {
    $user = $GLOBALS['auth_user'] ?? null;
    Response::json([
        'message' => 'Ruta protegida funcionando',
        'user' => $user
    ]);
}, [new AuthMiddleware()]);

// Usuarios
$router->get('/users/all', [new UsersController(), 'getAllUsers'], [new AuthMiddleware()]);
$router->post('/users/create', [new UsersController(), 'createUser']);
$router->get('/users/{uuid}', [new UsersController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/users/update/{uuid}', [new UsersController(), 'update'], [new AuthMiddleware()]);

// Roles
$router->get('/roles/all', [new RolesController(), 'getAllRoles'], [new AuthMiddleware()]);
$router->post('/roles/create', [new RolesController(), 'create'], [new AuthMiddleware()]);
$router->get('/roles/getRole/{uuid}', [new RolesController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/roles/update/{uuid}', [new RolesController(), 'update'], [new AuthMiddleware()]);

//Permisos
$router->get('/permission/all/{uuid}', [new PermissionsController(), 'getAllActive'], [new AuthMiddleware()]);
$router->post('/permission/update/{uuid}', [new PermissionsController(), 'updatePermissions'], [new AuthMiddleware()]);
$router->get('/permission/modules', [new PermissionsController(), 'getAllModules'], [new AuthMiddleware()]);

// Sliders
$router->get('/sliders/all', [new SlidersController(), 'getAll'], [new AuthMiddleware()]);
$router->get('/sliders/getSlider/{uuid}', [new SlidersController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/sliders/create', [new SlidersController(), 'create'], [new AuthMiddleware()]);
$router->post('/sliders/update/{uuid}', [new SlidersController(), 'update'], [new AuthMiddleware()]);
$router->post('/sliders/delete/{uuid}', [new SlidersController(), 'delete'], [new AuthMiddleware()]);

// Catálogos
$router->get('/catalogos/estados', [new CataloguesController(), 'getEstados'], [new AuthMiddleware()]);

// Categorías 
$router->get('/categories/all', [new CategoriesController(), 'getAll'], [new AuthMiddleware()]);
$router->get('/categories/getCategory/{uuid}', [new CategoriesController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/categories/create', [new CategoriesController(), 'create'], [new AuthMiddleware()]);
$router->post('/categories/update/{uuid}', [new CategoriesController(), 'update'], [new AuthMiddleware()]);
$router->post('/categories/delete/{uuid}', [new CategoriesController(), 'delete'], [new AuthMiddleware()]);
$router->get('/categories/active', [new CategoriesController(), 'getAllActive'],[new AuthMiddleware()]);

// Perfiles- Estudiantes
$router->get('/students/all', [new ProfilesController(), 'getAllStudents'], [new AuthMiddleware()]);
$router->post('/students/create', [new ProfilesController(), 'createStudent'], [new AuthMiddleware()]);
$router->get('/students/get/{uuid}', [new ProfilesController(), 'getStudentByUuid'], [new AuthMiddleware()]);
$router->post('/students/update/{uuid}', [new ProfilesController(), 'updateStudent'], [new AuthMiddleware()]);
$router->get('/students/active', [new ProfilesController(), 'getAllActiveStudents'], [new AuthMiddleware()]);


// Perfiles- Tutores
$router->get('/tutors/all', [new ProfilesController(), 'getAllTutors'], [new AuthMiddleware()]);
$router->post('/tutors/create', [new ProfilesController(), 'createTutor'], [new AuthMiddleware()]);
$router->get('/tutors/get/{uuid}', [new ProfilesController(), 'getTutorByUuid'], [new AuthMiddleware()]);
$router->post('/tutors/update/{uuid}', [new ProfilesController(), 'updateTutor'], [new AuthMiddleware()]);

// Perfiles- Tutores
$router->get('/guardians/all', [new ProfilesController(), 'getAllGuardians'], [new AuthMiddleware()]);
$router->post('/guardians/create', [new ProfilesController(), 'createGuardian'], [new AuthMiddleware()]);
$router->get('/guardians/getByUuid/{uuid}', [new ProfilesController(), 'getGuardianByUuid'], [new AuthMiddleware()]);
$router->post('/guardians/update/{uuid}', [new ProfilesController(), 'updateGuardian'], [new AuthMiddleware()]);


//Centros Educativos
$router->get('/centers/active', [new CentersController(), 'getAllActiveCenters'], [new AuthMiddleware()]);
$router->get('/centers/all', [new CentersController(), 'getAll'], [new AuthMiddleware()]);
$router->post('/centers/create', [new CentersController(), 'create'], [new AuthMiddleware()]);
$router->get('/centers/getByUuid/{uuid}', [new CentersController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/centers/update/{uuid}', [new CentersController(), 'update'], [new AuthMiddleware()]);
$router->post('/centers/delete/{uuid}', [new CentersController(), 'delete'], [new AuthMiddleware()]);



//Avatares
$router->get('/avatars/active', [new AvatarsController(), 'getAllActive'], [new AuthMiddleware()]);
$router->get('/avatars/all', [new AvatarsController(), 'getAll'], [new AuthMiddleware()]);
$router->post( '/avatars/create', [new AvatarsController(), 'create'], [new AuthMiddleware()] ); 
$router->get('/avatars/getByUuid/{uuid}', [new AvatarsController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post( '/avatars/update/{uuid}', [new AvatarsController(), 'update'], [new AuthMiddleware()] ); 


//Parentescos
$router->get('/relationship/all', [new ProfilesController(), 'getAllRelationship'], [new AuthMiddleware()]);
 
//Insignias
$router->get('/badges/all', [new BadgesController(), 'getAll'], [new AuthMiddleware()]);
$router->post('/badges/create', [new BadgesController(), 'create'], [new AuthMiddleware()]);
$router->get('/badges/getByUuid/{uuid}', [new BadgesController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/badges/update/{uuid}', [new BadgesController(), 'update'], [new AuthMiddleware()]);
$router->get('/badges/active',  [new BadgesController(), 'getAllActive'], [new AuthMiddleware()]);

//Campanas
$router->get('/campaigns/active', [new CampaignsController(), 'getAllActive'], [new AuthMiddleware()]);
$router->get('/campaigns/all', [new CampaignsController(), 'getAll'], [new AuthMiddleware()]);
$router->get('/campaigns-status/all', [new CampaignsController(), 'getAllStatus'], [new AuthMiddleware()]);
$router->post('/campaigns/create', [new CampaignsController(), 'create'], [new AuthMiddleware()]);
$router->get('/campaigns/getByUuid/{uuid}', [new CampaignsController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/campaigns/update/{uuid}', [new CampaignsController(), 'update'], [new AuthMiddleware()]);
 
//trivias
$router->get('/trivias/active', [new TriviasController(), 'getAllActive'], [new AuthMiddleware()]);
$router->get('/trivias/all', [new TriviasController(), 'getAll'], [new AuthMiddleware()]);
$router->get('/trivias-status/all', [new TriviasController(), 'getAllStatus'], [new AuthMiddleware()]);
$router->post('/trivias/create', [new TriviasController(), 'create'], [new AuthMiddleware()]);
$router->get('/trivias/getByUuid/{uuid}', [new TriviasController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/trivias/update/{uuid}', [new TriviasController(), 'update'], [new AuthMiddleware()]);

//Acciones
$router->get('/actions/active', [new ActionsController(), 'getAllActive'], [new AuthMiddleware()]);

// Testimonios 
$router->get( '/testimonies/all', [new TestimoniesController(), 'getAll'], [new AuthMiddleware()] ); 
$router->get( '/testimonies/getTestimony/{uuid}', [new TestimoniesController(), 'getByUuid'], [new AuthMiddleware()] ); 
$router->post( '/testimonies/create', [new TestimoniesController(), 'create'], [new AuthMiddleware()] ); 
$router->post( '/testimonies/update/{uuid}', [new TestimoniesController(), 'update'], [new AuthMiddleware()] ); 
$router->delete( '/testimonies/delete/{uuid}', [new TestimoniesController(), 'delete'], [new AuthMiddleware()] );

// Emociones 
$router->get( '/emotions/all', [new EmotionsController(), 'getAll'], [new AuthMiddleware()] ); 
$router->get('/emotions/active', [new EmotionsController(), 'getAllActive'], [new AuthMiddleware()]);
$router->get( '/emotions/getEmotion/{uuid}', [new EmotionsController(), 'getByUuid'], [new AuthMiddleware()] ); 
$router->post( '/emotions/create', [new EmotionsController(), 'create'], [new AuthMiddleware()] ); 
$router->post( '/emotions/update/{uuid}', [new EmotionsController(), 'update'], [new AuthMiddleware()] ); 
$router->delete( '/emotions/delete/{uuid}', [new EmotionsController(), 'delete'], [new AuthMiddleware()] );

//Contenidos
$router->get( '/content-status/active', [new ContentsController(), 'getAllActiveStatus'], [new AuthMiddleware()] ); 
$router->get( '/content-approaches/active', [new ContentsController(), 'getAllActiveApproaches'], [new AuthMiddleware()] ); 
$router->get( '/content-types/active', [new ContentsController(), 'getAllActiveTypes'], [new AuthMiddleware()] ); 
$router->get( '/content-ageRanges/active',  [new ContentsController(), 'getAllActiveAgeRanges'], [new AuthMiddleware()] ); 
$router->get( '/content-context/active',  [new ContentsController(), 'getAllActiveContext'], [new AuthMiddleware()] ); 
$router->get(  '/content-tags/active',  [new ContentsController(), 'getAllActiveTags'], [new AuthMiddleware()] ); 
$router->post( '/contents/create', [new ContentsController(), 'create'], [new AuthMiddleware()] ); 
$router->get(  '/contents/all',  [new ContentsController(), 'getAll'], [new AuthMiddleware()] ); 
$router->get( '/contents/get/{uuid}', [new ContentsController(), 'getByUuid'], [new AuthMiddleware()] ); 
$router->post( '/contents/update/{uuid}', [new ContentsController(), 'update'], [new AuthMiddleware()] ); 


// Backgrounds
$router->get('/backgrounds/active', [new BackgroundsController(), 'getAllActive'], [new AuthMiddleware()]);
$router->get('/backgrounds/all', [new BackgroundsController(), 'getAll'], [new AuthMiddleware()]);
$router->post('/backgrounds/create', [new BackgroundsController(), 'create'], [new AuthMiddleware()]);
$router->get('/backgrounds/getByUuid/{uuid}', [new BackgroundsController(), 'getByUuid'], [new AuthMiddleware()]);
$router->post('/backgrounds/update/{uuid}', [new BackgroundsController(), 'update'], [new AuthMiddleware()]);


//Locations 

$router->get('/provincias/all', [new LocationsController(), 'getProvincias']);
$router->get('/cantones/byProvincia/{id}', [new LocationsController(), 'getCantones']);
$router->get('/distritos/byCanton/{id}', [new LocationsController(), 'getDistritos']);
// ===============================
// DISPATCH
// ===============================
$router->dispatch();