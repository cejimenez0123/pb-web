import { useSelector } from "react-redux"

import InfiniteScroll from "react-infinite-scroll-component"
import CollectionIndexItem from "./CollectionIndexItem"
const CollectionIndexList = (props)=>{
    
    if(props.cols){
       
    return(<InfiniteScroll
                   
                   dataLength={props.cols.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={<div className="p-8" >
                        <h2>Fin</h2>
                    </div>}
                  >
                      {props.cols.map(col=>{
                        return <div className="border-2 rounded-lg my-2 mx-2 border-emerald-200"><CollectionIndexItem collection={col}/></div>
                      })}  
                   </InfiniteScroll>)

            }else{
         return(<><div className="skeleton w-full h-24"></div></>)
    }
}

export default CollectionIndexList