
import InfiniteScroll from "react-infinite-scroll-component"
import IndexItem from "./IndexItem"
const IndexList = ({items})=>{
  
    if(items){
    return(<InfiniteScroll
      className="   overflow-y-scroll overlfow-x-hidden "
                   dataLength={items.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={
                      <div className="p-12" >
                        <h3 className="text-emerald-600">fin</h3>
                      </div>
                    }
                  >
                      {items.map(item=>{
                        return <div className="mx-2 my-2"><IndexItem page={item} item={item} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<div className="flex min-h-36">

                      <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
                      </div>)
                    }
}

export default IndexList