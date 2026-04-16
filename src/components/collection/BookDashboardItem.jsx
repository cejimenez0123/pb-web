import { useContext,useEffect,useLayoutEffect, useRef, useState } from 'react'
import "../../Dashboard.css"
import {useDispatch} from 'react-redux'
import bookmarkfill from "../../images/bookmarkfill.svg"
import bookmarkoutline from "../../images/bookmarkadd.svg"
import checkResult from '../../core/checkResult'
// import Paths from '../../core/paths'

import { IonImg, useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import ProfileCircle from "../profile/ProfileCircle";
import Context from '../../context'
import { useSelector } from 'react-redux'
import debounce from '../../core/debounce'
import Carousel from './Carousel'



function BookDashboardItem({ book, isGrid }) {
  const dispatch = useDispatch();
  const {currentProfile}=useSelector(state=>state.users)
  const { setError } = useContext(Context);
  const router = useIonRouter();

  const [bookmarked, setBookmarked] = useState();

  useLayoutEffect(() => {
    if (currentProfile?.profileToCollections) {
      let archive = currentProfile.profileToCollections.find(
        (col) => col.type === "archive"
      );

      if (book?.parentCollections) {
        let found = book.parentCollections.find(
          (ptc) => ptc.parentCollectionId == archive?.collection?.id
        );
        setBookmarked(found);
      }
    }
  }, [book, currentProfile]);

  const handleBookmark = debounce((e) => {
    e.stopPropagation();

    if (!currentProfile) return setError("Please Login");

    if (bookmarked) {
      dispatch(deleteCollectionFromCollection({ tcId: bookmarked.id }))
        .then(() => setBookmarked(null));
    } else {
      let archive = currentProfile.profileToCollections.find(
        (col) => col.type === "archive"
      )?.collection;

      if (!archive) return setError("Missing archive");

      dispatch(
        addCollectionListToCollection({
          id: archive.id,
          list: [book.id],
          profile: currentProfile,
        })
      ).then((res) =>
        checkResult(res, (payload) => {
          const marked = payload.collection.parentCollections.find(
            (col) => col.parentCollectionId == archive.id
          );
          setBookmarked(marked);
        })
      );
    }
  }, 10);

  if (!book) {
    return (
      <div className="min-w-[16rem] h-[14rem] rounded-2xl bg-gray-100 animate-pulse" />
    );
  }

  return (
    <div
      onClick={() => router.push(Paths.collection.createRoute(book.id))}
      className="
        min-w-[16rem]
        rounded-2xl
        bg-base-bg
        border border-blue
        shadow-sm
        overflow-hidden
        active:scale-[0.97]
        transition-all duration-200
      "
    >
      {/* 🔹 Carousel (Hero) */}
    <div className="relative w-full  h-fit overflow-hidden">
  <Carousel book={book} compact={true} />

        {/* Bookmark floating (iOS style) */}
        <button
          onClick={handleBookmark}
          className="
            absolute top-3 right-3
            p-2 rounded-full
            bg-base-bg/80 backdrop-blur
            shadow-sm
            active:scale-90
            transition
          "
        >
          <IonImg
            className="w-4 h-4"
            src={bookmarked ? bookmarkfill : bookmarkoutline}
          />
        </button>
      </div>

      {/* 🔹 Content */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h4 className="text-sm font-semibold text-[#003b44] truncate">
          {book.title || "Untitled"}
        </h4>

        {/* Purpose (description) */}
        {book.description && (
          <p className="text-xs text-[#003b44]/70 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <ProfileCircle profile={book.profile} includeUsername={false} />

          <span className="text-[0.7rem] text-[#003b44]/60">
            {book.storyIdList?.length || 0} items
          </span>
        </div>
      </div>
    </div>
  );
}
export default BookDashboardItem

