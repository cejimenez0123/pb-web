import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class ModerationRepo {
  headers = {
    "Content-Type": "application/json",
  };

  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }

  // ----- USER-FACING MODERATION -----
async reportContent({ contentType, contentId, reportedProfileId, reason, reasonDetails }) {
  const headers = await this.getAuthHeaders();
  const res = await axios.post(
    Enviroment.url + "/auth/reports",
    { contentType, contentId, reportedProfileId, reason, reasonDetails },
    { headers }
  );
  return res.data;
}
//   async reportContent({ contentType, contentId, reportedProfileId, reason }) {
//     const headers = await this.getAuthHeaders();
//     const res = await axios.post(
//       Enviroment.url + "/auth/reports",
//       { contentType, contentId, reportedProfileId, reason },
//       { headers }
//     );
//     return res.data;
//   }

  async blockProfile({ blockedProfileId, reason }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      Enviroment.url + "/auth/blocks",
      { blockedProfileId, reason },
      { headers }
    );
    return res.data;
  }

// In ModerationRepo

// ModerationRepo.js

// ModerationRepo.js

async getBlockedProfiles() {
  const headers = await this.getAuthHeaders();
  const res = await axios.get(Enviroment.url + "/auth/blocks", {
    headers,
  });
  // res.data = { blockedProfiles: [{ id, username, profilePic }, ...] }
  return res.data;
}

  async unblockProfile(blockedProfileId) {
    const headers = await this.getAuthHeaders();
    const res = await axios.delete(
      `${Enviroment.url}/auth/blocks/${blockedProfileId}`,
      { headers }
    );
    return res.data; // { ok: true }
  }

  // ----- ADMIN MODERATION -----

  async getPendingReports() {
    const headers = await this.getAuthHeaders();
    const res = await axios.get(Enviroment.url + "/auth/admin/reports", {
      headers,
    });
    return res.data; // { reports: [...] }
  }

  async banUser({ reportedProfileId, reportIds }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      Enviroment.url + "/auth/admin/ban",
      { reportedProfileId, reportIds },
      { headers }
    );
    return res.data; // { ok: true }
  }

  async dismissReports({ reportIds }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      Enviroment.url + "/auth/admin/dismiss",
      { reportIds },
      { headers }
    );
    return res.data; // { ok: true }
  }
 async getBlockedUserIds() {
        const headers = await this.getAuthHeaders();
  const res = await axios.get("/blocked", { headers });
  return res.data; // { blockedUserIds: string[] }
}
}

export default new ModerationRepo();