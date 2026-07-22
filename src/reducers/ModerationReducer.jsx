
import { createSlice } from "@reduxjs/toolkit";
import {
  reportContent,
  blockProfile,
  unblockProfile,

  getPendingReports,
  banUser,
  dismissReports,
  getBlockEvents,
  acknowledgeBlockEvent,
 
} from "../actions/ModerationAcitons";

const initialState = {
  // User-facing moderation
  blockedProfileIds: [],
  loadingBlocks: false,
  errorBlocks: null,
blockEvents: [],
blockEventsLoading: false,
blockEventsError: null,
acknowledgingId: null,
acknowledgeError: null,
  reportStatus: "idle", // idle | loading | succeeded | failed
  reportError: null,

  blockActionStatus: "idle",
  blockActionError: null,

  // Admin moderation
  reports: [],          // grouped reports
//   loading: false,
//   error: null,
blockedUserIds: [],
    loading: false,
    error: null,
  actioningId: null,    // reportedProfileId currently being banned/dismissed
  actionError: null,
};

const moderationSlice = createSlice({
  name: "moderation",
  initialState,
  reducers: {
    clearReportError(state) {
      state.reportError = null;
      state.reportStatus = "idle";
    },
    clearBlockActionError(state) {
      state.blockActionError = null;
      state.blockActionStatus = "idle";
    },
    clearActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----- USER-FACING -----

      // reportContent
      .addCase(reportContent.pending, (state) => {
        state.reportStatus = "loading";
        state.reportError = null;
      })
      .addCase(reportContent.fulfilled, (state) => {
        state.reportStatus = "succeeded";
      })
      .addCase(reportContent.rejected, (state, action) => {
        state.reportStatus = "failed";
        state.reportError = action.payload?.error || "Failed to report";
      })

      // blockProfile
      .addCase(blockProfile.pending, (state) => {
        state.blockActionStatus = "loading";
        state.blockActionError = null;
      })
      .addCase(blockProfile.fulfilled, (state) => {
        state.blockActionStatus = "succeeded";
      })
      .addCase(blockProfile.rejected, (state, action) => {
        state.blockActionStatus = "failed";
        state.blockActionError = action.payload?.error || "Failed to block";
      })

      // getBlockedProfiles
    
      // unblockProfile
      .addCase(unblockProfile.pending, (state) => {
        state.blockActionStatus = "loading";
        state.blockActionError = null;
      })
      .addCase(unblockProfile.fulfilled, (state, action) => {
        state.blockActionStatus = "succeeded";
        state.blockedProfileIds = state.blockedProfileIds.filter(
          (id) => id !== action.payload.blockedProfileId
        );
      })
      .addCase(unblockProfile.rejected, (state, action) => {
        state.blockActionStatus = "failed";
        state.blockActionError = action.payload?.error || "Failed to unblock";
      })

      // ----- ADMIN MODERATION -----

      // getPendingReports
      .addCase(getPendingReports.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.reports = [];
      })
      .addCase(getPendingReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports || [];
      })
      .addCase(getPendingReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to load reports";
      })

      // banUser
      .addCase(banUser.pending, (state, action) => {
        state.actioningId = action.meta.arg.reportedProfileId;
        state.actionError = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.actioningId = null;
        // Remove the banned user’s group from the list
        state.reports = state.reports.filter(
          (g) => g.reportedProfileId !== action.payload.reportedProfileId
        );
      })
      .addCase(banUser.rejected, (state, action) => {
        state.actioningId = null;
        state.actionError = action.payload?.error || "Ban failed";
      })

      // dismissReports
      .addCase(dismissReports.pending, (state) => {
        state.actionError = null;
      })
      .addCase(dismissReports.fulfilled, (state) => {
        // Simple approach: clear reports and let the page refetch
        state.reports = [];
      })
  

.addCase(getBlockEvents.pending, (state) => {
  state.blockEventsLoading = true;
  state.blockEventsError = null;
})
.addCase(getBlockEvents.fulfilled, (state, action) => {
  state.blockEventsLoading = false;
  state.blockEvents = action.payload.events || [];
})
.addCase(getBlockEvents.rejected, (state, action) => {
  state.blockEventsLoading = false;
  state.blockEventsError = action.payload?.error || "Failed to load block events";
})


.addCase(acknowledgeBlockEvent.pending, (state, action) => {
  state.acknowledgingId = action.meta.arg.eventId;
  state.acknowledgeError = null;
})
.addCase(acknowledgeBlockEvent.fulfilled, (state, action) => {
  state.acknowledgingId = null;
  state.blockEvents = state.blockEvents.map((e) =>
    e.id === action.payload.eventId ? { ...e, acknowledged: true } : e
  );
})
.addCase(acknowledgeBlockEvent.rejected, (state, action) => {
  state.acknowledgingId = null;
  state.acknowledgeError = action.payload?.error || "Failed to acknowledge block event";
});
  },
});

export const { clearReportError, clearBlockActionError, clearActionError } =
  moderationSlice.actions;

export default moderationSlice