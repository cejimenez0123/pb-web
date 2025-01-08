
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
                        <p className="text-emerald-600">fin</p>
                      </div>
                    }
                  >
                      {items.map(item=>{
                        return <div className=" my-2"><IndexItem page={item} item={item} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<></>)
                    }
}

export default IndexList