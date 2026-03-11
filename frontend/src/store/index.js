import { configureStore } from "@reduxjs/toolkit";
import videoUploadReducer from "./videoUploadSlice";

export const store = configureStore({
  reducer: {
    videoUpload: videoUploadReducer,
  },
});