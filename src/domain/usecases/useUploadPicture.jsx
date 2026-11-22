
import { createAsyncThunk } from "@reduxjs/toolkit";
import photoRepo from "../../data/photoRepo";


export const uploadPhoto = createAsyncThunk(
  "photo/uploadPhoto",
  async ({ file, purpose = "general" }, thunkApi) => {
    try {
      if (!file) {
        throw new Error("No image was provided.");
      }

      const result = await photoRepo.uploadPhoto({
        file,
        purpose,
      });

      console.log("[uploadPhoto] Repository result:", result);

      return result;
    } catch (error) {
      console.error("[uploadPhoto] Failed:", error);

      return thunkApi.rejectWithValue({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to upload image.",
      });
    }
  }
);
export const associatePhotoWithStory = createAsyncThunk(
  "photo/associatePhotoWithStory",
  async ({ photoId, storyId }, thunkApi) => {
    try {
      return await photoRepo.associatePhotoWithStory({
        photoId,
        storyId,
      });
    } catch (error) {
      return thunkApi.rejectWithValue({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to associate photo with Story.",
      });
    }
  }
);
export const getPhoto = createAsyncThunk(
  "photo/getPhoto",
  async ({ id }, thunkApi) => {
    try {
      if (!id) {
        throw new Error("Photo ID is required.");
      }

      const blob = await photoRepo.getPhoto({ id });

      return { id, blob };
    } catch (error) {
      return thunkApi.rejectWithValue({
        id,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to retrieve image.",
      });
    }
  }
);
