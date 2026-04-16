import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byKey: {
    // [key]: {
    //   pages: { [pageNumber]: items[] },
    //   totalCount: 0,
    //   loading: false,
    //   error: null,
    // }
  },
};

const ensureKey = (state, key) => {
  if (!state.byKey[key]) {
    state.byKey[key] = {
      pages: {},
      totalCount: 0,
      loading: false,
      error: null,
    };
  }
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    // -------------------------
    // INIT CACHE KEY
    // -------------------------
    initKey: (state, action) => {
      const { key } = action.payload;
      ensureKey(state, key);
    },

    // -------------------------
    // SET PAGE DATA
    // -------------------------
    setPageData: (state, action) => {
      const { key, page, items, totalCount } = action.payload;

      ensureKey(state, key);

      state.byKey[key].pages[page] = items;

      if (typeof totalCount === "number") {
        state.byKey[key].totalCount = totalCount;
      }
    },

    // -------------------------
    // LOADING STATE
    // -------------------------
    setLoading: (state, action) => {
      const { key, loading } = action.payload;

      ensureKey(state, key);

      state.byKey[key].loading = loading;
    },

    // -------------------------
    // ERROR STATE
    // -------------------------
    setError: (state, action) => {
      const { key, error } = action.payload;

      ensureKey(state, key);

      state.byKey[key].error = error;
    },

    // -------------------------
    // CLEAR ONE KEY
    // -------------------------
    clearPaginationKey: (state, action) => {
      const { key } = action.payload;

      delete state.byKey[key];
    },

    // -------------------------
    // RESET ALL PAGINATION
    // -------------------------
    resetPagination: (state) => {
      state.byKey = {};
    },
  },
});

export const {
  initKey,
  setPageData,
  setLoading,
  setError,
  clearPaginationKey,
  resetPagination,
} = paginationSlice.actions;

export default paginationSlice