import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class AlgoliaRepo {
  headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  async getAuthHeaders() {
    const { value: token } = await Preferences.get({ key: "token" });
    return {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  // ✅ Save or create object in Algolia
  async saveObject(indexName, object) {
    const headers = await this.getAuthHeaders();
    const res = await axios.post(
      `${Enviroment.url}/algolia/save`,
      { indexName, object },
      { headers }
    );
    return res.data;
  }

  // 🗑️ Delete object from Algolia
  async deleteObject(indexName, objectID) {
    const headers = await this.getAuthHeaders();
    const res = await axios.delete(`${Enviroment.url}/algolia/delete`, {
      headers,
      data: { indexName, objectID },
    });
    return res.data;
  }

  // ✏️ Partial update of existing object
  async partialUpdateObject(indexName, objectID, fields) {
    const headers = await this.getAuthHeaders();
    const res = await axios.patch(
      `${Enviroment.url}/algolia/update`,
      { indexName, objectID, fields },
      { headers }
    );
    return res.data;
  }
}

export default new AlgoliaRepo();
