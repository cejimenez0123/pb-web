import { useContext, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonImg, useIonRouter } from "@ionic/react";

import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import ProfileCircle from "../profile/ProfileCircle";
import { debounce } from "lodash";

import Carousel from "./Carousel";

import {
  deleteCollectionFromCollection,
  addCollectionListToCollection,
} from "../../actions/CollectionActions";

import ErrorBoundary from "../../ErrorBoundary";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";

const theme = {
  card: `
    bg-base-bg dark:bg-base-surface
    border border-border-default dark:border-border-soft
  `,

  primary: `
    text-text-primary dark:text-text-inverse
  `,

  secondary: `
    text-text-secondary dark:text-text-secondary
  `,

  accent: `
    bg-soft/15
    border-soft/30
    dark:bg-base-soft/15
    dark:border-base-soft/25
  `,

  bookmark: `
    flex h-9 w-9 items-center justify-center
    rounded-full
    bg-soft/15
    transition
    hover:bg-soft/25
    active:scale-90
    dark:bg-base-soft/15
    dark:hover:bg-base-soft/25
  `,
};

function BookDashboardItem({ book }) {
  const dispatch = useDispatch();

  const { currentProfile } = useSelector(
    (state) => state.users
  );

  const { showAlert } = useAlert();
  const router = useIonRouter();

  const [bookmarked, setBookmarked] =
    useState(null);

  /*
   * -------------------------------------------------------------------------
   * BOOKMARK STATE
   * -------------------------------------------------------------------------
   */
  useLayoutEffect(() => {
    if (
      !currentProfile?.profileToCollections ||
      !book?.parentCollections
    ) {
      return;
    }

    const archive =
      currentProfile.profileToCollections.find(
        (col) => col.type === "home"
      );

    const found =
      book.parentCollections.find(
        (ptc) =>
          ptc.parentCollectionId ==
          archive?.collection?.id
      );

    setBookmarked(found || null);
  }, [book, currentProfile]);

  /*
   * -------------------------------------------------------------------------
   * NAVIGATION
   * -------------------------------------------------------------------------
   *
   * A BookDashboardItem is a doorway.
   *
   * The entire card enters the book/collection.
   */
  const handleOpen = () => {
    if (!book?.id) {
      return;
    }

    router.push(
      Paths.collection.createRoute(book.id),
      "forward"
    );
  };

  /*
   * -------------------------------------------------------------------------
   * BOOKMARK
   * -------------------------------------------------------------------------
   */
  const handleBookmark = debounce((event) => {
    event?.stopPropagation();

    if (!currentProfile) {
      return showAlert({
        message: "Please Login",
        type: AlertType.error,
      });
    }

    /*
     * Remove bookmark.
     */
    if (bookmarked) {
      dispatch(
        deleteCollectionFromCollection({
          tcId: bookmarked.id,
        })
      ).then(() => {
        setBookmarked(null);
      });

      return;
    }

    /*
     * Add to home.
     */
    const archive =
      currentProfile.profileToCollections.find(
        (col) => col.type === "home"
      )?.collection;

    if (!archive) {
      return showAlert({
        message: "Missing archive",
        type: AlertType.error,
      });
    }

    dispatch(
      addCollectionListToCollection({
        id: archive.id,
        list: [book.id],
        profile: currentProfile,
      })
    ).then((res) =>
      checkResult(
        res,
        (payload) => {
          const marked =
            payload.collection.parentCollections.find(
              (col) =>
                col.parentCollectionId ==
                archive.id
            );

          setBookmarked(marked);
        }
      )
    );
  }, 10);

  /*
   * -------------------------------------------------------------------------
   * LOADING
   * -------------------------------------------------------------------------
   */
  if (!book) {
    return (
      <div className="h-[20em] w-[100%] animate-pulse rounded-2xl bg-base-soft/10" />
    );
  }

  const itemCount =
    book.storyIdList?.length || 0;

  const itemLabel =
    itemCount === 1 ? "item" : "items";

  const typeLabel =
    book.type === "library"
      ? "Room"
      : "Collection";

  return (
    <ErrorBoundary>
      <article
        onClick={handleOpen}
        className={`
          group
          w-[100%]
          cursor-pointer
          select-none
          overflow-hidden
          rounded-3xl
          ${theme.card}
          transition-all
          duration-200
          active:scale-[0.985]
          md:hover:-translate-y-0.5
          md:hover:shadow-md
        `}
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-5 pb-3 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start justify-between gap-4">
            {/* Author / owner */}
            <div
              className="flex min-w-0 items-center gap-3"
              onClick={(event) => {
                event.stopPropagation();

                if (book.profile?.id) {
                  router.push(
                    Paths.profile.createRoute(
                      book.profile.id
                    ),
                    "forward"
                  );
                }
              }}
            >
              <ProfileCircle
                includeUsername={false}
                profile={book.profile}
              />

              <div className="min-w-0">
                <p
                  className={`
                    truncate text-sm font-medium
                    ${theme.primary}
                  `}
                >
                  {book.profile?.username}
                </p>

                <p
                  className={`
                    mt-0.5 text-xs
                    ${theme.secondary}
                  `}
                >
                  {typeLabel}
                </p>
              </div>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={handleBookmark}
              className={theme.bookmark}
              aria-label={
                bookmarked
                  ? "Remove bookmark"
                  : "Bookmark"
              }
            >
              <IonImg
                className="h-5 w-5"
                src={
                  bookmarked
                    ? bookmarkfill
                    : bookmarkoutline
                }
              />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* TITLE                                                            */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-5 pb-5 sm:px-6">
          <h2
            className={`
              font-serif
              text-[1.55rem]
              font-medium
              leading-[1.08]
              tracking-[-0.015em]
              ${theme.primary}
              transition-colors
              group-hover:text-text-brand
            `}
          >
            {book.title || "Untitled"}
          </h2>

          {book.description && (
            <p
              className={`
                mt-3
                max-w-2xl
                text-sm
                leading-6
                ${theme.secondary}
              `}
            >
              {book.description}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* STORIES — A WINDOW INTO THE COLLECTION                          */}
        {/* ---------------------------------------------------------------- */}
        {book.storyIdList?.some(
          (stc) => stc?.story?.data
        ) && (
          <div className="px-4 pb-4 sm:px-5">
            <div
              className={`
                overflow-hidden
                rounded-2xl
                border
                ${theme.accent}
              `}
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <Carousel
                book={book}
                compact={true}
              />
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* FOOTER                                                           */}
        {/* ---------------------------------------------------------------- */}
        <div
          className={`
            flex
            items-center
            justify-between
            border-t
            border-border-default
            px-5
            py-4
            sm:px-6
          `}
        >
          <div className="flex items-center gap-3">
            <span
              className={`
                text-xs
                ${theme.secondary}
              `}
            >
              {itemCount} {itemLabel}
            </span>

            <span
              aria-hidden="true"
              className="text-xs text-text-secondary/40"
            >
              ·
            </span>

            <span
              className={`
                text-xs
                ${theme.secondary}
              `}
            >
              {typeLabel}
            </span>
          </div>

          <span
            aria-hidden="true"
            className={`
              text-lg
              ${theme.secondary}
              transition-transform
              duration-200
              group-hover:translate-x-1
            `}
          >
            →
          </span>
        </div>
      </article>
    </ErrorBoundary>
  );
}

export default BookDashboardItem;