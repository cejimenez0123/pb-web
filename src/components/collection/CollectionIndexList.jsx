import InfiniteScroll from "react-infinite-scroll-component"
import CollectionIndexItem from "./CollectionIndexItem"
const CollectionIndexList = (props)=>{
    
    if(props.cols){
       
    return(<InfiniteScroll
                   className="w-[94vw] md:w-[42em] max-h-[36em] py-2 overflow-scroll mx-auto"
                   dataLength={props.cols.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={<div className="text-emerald-800 p-8" >
                        <h2 className="text-xl py-2">Fin</h2>
                    </div>}
                  >
                      {props.cols.map(col=>{
                        return<div className=" mx-auto   w-[98%] my-2"><CollectionIndexItem collection={col}/></div> 
                      })}  
                   </InfiniteScroll>)

            }else{
         return(<><div className="skeleton w-full h-24"></div></>)
    }
}

export default CollectionIndexList