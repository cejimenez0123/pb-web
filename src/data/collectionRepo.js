import axios from "axios";
import Enviroment from "../core/Enviroment";



export default class CollectionRepo{
    async getPublicBooks(){
        let res = await axios.get(Enviroment.url+"/collection/book")
        return res.data
    }
    async getPublicLibraries(){
        let res = await axios.get(Enviroment.url+"/collection/library")
        return res.data
    }
    async createCollection(data){

    }
    async updateCollection(data){

    }
    async addStoryToCollection(data){

    }
    async addCollectionToCollection(data){
        
    }
}