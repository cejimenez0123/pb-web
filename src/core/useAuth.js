import { auth} from "./di"
import { useEffect, useState } from "react"
import { useSelector ,useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { getCurrentProfile,fetchHomeCollection} from "../actions/UserActions"

export default function useAuth(shareAuthState) {
    const [authState, setAuthState] = useState({
      isSignedIn: false,
      pending: true,
      user: null,
    })
    const currentProfile = useSelector(state=>state.users.currentProfile)
  const dispatch = useDispatch()
    useEffect(() => {
        
        onAuthStateChanged(auth,(user)=>{
            
          if (user) {
            if (user.emailVerified && (!currentProfile || currentProfile.userId != user.uid)) {
                localStorage.setItem('user', JSON.stringify(user));
                dispatch(getCurrentProfile({userId: user.uid})).then(result=>{
                  if(result.error==null){
                    const {payload} = result
                    if(payload.error==null){
                      const {profile} = payload
                      const params = {
                        profile
                      }
                      dispatch(fetchHomeCollection(params))
                    }
                  }
                })
            } 
                setAuthState({ user, pending: false, isSignedIn: Boolean(user) }) 
            
      } })
},[])


    return {...authState }
  }