import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrentProfile } from "../actions/UserActions";
import { UseSelector } from "react-redux/es/hooks/useSelector";
import useAuth from "../core/useAuth";

function SettingsContainer() {  
    let currentProfile = useSelector(state=>state.users.currentProfile)
    let auth = useAuth()
    const [authState,setAuthState]=useState(auth)
    const dispatch = useDispatch()
    let [pending,setPending] = useState(false)

    useEffect(()=>{
            if(currentProfile==null){
                setPending(true)
                const params = {userId: authState.user.uid}
                dispatch(getCurrentProfile(params))
            }else{
                setPending(false)
            }
           

    },[])
    if(!pending){
            return(<div className="container">
                    <form>

                    </form>
            </div>)
    }else{
        return(<div>

        </div>)
    }


}