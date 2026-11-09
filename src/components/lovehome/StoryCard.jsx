import truncate from "html-truncate";
import styles from "../../styles/style";

function StoryCard({
  story,
  view,
  onSelect,
}) {
  const isGrid = view === "grid";
function formatDate(date) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}
const description =truncate(story.description, Math.floor(300), {
      ellipsis: "…",
    })

            // ${
        //   isGrid
        //     ? `
            
        //       rounded-2xl
        //       border
        //       border-plumb-mint/40
           
        //       p-6
        //       sm:p-7
        //       hover:-translate-y-1
        //       hover:border-plumb-mint/80
          
        //     `
        //     : `
        //       rounded-2xl
        //       border
        //       border-plumb-mint/30
        //       bg-cream/45
        //       px-6
        //       py-5
        //       sm:px-7
        //       hover:border-plumb-mint/80
        //       hover:bg-base-bg
        //     `
        // // }
  return (
    <div
      type="button"
      onClick={() => onSelect(story)}
      className={styles.hash.card+
        ` 

justify-between
        dark:bg-base-bg
        dark:hover:bg-base-bgDark/70
      `}
    >

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {story.status && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/55 dark:text-cream/50">
                {formatStatus(story.status)}
              </span>
            )}

            {story.isPrivate && (
              <span className="text-[0.68rem] uppercase tracking-[0.12em] text-soft/40 dark:text-cream/40">
                Private
              </span>
            )}
          </div>

          <h3
            className={`
              mt-3
              truncate
              font-serif
              font-bold
              leading-tight
              text-soft
              dark:text-cream
              ${
               
                   "text-lg sm:text-xl"
              }
            `}
          >
            {story.title || "Untitled"}
          </h3>
<div className="   min-h-[6em]    sm:min-h-[8em]">
          {story.description && (
            <p
              className={`
        
                mt-2
                font-serif
                leading-relaxed
                text-soft/55
                dark:text-cream/55
              
                    hidden max-w-xl text-sm sm:block"
                
              `}
            >
          {description}
         
            </p>
          )}
          </div>
        </div>

        <div
          className={
           
               "shrink-0 items-center "
          }
        >
          <span className="text-xs text-soft/45 dark:text-cream/40">
            {formatDate(story.updated || story.created)}
          </span>

          <span
            aria-hidden="true"
            className="
              text-xl
              text-soft/45
              transition-transform
              duration-200
              group-hover:translate-x-1
              group-hover:text-soft
              dark:text-cream/40
              dark:group-hover:text-cream
            "
          >
            →
          </span>
        </div>
     
    </div>
  );
}

export default StoryCard
function formatStatus(status) {
  const labels = {
    draft: "Draft",
    fragment: "Fragment",
    workshop: "Workshop",
    finished: "Published",
  };

  return labels[status] || status;
}