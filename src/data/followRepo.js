// import axios from "axios"
// import Enviroment from "../core/Enviroment"
// import { Preferences } from "@capacitor/preferences";
// class FollowRepo{
//     headers= {
//         'Access-Control-Allow-Origin': "*"
//     }
//   async getAuthHeaders() {
//     const { value} = await Preferences.get({ key: "token" });
//     return {
//       ...this.headers,
//       Authorization: `Bearer ${value}`,
//     };
//   }
//     async create({follower,following}){
//         let headers = await this.getAuthHeaders()
//        let res = await axios.post(Enviroment.url+"/follow",{follower,following},
//        {headers:headers})
 
//        return res.data
//     }
    
//     async delete({id}){
//          let headers = await this.getAuthHeaders()
//         let res = await axios.delete(Enviroment.url+"/follow/"+id,{headers:
//             headers})
//         return res.data
//     }


// }
// export default new FollowRepo()
 

import axios from "axios";
import Enviroment from "../core/Enviroment";
import { Preferences } from "@capacitor/preferences";

class FollowRepo {
  async getAuthHeaders() {
    const { value } = await Preferences.get({ key: "token" });

    if (!value) {
      throw new Error("Authentication token is missing.");
    }

    return {
      Authorization: `Bearer ${value}`,
    };
  }

  async create({ follower, following }) {
    if (!follower?.id || !following?.id) {
      throw new Error("Follower and following IDs are required.");
    }

    const headers = await this.getAuthHeaders();

    const response = await axios.post(
      `${Enviroment.url}/follow`,
      {
        follower: { id: follower.id },
        following: { id: following.id },
      },
      { headers }
    );

    return response.data;
  }

  async delete({ id }) {
    if (!id) {
      throw new Error("Follow ID is required.");
    }

    const headers = await this.getAuthHeaders();

    const response = await axios.delete(
      `${Enviroment.url}/follow/${id}`,
      { headers }
    );

    return response.data;
  }
}

export default new FollowRepo();
