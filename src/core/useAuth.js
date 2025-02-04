import { auth} from "./di"
import { useEffect, useState } from "react"
import { useSelector ,useDispatch } from "react-redux"
import { onAuthStateChanged } from "firebase/auth"
import { getCurrentProfile} from "../actions/UserActions"
import checkResult from "./checkResult"

export default function useAuth(shareAuthState) {
    const [authState, setAuthState] = useState({
      isSignedIn: false,
      pending: true,
      user: null,
    })
    const signedIn = useSelector(state=>state.users.signedIn)
    const currentProfile = useSelector(state=>state.users.currentProfile)
  const dispatch = useDispatch()
    useEffect(() => {
        
        onAuthStateChanged(auth,(user)=>{
            
          if (user) {
            if (user.emailVerified && (!currentProfile || currentProfile.userId != user.uid)) {
  
                dispatch(getCurrentProfile({userId: user.uid})).then(result=>{
                  checkResult(result,payload=>{
                    const {profile} = payload
                                    const params = {
                                      profile
                                    }
                                    // const bookmarkId ={
                                    //                     id: profile.bookmarkLibraryId
                                    //                   }
                                                      // dispatch(fetchBookmarkLibrary(bookmarkId))
                                                      // dispatch(fetchHomeCollection(params))
                  },err=>{

                  })
                })
            
            }
            setAuthState({ user, pending: false, isSignedIn: Boolean(user) }) 
      } })
      },[])


    return {...authState }
  }