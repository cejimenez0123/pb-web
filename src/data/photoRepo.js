
import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class PhotoRepo {
  headers = {};

  url = Enviroment.url + "/photos";

  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });

    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }

  // -----------------------------------------
  // UPLOAD PHOTO
  // -----------------------------------------

  async uploadPhoto({
    file,
    profileId,
    purpose = "general",
    filename,
    originalUrl,
  } = {}) {
    if (!file) {
      throw new Error("No file provided.");
    }

    if (!profileId) {
      throw new Error("Profile ID is required.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Only JPEG, JPG, PNG and SVG images are allowed."
      );
    }

    const headers = await this.getAuthHeaders();

    const formData = new FormData();

    formData.append("file", file, filename || file.name);
    formData.append("profileId", profileId);
    formData.append("purpose", purpose);

    if (filename) {
      formData.append("filename", filename);
    }

    if (originalUrl) {
      formData.append("originalUrl", originalUrl);
    }

    const res = await axios.post(
      this.url,
      formData,
      {
        headers: {
          ...headers,
        },
      }
    );

    const photo = res.data.photo;

    return {
      ...photo,
      url: photo.url?.startsWith("http")
        ? photo.url
        : Enviroment.url + photo.url,
      fileName: photo.filename || filename || file.name,
      photoId: photo.id,
    };
  }

  // -----------------------------------------
  // GET PHOTO
  // -----------------------------------------

  async getPhoto({ id } = {}) {
    if (!id) {
      throw new Error("Photo ID is required.");
    }

    const headers = await this.getAuthHeaders();

    const res = await axios.get(
      `${this.url}/${id}`,
      {
        headers,
        responseType: "blob",
      }
    );

    return res.data;
  }

  // -----------------------------------------
  // GET PHOTO URL
  // -----------------------------------------

  getPhotoUrl({ id } = {}) {
    if (!id) {
      throw new Error("Photo ID is required.");
    }

    return `${this.url}/${id}`;
  }

  // -----------------------------------------
  // DELETE PHOTO
  // -----------------------------------------

  async deletePhoto({ id } = {}) {
    if (!id) {
      throw new Error("Photo ID is required.");
    }

    const headers = await this.getAuthHeaders();

    const res = await axios.delete(
      `${this.url}/${id}`,
      { headers }
    );

    return res.data;
  }
}

export default new PhotoRepo();
