
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getStorage, ref, getBlob } from "firebase/storage";

import PhotoRepo from "../../data/repositories/PhotoRepo";
import ProfileRepo from "../../data/repositories/ProfileRepo";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const getExtension = (mimeType) => {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
  };

  return extensions[mimeType] || null;
};

export const migrateFirebaseProfilePicture = createAsyncThunk(
  "profile/migrateFirebaseProfilePicture",
  async ({ profileId, profilePic }, thunkApi) => {
    try {
      if (!profileId || !profilePic) {
        throw new Error("Profile ID and profile picture are required.");
      }

      // Already migrated or not a Firebase URL.
      if (!profilePic.includes("firebasestorage.googleapis.com")) {
        return {
          skipped: true,
          profileId,
          profilePic,
        };
      }

      // Download from Firebase Storage.
      const storage = getStorage();
      const firebaseRef = ref(storage, profilePic);

      const blob = await getBlob(firebaseRef, MAX_FILE_SIZE);

      if (!blob.size || blob.size > MAX_FILE_SIZE) {
        throw new Error("Invalid image size.");
      }

      // Validate format.
      const mimeType = blob.type.toLowerCase();
      const extension = getExtension(mimeType);

      if (!extension) {
        throw new Error(
          `Unsupported image format: ${mimeType || "unknown"}`
        );
      }

      // Convert to File.
      const filename = `profile-${profileId}-${Date.now()}.${extension}`;

      const file = new File([blob], filename, {
        type: mimeType,
      });

      // Upload to MongoDB.
      const photo = await PhotoRepo.uploadPhoto({
        file,
        profileId,
        purpose: "profile",
        filename,
        originalUrl: profilePic,
      });

      // Update Profile.profilePic.
      const updatedProfile = await ProfileRepo.updateProfile({
        profilePic: photo.url,
      });

      return {
        profileId,
        oldProfilePic: profilePic,
        newProfilePic: photo.url,
        photoId: photo.photoId || photo.id,
        profile: updatedProfile,
      };
    } catch (err) {
      console.error("Profile picture migration failed:", err);

      return thunkApi.rejectWithValue({
        message:
          err.response?.data?.message ||
          err.message ||
          "Profile picture migration failed.",
        profileId,
        oldProfilePic: profilePic,
      });
    }
  }
);
migrateFirebaseProfilePicture()