import axios from "axios"
import Enviroment from "../core/Enviroment"
import { Preferences } from "@capacitor/preferences"
class ProfileRepo {
    url = Enviroment.url+"/profile"

    async all(){
        let res = await axios.get(this.url+"/")
        return res.data
    }
     headers= {
        
    }

token = null;

async getAuthHeaders() {
  if (!this.token) {
    const { value } = await Preferences.get({ key: "token" });
    if (!value) throw new Error("No token found");
    this.token = value;
  }

  return {
    Authorization: `Bearer ${this.token}`,
  };
}
async updateProfile({
  username,
  profilePicture,
  selfStatement,
  privacy,
  location,
  writingSprintSlots,
} = {}) {
  const headers = await this.getAuthHeaders();

  const payload = {
    ...(username !== undefined && { username }),
    ...(profilePicture !== undefined && { profilePicture }),
    ...(selfStatement !== undefined && { selfStatement }),
    ...(privacy !== undefined && { privacy }),
    ...(location !== undefined && { location }),
    ...(writingSprintSlots !== undefined && { writingSprintSlots }),
  };

  try {
    const res = await axios.patch(
      this.url + "/me",
      payload,
      { headers }
    );

    return res.data;
  } catch (e) {
    throw e;
  }
}
async getMyProfiles() {
  const headers = await this.getAuthHeaders();

  try {
    const res = await axios.get(this.url + "/me", { headers });
  
    return res.data;
  } catch (e) {

  throw e;
}
}
    async create({email,token,password,username,profilePicture,selfStatement,privacy}){
        let headers = await this.getAuthHeaders()
try{     
       let res = await axios.post(this.url,
        {email,token,password,username,profilePicture,selfStatement,privacy},{
            headers
        })

        return res.data
    }catch (e) {

  throw e;
}
    }
    async notifications({seen,profile}){
    let headers = await this.getAuthHeaders()

        let res = await axios.get(this.url+"/me/alert",{headers:headers,params:{
seen:seen
        }})
     
     return res.data

    }
    async register({uId,idToken,referralToken,writingSprintSlots,password,username,googleId,profilePicture,selfStatement,privacy}){

       const res = await axios.post(Enviroment.url+"/auth/register",{googleId,identityToken:idToken,referralToken,password,username,
        profilePicture,selfStatement,privacy,writingSprintSlots
       }) 

       return res.data
    
    }
    async getProfileProtected(params){
        let headers = await this.getAuthHeaders()

        const {id}=params
        
        let res = await axios.get(this.url+"/protected/"+id,{headers:headers})
      
        return res.data
    }
    async getProfile(params){
        const {id}=params
        let res = await axios.get(this.url+"/"+id+"")
        return res.data
    }
    async markNotificationsRead() {
  const headers = await this.getAuthHeaders();
  try {
    const res = await axios.patch(this.url + "/notifications/read", {}, { headers });
    return res.data;
  } catch (e) {

    throw e;
  }
}
async uploadPhoto({ file, purpose = "general", filename } = {}) {
  if (!file) {
    throw new Error("No file provided.");
  }
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/heic",
];

  if (!allowedTypes.includes(file.type)) {
  throw new Error("Only JPEG, PNG and HEIC images are allowed.");
}

  if (!["general", "story", "profile"].includes(purpose)) {
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

  const photo = response.data.photo;

  if (!photo?.id || !photo?.url) {
    throw new Error("The server did not return a valid photo.");
  }

  return {
    ...photo,
    url: photo.url,
    fileName: photo.filename || filename || file.name,
    photoId: photo.id,
  };
}


    async createBookmark({profile,collection}){
             const headers = await this.getAuthHeaders();

let res = await axios.post(
  this.url + "/" + profile.id + "/collection/" + collection.id,
  {},
  { headers })
 return res.data
  
    }
async recommend({profileId,limit=10}){
     const { data } = await axios.get(this.url+`/${profileId}/recommendations`, {
        params: { limit },
      });
      return data
    }
    async getMyProfileCollections(params = {}) {
  const headers = await this.getAuthHeaders();

  const res = await axios.get(
    this.url + "/collections/protected",
    {
      headers,
      params,
    }
  );

  return res.data;
}
}

export default new ProfileRepo()