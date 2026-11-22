import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class PhotoRepo {
  headers = {};
  url = Enviroment.url + "/api/photos";

  async getAuthHeaders() {
    const { value: token } = await Preferences.get({
      key: "token",
    });

    if (!token) {
      throw new Error("You must be signed in to upload or retrieve photos.");
    }

    return {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  async uploadPhoto({ file, purpose = "general", filename } = {}) {
    if (!file) {
      throw new Error("No file provided.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG and SVG images are allowed.");
    }

    if (!["general", "story"].includes(purpose)) {
      throw new Error("Invalid photo purpose.");
    }

    const headers = await this.getAuthHeaders();
    const formData = new FormData();

    formData.append("file", file, filename || file.name);
    formData.append("purpose", purpose);

    const response = await axios.post(
      `${this.url}/`,
      formData,
      { headers }
    );
console.log(response)
    const photo = response.data.photo;
console.log(photo)
    if (!photo?.id || !photo?.url) {
      throw new Error("Y The server did not return a valid photo.");
    }

    return {
      ...photo,
      url: photo.url,
      fileName: photo.filename || filename || file.name,
      photoId: photo.id,
    };
  }

  async uploadProfilePicture({ file, filename } = {}) {
    if (!file) {
      throw new Error("No profile picture provided.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG and SVG images are allowed.");
    }

    const headers = await this.getAuthHeaders();
    const formData = new FormData();

    formData.append("file", file, filename || file.name);

    const response = await axios.post(
      `${this.url}/profile-picture`,
      formData,
      { headers }
    );

    if (!response.data.profile) {
      throw new Error("X The server did not return an updated profile.");
    }

    return {
      profile: response.data.profile,
      photo: response.data.photo,
    };
  }

  async getPhoto({ id } = {}) {
    if (!id) {
      throw new Error("Photo ID is required.");
    }

    const headers = await this.getAuthHeaders();

    const response = await axios.get(
      `${this.url}/${id}`,
      {
        headers,
        responseType: "blob",
      }
    );

    return response.data;
  }

  getPhotoUrl({ id } = {}) {
    if (!id) return null;

    return `/api/photos/${id}`;
  }

  async deletePhoto({ photoId } = {}) {
    if (!photoId) {
      throw new Error("Photo ID is required.");
    }

    const headers = await this.getAuthHeaders();

    const response = await axios.delete(
      `${this.url}/${photoId}`,
      { headers }
    );

    return response.data;
  }
  async associatePhotoWithStory({ photoId, storyId } = {}) {
  if (!photoId || !storyId) {
    throw new Error("Photo ID and Story ID are required.");
  }

  const headers = await this.getAuthHeaders();

  const response = await axios.patch(
    `${this.url}/${photoId}/story/${storyId}`,
    {},
    { headers }
  );

  return response.data;
}
}

export default new PhotoRepo();
