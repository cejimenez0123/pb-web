
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
                        let uuid= uuidv4()
                        return <div key={uuid+item.id} className="mx-2 my-2"><IndexItem page={item} item={item} /></div>
                      })}  
                   </InfiniteScroll>)

                    }else{
                      return(<div className="flex min-h-36">

                      <h2 className="mx-auto my-auto text-emerald-800">Room for possibility</h2>
                      </div>)
                    }
}

export default IndexList