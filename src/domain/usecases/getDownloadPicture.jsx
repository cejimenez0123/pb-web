import { useEffect, useState } from "react"
import { getDownloadURL,ref } from "firebase/storage"
import {storage} from "../../core/di.js"
import isValidUrl from "../../core/isValidUrl.js"


export default async function getDownloadPicture(fileName){
  
if(!isValidUrl(fileName)){
        const storageRef = ref(storage, fileName)
       let url = await getDownloadURL(storageRef)
    return url
}else{
    return null
}
}