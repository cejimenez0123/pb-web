import React, { useState, useEffect, useRef }  from "react";
import { useDispatch } from "react-redux";
import { getProfilePages } from "../actions/PageActions";
import { useSelector } from "react-redux";
import Page from "../domain/models/page";
import InfiniteScroll from "react-infinite-scroll-component";
import DashboardItem from "./DashboardItem";
import PageListItem from "./PageLIstItem";
export default function PageList({pages,profileId,groupBy,hasMore}) {
    
    const dispatch = useDispatch()
//     useEffect(()=>{
//        fetchData()
    
//     },[])
//     let hasMore = false
//    const fetchData=()=>{
//         // const params = {profileId,page,groupBy}
//     if(!hasMore){
//         // dispatch(getProfilePages(params)).then((result) => {
//         //     hasMore = true
//         //     const newPage = page+1 
//         //     setPage(newPage)
//         // }).catch((err) => {
//         //     hasMore=false
//         // });
//     }
        
       
//     }
    // console.log(`pages ${JSON.stringify(pages)}`)
    return(<div className="page-list">
       {/* <InfiniteScroll
      dataLength={pages}
      next={fetchData}
      hasMore={hasMore} // Replace with a condition based on your data source
      loader={<p>Loading...</p>}
      endMessage={<p>No more data to load.</p>}
    >
        {pages.map(page =>{
                return(<PageListItem page={page}/>)
        })}
    </InfiniteScroll> */}
    </div>)
}
