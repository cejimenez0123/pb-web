import { createAsyncThunk } from "@reduxjs/toolkit";
import authRepo from "../data/authRepo";

export const reportContent = createAsyncThunk(
  "moderation/reportContent",
  async ({ contentType, contentId, reportedProfileId, reason }, { rejectWithValue }) => {
    try {
      const data = await authRepo.reportContent({ contentType, contentId, reportedProfileId, reason });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

export const blockProfile = createAsyncThunk(
  "moderation/blockProfile",
  async ({ blockedProfileId, reason }, { rejectWithValue }) => {
    try {
      const data = await authRepo.blockProfile({ blockedProfileId, reason });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);
