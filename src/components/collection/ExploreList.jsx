import InfiniteScroll from "react-infinite-scroll-component"
import BookListItem from "../BookListItem"
import { useSelector } from "react-redux"
import { IonItem, IonList } from "@ionic/react"
export default function ExploreList(){
    const items = useSelector(state=>state.books.recommendedCols)??[]

    return  <div className="my-12  text-center">
    <h6 className="lora-bold text-emerald-800 mx-auto  w-fit text-3xl my-8">Explore</h6>

    <IonList className="flex flex-row overflow-x-scroll">
            {items.map((item,i)=><IonItem className="mx-3" key={i}><BookListItem key={item.id+i} book={item}/></IonItem>)}
            </IonList>
</div>
}