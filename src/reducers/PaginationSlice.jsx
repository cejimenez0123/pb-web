import { createSlice } from "@reduxjs/toolkit";
import { setPaginationLoading, initKey, setPageData } from "../actions/PageActions";

const initialState = {
    byKey: {},
};

const ensureKey = (state, key) => {
    if (!key) return;
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
    extraReducers(builder) {
        builder
        .addCase(initKey, (state, action) => {
            const { key } = action.payload;
            ensureKey(state, key);
        })
        .addCase(setPageData, (state, action) => {
            const { key, page, items, totalCount } = action.payload;
            ensureKey(state, key);
            state.byKey[key].pages[page] = items;
            if (typeof totalCount === "number") {
                state.byKey[key].totalCount = totalCount;
            }
        })
        .addCase(setPaginationLoading, (state, action) => {
            const { key, loading } = action.payload;
            ensureKey(state, key);
            state.byKey[key].loading = loading;
        })
    },
});

export default paginationSlice;