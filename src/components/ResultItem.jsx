import { useIonRouter } from "@ionic/react";
import styles from "../styles/style";

  
const TYPE_LABELS = {
  story: "Story",
  profile: "Writer",
  collection: "Room",
  hashtag: "Hashtag",
};

  const ResultItem = ({result, index}) => {
    console.log("result" +JSON.stringify(result))
    const item = result?.item ?? {};

const router = useIonRouter()




    const handleResultClick = (result) => {
        if(!result){
            return
        }
    if (!result?.type || !result?.objectID) {
      return;
    }

   result && router.push(
      `/${result?.type}/${result?.objectID}/view`
    );
  };


    const description = result? getItemDescription(
      item,
      result?.type
    ):null

    const author = result? getItemAuthor(
      item,
      result?.type
    ):null
console.log(item)
    const typeLabel = result?
      TYPE_LABELS[result?.type] || result.type:null

    const title = getItemTitle(item)
    return (
      <div
        key={`${result?.objectID}-${index}`}
       className={styles.pageShell.row.outer+" my-2"}
  
        onClick={() => handleResultClick(result)}
        aria-label={`Open ${typeLabel}: ${title}`}
      >
        <div
    
       
        >
          {title}
        </div>

        <div 
        className={styles.text.metadata}
        >
          {typeLabel}
          {author ? ` · ${author}` : ""}
        </div>

        {description && (
          <p className={styles.text.metadata}>
            {description}
          </p>
        )}
      </div>
    );
  }
  export default ResultItem
  

  function getItemDescription(item) {
  return (
    item?.description ||
    item?.story?.description ||
    item?.collection?.purpose ||
    ""
  );
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