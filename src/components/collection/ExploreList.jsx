import {BookListItem} from "../BookListItem"
import { useSelector } from "react-redux"
import { IonItem, IonList, useIonRouter } from "@ionic/react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getRecommendedCollections, getRecommendedCollectionsProfile } from "../../actions/CollectionActions"
import { set } from "lodash"
export default function ExploreList({collection}){
    const items = useSelector(state=>state.books.recommendedCols)
    const {currentProfile}=useSelector(state=>state.users)
        const [isPending,setIsPending]=useState(false)

    const dispatch = useDispatch()
    useEffect(()=>{
        setIsPending(true)
        if(currentProfile){
                dispatch(getRecommendedCollectionsProfile()).then(()=>{setIsPending(false)})
                
        }else{
               collection && dispatch(getRecommendedCollections({colId:collection.id})).then(()=>{setIsPending(false)})
        }
    },[currentProfile])
    if(isPending){
return (
  <div className="min-h-[14rem] mt-4 pb-[10em] bg-cream">
    <h3 className="text-emerald-900 text-left bg-cream font-extrabold ml-16 lora-bold mb-4 text-2xl">
      Explore
    </h3>

    <div className="mb-4">
      <div className="flex min-h-[14rem] flex-row overflow-x-auto bg-cream overflow-y-clip h-[14rem] space-x-4 no-scrollbar">
        
        {isPending ? (
          <div className="flex flex-row space-x-4 px-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="min-w-[12rem] h-[12rem] bg-white rounded-xl shadow-md flex flex-col justify-between p-3"
              >
                {/* Title */}
                <div className="h-4 w-3/4 bg-emerald-100 rounded shadow" />

                {/* Body */}
                <div className="space-y-2 mt-4">
                  <div className="h-3 w-full bg-gray-200 rounded shadow" />
                  <div className="h-3 w-5/6 bg-gray-200 rounded shadow" />
                </div>

                {/* Footer */}
                <div className="h-3 w-1/2 bg-gray-200 rounded shadow mt-4" />
              </div>
            ))}
          </div>
        ) : (
          <IonList className="flex flex-row overflow-x-scroll bg-cream">
            {items.map((item, i) => (
              <BookListItem key={item.id + i} book={item} />
            ))}
          </IonList>
        )}

      </div>
    </div>
  </div>
);
        
    }
     return<div className='min-h-[14rem] mt-4 pb-[10em] bg-cream'>
        <h3 className="text-emerald-900 text-left bg-cream font-extrabold ml-16 lora-bold mb-4 text-2xl">
        Explore
        </h3>
<div className="mb-4">
        <div className="flex min-h-[14rem] flex-row overflow-x-auto bg-cream overflow-y-clip h-[14rem] space-x-4 no-scrollbar">
        
 <div className="flex flex-row overflow-x-auto">
            {items?.map((item,i)=><BookListItem key={item.id+i} book={item}/>)}
            </div>
</div>
</div>
</div>
}