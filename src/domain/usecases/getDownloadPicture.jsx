import { useEffect, useState } from "react"
import { getDownloadURL,ref } from "firebase/storage"
import {storage} from "../../core/di.js"


export default async function getDownloadPicture(fileName){
  

        const storageRef = ref(storage, fileName)
       let url = await getDownloadURL(storageRef)
    return url
}