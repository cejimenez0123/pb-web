

// ----- THUNKS -----

import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
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
        console.log(err)
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const removeContentByProfileId = createAction(
  "moderation/removeContentByProfileId"
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
  async ({ reportedProfileId, reportIds ,blockIds}, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.banUser({ reportedProfileId, reportIds,blockIds  });
      return { reportedProfileId, ...res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);
 const fetchBlockedProfiles = createAsyncThunk(
  "moderation/fetchBlockedProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await moderationRepo.getBlockedProfiles();
      // data = { blockedProfiles: [{ id, username, profilePic }, ...] }
      return {
        blockedProfiles: data.blockedProfiles || [],
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.error || "Failed to load blocked users"
      );
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
const getBlockEvents = createAsyncThunk(
  "moderation/getBlockEvents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.getBlockEvents();
      return res; // { events: [...] }
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);

const acknowledgeBlockEvent = createAsyncThunk(
  "moderation/acknowledgeBlockEvent",
  async ({ eventId }, { rejectWithValue }) => {
    try {
      const res = await moderationRepo.acknowledgeBlockEvent({ eventId });
      return { eventId, ...res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { error: err.message });
    }
  }
);
export {
    acknowledgeBlockEvent,
    getBlockEvents,
  reportContent,
  blockProfile,

  unblockProfile,
  getPendingReports,
  banUser,
  dismissReports,
fetchBlockedProfiles,
removeContentByProfileId
};
