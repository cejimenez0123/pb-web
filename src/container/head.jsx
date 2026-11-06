import { useIonRouter } from "@ionic/react";
import ProfileCircle from "../components/profile/ProfileCircle";
import styles from "../styles/style";

function PlumbHead({isWorkshop=null,buttons=[],label=null,onClick,title="Untitled",backText="Rooms",type,purpose="",isPrivate=false,profile=null}){
    const router = useIonRouter()
    return( <section className={styles.pageShell.head}>
          <div className={`w-full max-w-[52rem] mt-4 mx-auto px-4 sm:px-6 lg:px-8" pt-10 pb-8 sm:pt-14`}>
            <button
              
                onClick={onClick}
              
            >
              <span aria-hidden="true" className="text-plumb-ink dark:text-plumb-darkText">←</span>
              <span className="mx-2 text-plumb-ink dark:text-plumb-darkText">{backText}</span>
            </button>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-soft">
                  {label}
                </p>

            <div className="max-w-3xl  ">

              <div className="mb-4 flex flex-wrap items-center gap-2">
                {isWorkshop && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      bg-softBlue
                      px-3 py-1
                      text-xs font-medium
                      text-text-primary
                    "
                  >
                    Workshop
                  </span>
                )}

                {type && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      border border-card-border
                      px-3 py-1
                    mt-1
                      text-xs font-medium
                      text-text-secondary
                      dark:border-white/10
                      dark:text-gray-300
                    "
                  >
                    {formatRoomType(type)}
                  </span>
                )}

                {isPrivate && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      border border-card-border
                      px-3 py-1
                      text-xs
                      text-text-secondary
                      dark:border-white/10
                      dark:text-gray-300
                    "
                  >
                    Private
                  </span>
                )}
              </div>

              <h1
                className="
                  font-serif
                  text-4xl
                  leading-[1.05]
                  tracking-tight
                  text-text-primary
                  dark:text-cream
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {title || "Untitled Room"}
              </h1>

              {purpose && (
                <p
                  className="
                    mt-5
                    max-w-2xl
                    text-base
                    leading-relaxed
                    text-text-secondary
                    dark:text-gray-300
                    sm:text-lg
                  "
                >
                  {purpose}
                </p>
              )}

              {/* Creator */}

              {profile && (
                <div className="mt-7 flex items-center gap-3">
                 {profile && <ProfileCircle
                    profile={profile}
                    includeUsername={true}
                  />}
                </div>
              )}
            </div>
          </div>
          <div className="flex my-4 flex-wrap px-2 gap-2">
            {buttons.map(button=>button)}
          </div>
        </section>)
}
export default PlumbHead

function formatRoomType(type) {
  if (!type) return "";

  const labels = {
    book: "Book",
    library: "Library",
    feedback: "Feedback",
    home: "Home",
    archive: "Archive",
  };

  return (
    labels[type] ||
    String(type)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}