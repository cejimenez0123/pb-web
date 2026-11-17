import { useIonRouter } from "@ionic/react";
import styles from "../styles/style";
import truncate from "html-truncate";
import Paths from "../core/paths";
import Enviroment from "../core/Enviroment";

  
const TYPE_LABELS = {
  story: "Story",
  profile: "Writer",
  collection: "Room",
  hashtag: "Hashtag",
};

  const ResultItem = ({result, index,searchScope}) => {
  
    const item = result?.item ?? {};

const router = useIonRouter()




    const handleResultClick = (result) => {
        if(!result){
            return
        }
    if (!result?.type || !result?.objectID) {
      return;
    }
 
    
    let path = ""
    switch(result.type){
      case "story":
      path =  Paths.page.createRoute(result.objectID)
break
      case "profile": path =  Paths.profile.createRoute(result.objectID)
      break;
      case "hashtag": path =  Paths.hashtag.createRoute(result.objectID)
      break;
      case "collection":Paths.collection.createRoute(result.objectID)
      break
    }
   
    router.push(path);
  };



    const author = result? getItemAuthor(
      item,
      result?.type
    ):null

    const typeLabel = result?
      TYPE_LABELS[result?.type] || result.type:null

    const title = getItemTitle(item)
    return (
      <div
        key={`${result?.objectID}-${index}`}
       className={styles.pageShell.row.outer+" border-plumb-blueSea/60        "}
  
        onClick={() => handleResultClick(result)}
        aria-label={`Open ${typeLabel}: ${title}`}
      >
        <div
    
       
        >
          {title}
        </div>

    { <div 
        className={styles.text.metadata}
        >
          {typeLabel}
       {(!(searchScope=="mine") && author) ? ` · ${author}` : ""}
        </div>}

        {/* {description && (
          <p className={styles.text.metadata}>
            {description}
          </p>
        )} */}
      </div>
    );
  }
  export default ResultItem
  

  function getItemDescription(item) {
  return truncate(
    item?.description ||
    item?.story?.description ||
    item?.collection?.purpose ||
    ""
  ,50)
}

function getItemTitle(item) {
  return (
    item?.name ||
    item?.title ||
    item?.username

  );
}
function getItemAuthor(item = {}, type) {
  if (type !== "story") {
    return null;
  }

  return (
    item.authorName ||
    item.authorUsername ||
    item.username ||
    item.author?.username ||
    item.author?.name ||
    null
  );
}