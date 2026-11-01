

import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IonImg, useIonRouter } from "@ionic/react";
import { debounce } from "lodash";

import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import ProfileCircle from "../profile/ProfileCircle";
import Carousel from "./Carousel";

import {
  deleteCollectionFromCollection,
  addCollectionListToCollection,
} from "../../actions/CollectionActions";

import ErrorBoundary from "../../ErrorBoundary";
import { useAlert } from "../../core/useAlert";
import AlertType from "../../core/AlertType";
import styles from "../../styles/style";

function BookDashboardItem({ book }) {
  const dispatch = useDispatch();

  const { currentProfile } = useSelector(
    (state) => state.users
  );

  const { showAlert } = useAlert();
  const router = useIonRouter();

  const [bookmarked, setBookmarked] = useState(null);

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
          ptc.parentCollectionId === archive?.collection?.id
      );

    setBookmarked(found || null);
  }, [book, currentProfile]);

  /*
   * -------------------------------------------------------------------------
   * NAVIGATION
   * -------------------------------------------------------------------------
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
                col.parentCollectionId === archive.id
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
    return <div className={styles.dashboardItem.skeleton} />;
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
        className={styles.dashboardItem.card}
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* HEADER */}
        <header className={styles.dashboardItem.header}>
          <div className="flex flex-row w-[100%] items-start justify-between gap-4">

            {/* Author / owner */}
            <div
              className={styles.dashboardItem.author}
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
                <p className={styles.dashboardItem.authorName}>
                  {book.profile?.username}
                </p>

                <p className={styles.dashboardItem.authorType}>
                  {typeLabel}
                </p>
              </div>
            </div>

            {/* Bookmark */}
            <button
              type="button"
              onClick={handleBookmark}
              className={styles.dashboardItem.bookmark}
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
        </header>

        {/* TITLE */}
        <div className={styles.dashboardItem.titleContent}>
          <h2 className={styles.dashboardItem.title}>
            {book.title || "Untitled"}
          </h2>

          {book.description && (
            <p className={styles.dashboardItem.description}>
              {book.description}
            </p>
          )}
        </div>

        {/* STORIES */}
        {book.storyIdList?.some(
          (stc) => stc?.story?.data
        ) && (
          <div className={styles.dashboardItem.stories}>
            <div
              className={styles.dashboardItem.storyWindow}
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

        {/* FOOTER */}
        <div className={styles.dashboardItem.footer}>
          <div className="flex items-center gap-3">
            <span className={styles.dashboardItem.metadata}>
              {itemCount} {itemLabel}
            </span>

            <span
              aria-hidden="true"
              className={styles.dashboardItem.separator}
            >
              ·
            </span>

            <span className={styles.dashboardItem.metadata}>
              {typeLabel}
            </span>
          </div>

          <span
            aria-hidden="true"
            className={styles.dashboardItem.arrow}
          >
            →
          </span>
        </div>
      </article>
    </ErrorBoundary>
  );
}

export default BookDashboardItem;