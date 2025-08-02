
import InfiniteScroll from "react-infinite-scroll-component"
import IndexItem from "./IndexItem"
import { useLayoutEffect, useState } from "react"

const IndexList = ({items,handleFeedback})=>{

   


    if(items){
    return(<InfiniteScroll
      className="   overflow-y-scroll "
                   dataLength={items.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={
                      <div className=" flex max-w-[100vw]" >
                        <h3 className="text-emerald-600 lora-bold text-center text-xl tracking-wide mx-auto">There's always room. <br/>
                        Breathe to let in creativity.</h3>
                      </div>
                    }
                  ><div className="max-w-[100vw]">
                      {items.filter(item=>item).map((item,i)=>{
                      
                        return <IndexItem key={ i+item.id} page={item} item={item} handleFeedback={()=>handleFeedback(item)} />
                      })} 
                      </div> 
                   </InfiniteScroll>)

                    }else{
                      return(<div className="flex min-h-36">

                      <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
                      </div>)
                    }
}

export default IndexList