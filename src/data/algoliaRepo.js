import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class AlgoliaRepo {
  headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  async getAuthHeaders() {
    const { value} = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${value}`,
    };
  }
  async search(query) {
    const headers = await this.getAuthHeaders();
    const res = await axios.get(`${Enviroment.url}/api/algolia/search`, {
      headers,
      params: { q: query },
    });
    return res.data; // { results: [...] }
  }
  // ✅ Save or create object in Algolia
  async saveObject(indexName, object) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      `${Enviroment.url}/api/algolia/save`,
      { indexName, object },
      { headers }
    );
    return res.data;
  }

  // 🗑️ Delete object from Algolia
  async deleteObject(indexName, objectID) {
    const headers = await this.getAuthHeaders();
    const res = await axios.delete(`${Enviroment.url}/api/algolia/delete`, {
      headers,
      data: { indexName, objectID },
    });
    return res.data;
  }

  async partialUpdateObject(indexName, objectID, fields) {
    const headers = await this.getAuthHeaders();
    const res = await axios.patch(
      `${Enviroment.url}/api/algolia/update`,
      { indexName, objectID, fields },
      { headers }
    );
    return res.data;
  }
}

export default new AlgoliaRepo();
