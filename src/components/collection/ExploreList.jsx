import BookListItem from "../BookListItem"
import { useSelector } from "react-redux"
import { IonItem, IonList } from "@ionic/react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getRecommendedCollections, getRecommendedCollectionsProfile } from "../../actions/CollectionActions"
export default function ExploreList(){
    const items = useSelector(state=>state.books.recommendedCols)??[]
    const {currentProfile}=useSelector(state=>state.users)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(currentProfile){
                dispatch(getRecommendedCollectionsProfile())
        }else{
                  dispatch(getRecommendedCollections())
        }
    },[currentProfile])
     return<div className='h-[14rem]'>
        <h3 className="text-emerald-900 text-left font-extrabold ml-16 lora-bold mb-4 text-2xl">
        Explore
        </h3>
<div className="mb-4">
        <div className="flex flex-row overflow-x-auto overflow-y-clip h-[14rem] space-x-4 px-4 no-scrollbar">
        
    <IonList className="flex flex-row overflow-x-scroll">
            {items.map((item,i)=><IonItem className="mx-3" key={i}><BookListItem key={item.id+i} book={item}/></IonItem>)}
            </IonList>
</div>
</div>
</div>
}