<?php

final class SliderDTO
{
    public ?string $titulo;
    public ?string $descripcion;
    public ?string $boton1Texto;
    public ?string $boton1Enlace;
    public ?string $boton2Texto;
    public ?string $boton2Enlace;
    public ?int $estadoId;
    public int $orden;

    public function __construct(array $input)
    {
        $this->titulo = isset($input['titulo']) && trim($input['titulo']) !== ''
            ? Sanitizer::string($input['titulo'])
            : null;

        $this->descripcion = isset($input['descripcion']) && trim($input['descripcion']) !== ''
            ? Sanitizer::string($input['descripcion'])
            : null;

        $this->boton1Texto = isset($input['enlace_1_texto']) && trim($input['enlace_1_texto']) !== ''
            ? Sanitizer::string($input['enlace_1_texto'])
            : null;

        $this->boton1Enlace = isset($input['enlace_1_url']) && trim($input['enlace_1_url']) !== ''
            ? Sanitizer::string($input['enlace_1_url'])
            : null;

        $this->boton2Texto = isset($input['enlace_2_texto']) && trim($input['enlace_2_texto']) !== ''
            ? Sanitizer::string($input['enlace_2_texto'])
            : null;

        $this->boton2Enlace = isset($input['enlace_2_url']) && trim($input['enlace_2_url']) !== ''
            ? Sanitizer::string($input['enlace_2_url'])
            : null;

        $this->estadoId = isset($input['estado_id']) && $input['estado_id'] !== ''
            ? Sanitizer::int($input['estado_id'])
            : null;

        $this->orden = isset($input['orden']) && $input['orden'] !== ''
            ? Sanitizer::int($input['orden'])
            : 0;
    }

    public function validate(): void
    {
        if (!$this->titulo || !$this->estadoId) {
            throw new Exception("Título y estado son obligatorios");
        }
    }
}
