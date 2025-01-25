import InfiniteScroll from "react-infinite-scroll-component"

export default function ExploreList({items}){
    return  <div className="my-12 px-4 text-center">
    <h6 className="lora-bold text-emerald-800 mx-auto  w-fit text-3xl my-8">Explore</h6>
 <InfiniteScroll dataLength={items.length}
            hasMore={false}
        loader={
            <div>
                Loading
            </div>
        }
        className="flex max-v-[96vw] mx-auto flex-row"
        endMessage={
            <div className="py-12">
                <h6 className="lora-medium">Fin</h6>
            </div>
        }> 
    
            {item.map(item=><BookListItem book={item}/>)}
        </InfiniteScroll>
</div>
}