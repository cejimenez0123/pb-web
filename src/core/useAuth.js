import { auth} from "./di"
import { useEffect } from "react"
import { useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
export default function useAuth(shareAuthState) {
    const [authState, setAuthState] = useState({
      isSignedIn: false,
      pending: true,
      user: null,
    })
  
    useEffect(() => {
        if(auth!=null){
        onAuthStateChanged(auth,(user)=>{
           
     
                setAuthState({ user, pending: false, isSignedIn: !!user }) 
            
        })}
}, [])


    return {...authState }
  }