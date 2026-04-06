import React from "react";
import { IonImg, IonSpinner } from "@ionic/react";
import bookmarkOutline from "../../images/bookmark_add.svg";
import bookmarkFill from "../../images/bookmark_fill_green.svg";
import archive from "../../images/icons/archive.svg";
import edit from "../../images/icons/edit.svg";
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
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">


      {/* Dropdown Actions */}
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn h-12 rounded-full bg-blueSea text-white hover:bg-cyan-200 flex items-center justify-center gap-2"
        >
          <div className="flex flex-row">
            <h6>Actions</h6>
            <svg
              className="max=w-4 max-h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-bg rounded-box w-40"
        >
          {/* Bookmark */}
          <li>
            <button onClick={handleBookmark} className="flex items-center gap-2">
              {isBookmarked ? "Remove Bookmark" : "Bookmark"}
              {bookmarkLoading && <IonSpinner name="dots" />}
            </button>
          </li>

          {/* Archive */}
          {!isTheArchive &&<li>
            <button onClick={handleArchive} className="flex items-center gap-2">
              {isArchived ? "Remove Archive" : "Archive"}
            </button>
          </li>}

          {/* Add to Communities */}
          {!isTheHome &&<li>
            <button
              onClick={() =>
                router.push(Paths.addStoryToCollection.collection(collection.id))
              }
              className="flex items-center gap-2"
            >
              Add to Communities
            </button>
          </li>}

          {/* Edit (only if user can edit) */}
          {canUserEdit && collection?.id && (
            <li>
              <button
                onClick={() =>
                  router.push(Paths.editCollection.createRoute(collection.id))
                }
                className="flex items-center gap-2"
              >
                Edit
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}