
import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class CommentRepo {
  headers = {
    "Access-Control-Allow-Origin": "*",
  };

  async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
    

  // ── fetch by story (public) ───────────────────────────────────────────────
  async fetchByStory({ storyId }) {
    const headers = await this.getAuthHeaders()
    const res = await axios.get(Enviroment.url + "/comment", {
      params: { storyId },
      headers: headers,
    });
    return res.data;
  }

  // ── create ────────────────────────────────────────────────────────────────
  async create({ profile, storyId, text, parentId, anchorText }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      Enviroment.url + "/comment",
      {
        profileId:  profile.id,
        storyId,
        text,
        parentId:   parentId ?? null,
        anchorText: anchorText ?? "",
      },
      { headers }
    );
    return res.data;
  }

  // ── update ────────────────────────────────────────────────────────────────
  async update({ id, text }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.patch(
      Enviroment.url + "/comment/" + id,
      { text },
      { headers }
    );
    return res.data;
  }

  // ── delete ────────────────────────────────────────────────────────────────
  async delete({ id }) {
    const headers = await this.getAuthHeaders();
    const res = await axios.delete(Enviroment.url + "/comment/" + id, {
      headers,
    });
    return res.data;
  }

  // ── helpful ───────────────────────────────────────────────────────────────
  async helpful() {
    const res = await axios.get(Enviroment.url + "/comment/helpful");
    return res.data;
  }
}

export default new CommentRepo();