import BookListItem from "../BookListItem"
import { useSelector } from "react-redux"
import { IonItem, IonList } from "@ionic/react"
export default function ExploreList(){
    const items = useSelector(state=>state.books.recommendedCols)??[]
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