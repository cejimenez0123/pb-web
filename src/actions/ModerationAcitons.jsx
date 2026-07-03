

// ----- THUNKS -----

import { createAsyncThunk } from "@reduxjs/toolkit";
import moderationRepo from "../data/moderationRepo";

const reportContent = createAsyncThunk(
  "moderation/reportContent",
  async ({ contentType, contentId, reportedProfileId, reason, reasonDetails }, { rejectWithValue }) => {
    try {
      const data = await moderationRepo.reportContent({
        contentType,
        contentId,
        reportedProfileId,
        reason,
        reasonDetails,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: error.message });
    }
  }
);

const blockProfile = createAsyncThunk(
  "moderation/blockProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.blockProfile(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const getBlockedProfiles = createAsyncThunk(
  "moderation/getBlockedProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.getBlockedProfiles();
      return res; // { blockedProfileIds: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const unblockProfile = createAsyncThunk(
  "moderation/unblockProfile",
  async (blockedProfileId, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.unblockProfile(blockedProfileId);
      return { blockedProfileId, ...res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);


// ----- THUNKS -----

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import moderationRepo from "../data/moderationRepo";

// const reportContent = createAsyncThunk(
//   "moderation/reportContent",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await moderationRepo.reportContent(payload);
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { error: err.message });
//     }
//   }
// );

// const blockProfile = createAsyncThunk(
//   "moderation/blockProfile",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await moderationRepo.blockProfile(payload);
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { error: err.message });
//     }
//   }
// );

// const getBlockedProfiles = createAsyncThunk(
//   "moderation/getBlockedProfiles",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await moderationRepo.getBlockedProfiles();
//       return res; // { blockedProfileIds: [...] }
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { error: err.message });
//     }
//   }
// );

// const unblockProfile = createAsyncThunk(
//   "moderation/unblockProfile",
//   async (blockedProfileId, { rejectWithValue }) => {
//     try {
//       const res = await moderationRepo.unblockProfile(blockedProfileId);
//       return { blockedProfileId, ...res };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { error: err.message });
//     }
//   }
// );

// ----- ADMIN MODERATION THUNKS -----

const getPendingReports = createAsyncThunk(
  "moderation/getPendingReports",
  async (_, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.getPendingReports();
      return res; // { reports: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const banUser = createAsyncThunk(
  "moderation/banUser",
  async ({ reportedProfileId, reportIds }, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.banUser({ reportedProfileId, reportIds });
      return { reportedProfileId, ...res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const dismissReports = createAsyncThunk(
  "moderation/dismissReports",
  async ({ reportIds }, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.dismissReports({ reportIds });
      return { reportIds, ...res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

export {
  reportContent,
  blockProfile,
  getBlockedProfiles,
  unblockProfile,
  getPendingReports,
  banUser,
  dismissReports,
};
