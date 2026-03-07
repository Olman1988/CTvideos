<?php

final class TriviaDTO
{
    public ?string $uuid;
    public ?string $trivia;
    public ?string $descripcion;
    public ?int $estadoId;
    public ?string $imagen;

    /**
     * Estructura esperada:
     * [
     *   {
     *     "pregunta": "Texto pregunta",
     *     "orden": 1,
     *     "respuestas": [
     *          { "respuesta": "Opción A", "es_correcta": 0 },
     *          { "respuesta": "Opción B", "es_correcta": 1 }
     *     ]
     *   }
     * ]
     */
    public array $preguntas = [];

    public function __construct(array $input)
    {
        $this->uuid = $input['uuid'] ?? null;

        $this->trivia = isset($input['trivia']) && trim($input['trivia']) !== ''
            ? Sanitizer::string($input['trivia'])
            : null;

        $this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->estadoId = isset($input['estado_id']) && $input['estado_id'] !== ''
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->imagen = isset($input['imagen']) && trim($input['imagen']) !== ''
            ? Sanitizer::string($input['imagen'])
            : null;

        // Procesar preguntas
        if (!empty($input['preguntas'])) {

            $preguntas = is_string($input['preguntas'])
                ? json_decode($input['preguntas'], true)
                : $input['preguntas'];

            if (is_array($preguntas)) {

                foreach ($preguntas as $index => $pregunta) {

                    if (!isset($pregunta['pregunta']) || trim($pregunta['pregunta']) === '') {
                        continue;
                    }

                    $respuestasFormateadas = [];

                    if (!empty($pregunta['respuestas']) && is_array($pregunta['respuestas'])) {

                        foreach ($pregunta['respuestas'] as $respuesta) {

                            if (!isset($respuesta['respuesta']) || trim($respuesta['respuesta']) === '') {
                                continue;
                            }

                            $respuestasFormateadas[] = [
                                'respuesta'   => Sanitizer::string($respuesta['respuesta']),
                                'es_correcta' => isset($respuesta['es_correcta']) 
                                    ? (int)$respuesta['es_correcta'] 
                                    : 0
                            ];
                        }
                    }

                    $this->preguntas[] = [
                        'pregunta'   => Sanitizer::string($pregunta['pregunta']),
                        'orden'      => isset($pregunta['orden']) 
                            ? (int)$pregunta['orden'] 
                            : $index + 1,
                        'respuestas' => $respuestasFormateadas
                    ];
                }
            }
        }
    }

    public function validate(): void
    {
        $errors = [];

        if (!$this->trivia) {
            $errors[] = 'El nombre de la trivia es obligatorio';
        }

        if (!$this->estadoId) {
            $errors[] = 'El estado de la trivia es obligatorio';
        }

        if (empty($this->preguntas)) {
            $errors[] = 'La trivia debe tener al menos una pregunta';
        }

        foreach ($this->preguntas as $index => $pregunta) {

            if (empty($pregunta['respuestas'])) {
                $errors[] = "La pregunta " . ($index + 1) . " debe tener respuestas";
                continue;
            }

            $correctas = array_filter(
                $pregunta['respuestas'],
                fn($r) => $r['es_correcta'] == 1
            );

            if (count($correctas) !== 1) {
                $errors[] = "La pregunta " . ($index + 1) . " debe tener exactamente una respuesta correcta";
            }
        }

        if ($errors) {
            throw new Exception(implode(', ', $errors));
        }
    }
}
