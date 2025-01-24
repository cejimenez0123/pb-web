
import InfiniteScroll from "react-infinite-scroll-component"
import IndexItem from "./IndexItem"
import { useEffect, useState } from "react"
import uuidv4 from "../../core/uuidv4"
const IndexList = ({items})=>{
      const [sortTime,setSortTime]=useState(null)
    const [sortAlpha,setSortAlpha]=useState(null)
    const [list,setList]=useState(items)
    useEffect(()=>{
        if(sortAlpha){
        let sorted=[...items].sort((a,b)=>{
            if (a.title < b.title) {
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
        })
        setList(sorted)
      }else{
        let sorted = [...items].sort((a,b)=>{
          if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
      })
      setList(sorted)
      }
    },[])
    if(items){
    return(<InfiniteScroll
      className="   overflow-y-scroll "
                   dataLength={items.length}
                   next={()=>{}}
                   scrollThreshold={1}
                   hasMore={false}
                    endMessage={
                      <div className="p-12 flex" >
                        <h3 className="text-emerald-600 lora-bold text-center text-xl tracking-wide mx-auto">There's always room. Breate to let in creativity.</h3>
                      </div>
                    }
                  >
                      {items.map((item,i)=>{
                      
                        return <IndexItem key={ i+item.id} page={item} item={item} />
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<div className="flex min-h-36">

                      <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
                      </div>)
                    }
}

export default IndexList