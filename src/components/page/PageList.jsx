
import { IonInfiniteScroll, IonInfiniteScrollContent, IonList } from "@ionic/react";
import DashboardItem from "./DashboardItem";
import BookDashboardItem from "../collection/BookDashboardItem";
import {motion} from "framer-motion"
const PageList = ({ items = [], forFeedback, getMore = () => {}, hasMore = true, isGrid }) => {

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 🔥 key for smooth loading
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
  return (
    <div className="bg-base-surface dark:bg-base-bgDark">
  {/* // <IonList style={{"--background":Enviroment.palette.base.background}}> */}
    <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
      {items.map((item, i) =>( <motion.div key={item.id} variants={itemVariants}>
    
        <div className="my-[0.5rem]" >{
        item.authorId?   <DashboardItem
          key={i}
          item={item}
          index={i}
          forFeedback={forFeedback}
          isGrid={isGrid}
          page={item}
        />
      :<BookDashboardItem  book={item}/>}</div> </motion.div>))}
     
</motion.div>
      <IonInfiniteScroll
        threshold="200px"
        disabled={!hasMore}
        onIonInfinite={async (e) => {
          await getMore();
          e.target.complete();
        }}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more..."
        />
      </IonInfiniteScroll>
  </div>
  );
};

export default PageList;

