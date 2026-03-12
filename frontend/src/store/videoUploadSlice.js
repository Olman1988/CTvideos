import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  titulo: "",
  descripcion: "",
  categoria: "",
  centro: "",
  etiquetas: [],
  youtubeUrl: "",
  visibilidad: "publico",
  notificarCentro: true,
  permitirComentarios: true,
  destacarPerfil: false,
  students: []
};

const videoUploadSlice = createSlice({
  name: "videoUpload",
  initialState,
  reducers: {

    setVideoData: (state, action) => {
      Object.assign(state, action.payload);
    },

    setTitulo: (state, action) => {
      state.titulo = action.payload;
    },

    setDescripcion: (state, action) => {
      state.descripcion = action.payload;
    },

    setCategoria: (state, action) => {
      state.categoria = action.payload;
    },

    setCentro: (state, action) => {
      state.centro = action.payload;
    },

    setEtiquetas: (state, action) => {
      state.etiquetas = action.payload;
    },

    setYoutubeUrl: (state, action) => {
      state.youtubeUrl = action.payload;
    },

    setVisibilidad: (state, action) => {
      state.visibilidad = action.payload;
    },

    toggleNotificarCentro: (state) => {
      state.notificarCentro = !state.notificarCentro;
    },

    togglePermitirComentarios: (state) => {
      state.permitirComentarios = !state.permitirComentarios;
    },

    toggleDestacarPerfil: (state) => {
      state.destacarPerfil = !state.destacarPerfil;
    },
    setEstudiantes: (state, action) => {
      state.students = action.payload; // <--- nuevo reducer
    },

    resetVideo: () => initialState
  }
});

export const {
  setVideoData,
  setTitulo,
  setDescripcion,
  setCategoria,
  setCentro,
  setEtiquetas,
  setYoutubeUrl,
  setVisibilidad,
  toggleNotificarCentro,
  togglePermitirComentarios,
  toggleDestacarPerfil,
  setEstudiantes,
  resetVideo
} = videoUploadSlice.actions;

export default videoUploadSlice.reducer;