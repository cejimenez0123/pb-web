

import { createAsyncThunk } from "@reduxjs/toolkit";
import followRepo from "../data/followRepo";

const createFollow = createAsyncThunk(
  "follow/createFollow",
  async ({ follower, following }, { rejectWithValue }) => {
    try {
     console.log("[createFollow] Calling repository");
console.log(follower,following)
const data = await followRepo.create({ follower, following });

console.log("[createFollow] Repository returned:", data);

      if (data?.error || !data?.follow) {
        return rejectWithValue(
          data?.error?.message || "Unable to create follow."
        );
      }

      return { follow: data.follow };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to create follow."
      );
    }
  }
);

const deleteFollow = createAsyncThunk(
  "follow/deleteFollow",
  async ({ follow }, { rejectWithValue }) => {
    try {
      const data = await followRepo.delete({ id: follow.id });

      if (data?.error) {
        return rejectWithValue(
          data.error?.message || "Unable to delete follow."
        );
      }

      return {
        profile: data.profile,
        followed: data.followed,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to delete follow."
      );
    }
  }
);

export { deleteFollow, createFollow };