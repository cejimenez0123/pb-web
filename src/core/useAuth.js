import { auth} from "./di"
import { useEffect, useState } from "react"
import { useSelector ,useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { getCurrentProfile,fetchHomeCollection} from "../actions/UserActions"
import { fetchBookmarkLibrary } from "../actions/LibraryActions"

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
                     
                      const bookmarkId ={
                        id: profile.bookmarkLibraryId
                      }
                      dispatch(fetchBookmarkLibrary(bookmarkId))
                      dispatch(fetchHomeCollection(params))
                    }
                  }
                })
            } 
                setAuthState({ user, pending: false, isSignedIn: Boolean(user) }) 
            
      } })
},[currentProfile])


    return {...authState }
  }