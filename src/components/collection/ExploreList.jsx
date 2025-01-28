import InfiniteScroll from "react-infinite-scroll-component"
import BookListItem from "../BookListItem"
import { useSelector } from "react-redux"
export default function ExploreList(){
    const items = useSelector(state=>state.books.recommendedCols)??[]

    return  <div className="my-12  text-center">
    <h6 className="lora-bold text-emerald-800 mx-auto  w-fit text-3xl my-8">Explore</h6>
 <InfiniteScroll dataLength={items.length}
            hasMore={false}
        loader={
            <div>
                Loading
            </div>
        }
        className="flex max-v-[96vw] mx-auto flex-row"
        endMessage={<div className='flex min-w-72 mont-medium'>
        <span className='mx-auto my-auto text-center rounded-full p-3  text-emerald-400 '>
            <h6 className=''>
                Join the community. <br/>Apply to join today.
                </h6><h6>Share your own work.</h6>
                <h6> This is what we have for now.
                    <br/>
                    Check in later
                </h6>
                </span></div>}> 
    
            {items.map((item,i)=><BookListItem key={item.id+i} book={item}/>)}
        </InfiniteScroll>
</div>
}