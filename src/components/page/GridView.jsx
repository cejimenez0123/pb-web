
// import InfiniteScroll from "react-infinite-scroll-component";
// import DashboardItem from "./DashboardItem";
// import BookDashboardItem from "../collection/BookDashboardItem";
// import { useMediaQuery } from "react-responsive";
// import {useContext, useLayoutEffect,useState } from "react";
// import Context from "../../context";


// export default function GridView({ items }) {
//   const {isNotPhone}=useContext(Context)

//   const [filteredItems, setFilteredItems] = useState([]);
//   const [ hasMore,setHasMore]=useState(true)

//   useLayoutEffect(()=>{
//     let end = items.length<10?items.length:10
//     items.slice(0,end)
//     setFilteredItems(items)
//   },[])

//     return (
//     <span>
//       <InfiniteScroll
//         id={"grid-view"}
//         className={isNotPhone?"":""}
//         dataLength={filteredItems.length}
//         next={nextPage}
//         scrollThreshold={1}
//         hasMore={hasMore}
//         endMessage={
//           <div>
//             <p>That it for now, join to post your own work</p>
//           </div>
//         }
//       >
       
//         <div className={isNotPhone?"grid-container":" grid grid-cols-2 gap-[0.4em] mx-1"}>
//           {filteredItems.map((item, i) => {
//             const id = `${item.id}_${i}`;

//             if (item.storyIdList?.length > 0 && !item.data) {
//               return (
                
//                   <BookDashboardItem key={item.id} id={i} isGrid={true} book={item} />
           
//               );
//             }

//             if (
//               item.data &&
//               !filteredItems.some(book =>
//                 book?.storyIdList?.some(storyId => storyId === item.id)
//               )
//             ) {
              
//               return (
                
//                   <DashboardItem
//                   key={item.id}
//                     item={item}
//                     index={i}
//                     isGrid={true}
//                     page={item}
//                   />
             
//               );
//             }

//             return null;
//           })}
//         </div>
//       </InfiniteScroll>
//     </span>
//   );
// }
