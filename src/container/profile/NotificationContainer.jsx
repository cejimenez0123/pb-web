import { useEffect} from "react"
import { useDispatch } from "react-redux"
import { fetchNotifcations } from "../../actions/ProfileActions"
import { useSelector } from "react-redux"
import NotificationItem from "../../components/profile/NotificationItem"
import usePersistentNotifications from "../../domain/usecases/usePersistentNotifications"
import { IonList,IonItem, IonContent } from "@ionic/react"
export default function NotificationContainer({currentProfile}){
    const dispatch = useDispatch()
    //  const payload = usePersistentNotifications(()=>dispatch(fetchNotifcations({profile:currentProfile})))
    const items = useSelector(state=>state.users.notifications??[])
     var today= new Date();
 
    let oneDayOld = today.setDate(today.getDate() - 1)
    let lastNotified =  oneDayOld
    useEffect(()=>{
        dispatch(fetchNotifcations({profile:currentProfile}))
    },[currentProfile])
    

    return(<IonContent fullscreen={true} className="flex flex-col justify-center md:py-8">
        <div  className=" w-[96vw] border-b-2 border-emerald-600 mx-auto md:w-page">
<h1 className="lora-bold text-xl text-emerald-800  mb-4 mt-8 text-opacity-70">Today</h1>
<IonList>
{[...items].map((item,i)=>{
    return(<IonItem key={i}>
      <NotificationItem item={item} lastNotified={lastNotified}/>
        </IonItem>)
})}
</IonList>
</div>
    </IonContent>)

}
