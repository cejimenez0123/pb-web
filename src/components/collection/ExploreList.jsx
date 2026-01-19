import BookListItem from "../BookListItem"
import { useSelector } from "react-redux"
import { IonItem, IonList } from "@ionic/react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getRecommendedCollections, getRecommendedCollectionsProfile } from "../../actions/CollectionActions"
export default function ExploreList(){
    const items = useSelector(state=>state.books.recommendedCols)
    const {currentProfile}=useSelector(state=>state.users)
console.log("explore items",items)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentProfile){
                dispatch(getRecommendedCollectionsProfile())
        }else{
                dispatch(getRecommendedCollections())
        }
    },[currentProfile,dispatch])
     return<div className='min-h-[14rem] mt-4 pb-[10em] bg-cream'>
        <h3 className="text-emerald-900 text-left bg-cream font-extrabold ml-16 lora-bold mb-4 text-2xl">
        Explore
        </h3>
<div className="mb-4">
        <div className="flex min-h-[14rem] flex-row overflow-x-auto bg-cream overflow-y-clip h-[14rem] space-x-4 no-scrollbar">
        
    <IonList className="flex flex-row overflow-x-scroll bg-cream">
            {items.map((item,i)=><BookListItem key={item.id+i} book={item}/>)}
            </IonList>
</div>
</div>
</div>
}