// import photoRepo from "../../data/photoRepo";

// ;

// export const uploadProfilePicture = createAsyncThunk(
//   "users/uploadProfilePicture",
//   async ({ file, id }, thunkApi) => {
//     try {
//       return await photoRepo.uploadPhoto({
//         file,
//         profileId: id,
//         purpose: "profile",
//       });
//     } catch (err) {
//       console.error("Upload error:", err);

//       return thunkApi.rejectWithValue({
//         message:
//           "UPLOAD FAILED: " +
//           (err.response?.data?.message || err.message),
//       });
//     }
//   }
// );