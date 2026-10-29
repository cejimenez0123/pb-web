import Paths from "../../core/paths";
import styles from "../../styles/style";
import ListPill from "./ListPill";

const PageProfileList = ({ items,type, router }) => (
    <div className="space-y-2">
    {items.map((p) => (

       <button
                        
                        type="button"
                      onClick={()=>router.push(Paths.page.createRoute(p.id))} 
                        // onClick={() =>
                        //   router.push(
                        //     Paths.collection.createRoute(collection.id)
                        //   )
                        // }
                        className={styles.profile.listItem}
                      >
                        <div className="text-left mx-4">
                        {p.title ||
                                  "Untitled"}
                     </div>
                      </button>
      // <ListPill item={p} onClick={()=>router.push(Paths.page.createRoute(p.id))} type={type}/>

    ))}
  </div>
);

export default PageProfileList