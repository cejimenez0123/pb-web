
import { createSlice } from "@reduxjs/toolkit";
import {
  createComment,
  appendComment,
  updateComment,
  deleteComment,
  setComments,
  fetchCommentsOfPage,
} from "../actions/PageActions.jsx";
import { removeContentByProfileId } from "../actions/ModerationAcitons.jsx";

const initialState = {
  byStory: {},
  comments: [],
  loading: false,
  error: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const upsert = (list, comment) => {
  const idx = list.findIndex((c) => c.id === comment.id);
  if (idx > -1) {
    list[idx] = comment;
  } else {
    list.unshift(comment);
  }
};

const findDeep = (comments, id) => {
  for (const c of comments) {
    if (c.id === id) return c;
    if (c.children?.length) {
      const found = findDeep(c.children, id);
      if (found) return found;
    }
  }
  return null;
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers(builder) {
    // ── fetch ────────────────────────────────────────────────────────────────
    builder.addCase(fetchCommentsOfPage.fulfilled, (state, { payload }) => {
      const { comments } = payload;
      if (!comments?.length) return;

      state.comments = comments;

      const storyId = comments[0].storyId;
      state.byStory[storyId] = comments;
    });

    // ── create ───────────────────────────────────────────────────────────────
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload?.error ?? "Failed to save comment";
      })
      .addCase(createComment.fulfilled, (state, { payload }) => {
        state.loading = false;
        const comment = payload?.comment;
        if (!comment) return;

        // Flat list
        upsert(state.comments, comment);

        // byStory map
        const storyId = comment.storyId;
        if (!state.byStory[storyId]) state.byStory[storyId] = [];

        if (comment.parentId) {
          // ← findDeep handles any nesting level
          const parent = findDeep(state.byStory[storyId], comment.parentId);
          if (parent) {
            parent.children = [...(parent.children ?? []), comment];
          }
        } else {
          upsert(state.byStory[storyId], comment);
        }
      });

    // ── update ───────────────────────────────────────────────────────────────
    builder
      .addCase(updateComment.rejected, (state, { payload }) => {
        state.error = payload?.error ?? "Failed to update comment";
      })
      .addCase(updateComment.fulfilled, (state, { payload }) => {
        const comment = payload?.comment;
        if (!comment) return;

        state.comments = state.comments.map((c) =>
          c.id === comment.id ? comment : c
        );

        const storyId = comment.storyId;
        if (state.byStory[storyId]) {
          state.byStory[storyId] = state.byStory[storyId].map((c) =>
            c.id === comment.id ? comment : c
          );
        }
      });

    // ── delete ───────────────────────────────────────────────────────────────
    builder
      .addCase(deleteComment.rejected, (state, { payload }) => {
        state.error = payload?.error ?? "Failed to delete comment";
      })
      .addCase(deleteComment.fulfilled, (state, { payload }) => {
        const comment = payload?.comment;
        if (!comment) return;

        state.comments = state.comments.filter((c) => c.id !== comment.id);

        const storyId = comment.storyId;
        if (state.byStory[storyId]) {
          state.byStory[storyId] = state.byStory[storyId].filter(
            (c) => c.id !== comment.id
          );
        }
      });

    // ── sync actions (setComments / appendComment) ───────────────────────────
    builder.addCase(setComments.type, (state, { payload }) => {
      state.comments = payload;

      if (payload?.length) {
        const storyId = payload[0].storyId;
        state.byStory[storyId] = payload;
      }
    });

    builder.addCase(appendComment.type, (state, { payload }) => {
      if (!payload) return;

      if (Array.isArray(payload)) {
        const ids = new Set(state.comments.map((c) => c.id));
        const incoming = payload.filter((c) => !ids.has(c.id));
        state.comments = [...state.comments, ...incoming];

        if (incoming.length) {
          const storyId = incoming[0].storyId;
          if (!state.byStory[storyId]) state.byStory[storyId] = [];
          incoming.forEach((c) => upsert(state.byStory[storyId], c));
        }
      } else {
        upsert(state.comments, payload);

        const storyId = payload.storyId;
        if (!state.byStory[storyId]) state.byStory[storyId] = [];
        upsert(state.byStory[storyId], payload);
      }
    }).addCase(removeContentByProfileId, (state, { payload }) => {
      const { profileId } = payload;
      if (!profileId) return;

      state.comments = removeByProfileIdDeep(state.comments, profileId);

      Object.keys(state.byStory).forEach((storyId) => {
        state.byStory[storyId] = removeByProfileIdDeep(
          state.byStory[storyId] ?? [],
          profileId
        );
      });
    });
  },
});

export default commentSlice;