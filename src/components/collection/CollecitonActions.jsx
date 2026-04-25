
import { IonImg, IonSpinner } from "@ionic/react";
import Paths from "../../core/paths";

export default function CollectionActions({
  collection,
  role,
  canUserEdit,
  isBookmarked,
  isArchived,
  isTheArchive, 
  isTheHome,
  bookmarkLoading,
  handleBookmark,
  handleArchive,
  router
}) {
 
return(<div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">

  {/* Dropdown Actions */}
  <div className="dropdown dropdown-end">
    <label
      tabIndex={0}
      className="btn h-10  px-5 rounded-full  dark:bg-base-surfaceDark border-purple border shadow-md border-1 btn bg-purple text-cream hover:bg-cyan-500 flex items-center justify-center gap-2 transition"
    >
      Actions

    </label>
<ul
  tabIndex={0}
  className="dropdown-content z-50 bg-base-bg dark:bg-base-surfaceDark menu p-2 shadow-xl rounded-box w-48 border border-border-default dark:border-white/10"
>
      {/* Bookmark */}
      <li>
        <button
          onClick={handleBookmark}
          className="flex items-center dark:text-cream gap-2 bg-base-bg px-3 py-2 rounded-md w-full text-left"
        >
          {isBookmarked ? "Remove Bookmark" : "Bookmark"}
          {bookmarkLoading && <IonSpinner name="dots" className="ml-auto" />}
        </button>
      </li>

      {/* Archive */}
      {!isTheArchive && (
        <li>
          <button
            onClick={handleArchive}
            className="flex items-center gap-2 dark:text-cream  bg-base-bg  hover:bg-sky-100 px-3 py-2  rounded-md w-full text-left"
          >
            {isArchived ? "Remove Archive" : "Archive"}
          </button>
        </li>
      )}

      {/* Add to Communities */}
      {!isTheHome && (
        <li>
          <button
            onClick={() =>
              router.push(Paths.addStoryToCollection.collection(collection.id))
            }
            className="flex items-center gap-2 px-3 dark:text-cream  bg-base-bg  hover:bg-sky-100 py-2 hover:bg-gray-100 rounded-md w-full text-left"
          >
            Add Collection to ...
          </button>
        </li>
      )}

      {/* Edit */}
      {canUserEdit && collection?.id && (
        <li>
          <button
            onClick={() =>
              router.push(Paths.editCollection.createRoute(collection.id))
            }
            className="flex items-center dark:text-cream  gap-2 px-3 py-2 bg-base-bg  hover:bg-sky-100 rounded-md w-full text-left"
          >
            Edit
          </button>
        </li>
      )}
    </ul>
  </div>
</div>)
}
