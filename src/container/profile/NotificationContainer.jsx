import { useLayoutEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchNotifcations } from "../../actions/ProfileActions"
import { useSelector } from "react-redux"




export default function NotificationContainer(props){
    const dispatch = useDispatch()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    useLayoutEffect(()=>{
        dispatch(fetchNotifcations({profile:currentProfile}))
    },[])


    return(<div className="flex">
<h1 className=" lora-bold text-emerald-800 mx-auto my-auto">Work in Progress</h1>
    </div>)

}