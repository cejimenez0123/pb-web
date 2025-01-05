import InfiniteScroll from "react-infinite-scroll-component"
import CollectionIndexItem from "./CollectionIndexItem"
const CollectionIndexList = (props)=>{
    
    if(props.cols){
       
    return(<InfiniteScroll
                   className="max-w-[40em]"
                   dataLength={props.cols.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={<div className="text-emerald-800 p-8" >
                        <h2 className="text-xl py-2">Fin</h2>
                    </div>}
                  >
                      {props.cols.map(col=>{
                        return <CollectionIndexItem collection={col}/>
                      })}  
                   </InfiniteScroll>)

            }else{
         return(<><div className="skeleton w-full h-24"></div></>)
    }
}

export default CollectionIndexList