// import { useSelector } from "react-redux"
// import DashboardItem from "./DashboardItem"
// import { useContext } from "react"
// import Context from "../../context"
// import { IonInfiniteScroll, IonItem, IonList } from "@ionic/react"
import { IonInfiniteScroll, IonInfiniteScrollContent, IonList } from "@ionic/react";
import DashboardItem from "./DashboardItem";
import { useContext } from "react";
import Context from "../../context";
import BookDashboardItem from "../collection/BookDashboardItem";
import Enviroment from "../../core/Enviroment";

const PageList = ({ items = [], forFeedback, getMore = () => {}, hasMore = true, isGrid }) => {
  // const { isPhone } = useContext(Context);
  // const pagesInView = items.filter(Boolean);

  return (
    <div className="bg-base-surface">
  {/* // <IonList style={{"--background":Enviroment.palette.base.background}}> */}
      {items.map((item, i) => (
        <div className="my-[0.5rem]" >{
        item.authorId?   <DashboardItem
          key={i}
          item={item}
          index={i}
          forFeedback={forFeedback}
          isGrid={isGrid}
          page={item}
        />
      :<BookDashboardItem  book={item}/>}</div>))}
     

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

