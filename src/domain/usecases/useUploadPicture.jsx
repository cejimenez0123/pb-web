
import { createAsyncThunk } from "@reduxjs/toolkit";
import photoRepo from "../../data/photoRepo";


export const uploadPhoto = createAsyncThunk(
  "photo/uploadPhoto",
  async ({ file, profileId, storyId, purpose = "general" }, thunkApi) => {
    try {
      if (!file) {
        throw new Error("No image was provided.");
      }

      if (!profileId) {
        throw new Error("Profile ID is required.");
      }

      return await photoRepo.uploadPhoto({
        file,
        storyId,
        profileId,
        purpose,
      });
    } catch (error) {
      return thunkApi.rejectWithValue({
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to upload image.",
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
