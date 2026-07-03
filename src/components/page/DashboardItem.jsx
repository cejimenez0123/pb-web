
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { IonCardHeader, IonCardContent, IonText, IonImg, useIonRouter } from '@ionic/react';
import "../../Dashboard.css";
import {
  deletePageApproval,
  setPageInView,
  createPageApproval,
} from '../../actions/PageActions';
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions';
import { useDispatch, useSelector } from 'react-redux';
import bookmarkfill from "../../images/bookmarkfill.svg";
import bookmarkoutline from "../../images/bookmarkadd.svg";
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import ProfileCircle from '../profile/ProfileCircle';
import Context from '../../context';
import ErrorBoundary from '../../ErrorBoundary';
import { sendGAEvent } from '../../core/ga4';
import ShareList from './ShareList';
import { useParams } from 'react-router';
import { useDialog } from '../../domain/usecases/useDialog';
import computePermissions from '../../core/compusePermissions';
import DataElement from './DataElement';

const theme = {
  card: `
    bg-base-bg 
    dark:bg-base-surface
    border border-border-default 
    dark:border-border-soft
    shadow-sm
  `,
  headerText: `
    text-text-primary 
    dark:text-text-inverse
  `,
  subText: `
    text-text-secondary 
    dark:text-text-secondary
  `,
  contentText: `
    text-text-primary/80 
    dark:text-text-inverse/80
  `,
  softBg: `
    bg-softBlue/40 
    dark:bg-base-soft/20
  `,
  primaryBtn: (active) => `
    px-3 py-1.5 rounded-full text-sm font-medium
    transition active:scale-95
    ${
      active
        ? "bg-button-secondary-bg text-button-secondary-text"
        : "bg-softBlue/40 text-text-primary dark:text-text-inverse"
    }
  `,
  iconBtn: `
    px-3 py-1.5 rounded-full text-sm
    bg-softBlue/30 
    dark:bg-base-soft/20
    text-text-primary 
    dark:text-text-inverse
    transition active:scale-95
  `,
  bookmarkBtn: `
    p-2 rounded-full 
    bg-softBlue/30 
    dark:bg-base-soft/20
    active:bg-softBlue/60 
    dark:active:bg-base-soft/30
    transition
  `,
};

function DashboardItem({ page, isGrid, shortenTo }) {
  const { setSuccess, setError } = useContext(Context);
  const [archive, setArchive] = useState(null);
  const currentProfile = useSelector((state) => state.users.currentProfile);
    const getArchive = () => {
    if (currentProfile?.profileToCollections) {
      let ptc = currentProfile.profileToCollections.find((ptc) => ptc.type === "archive");
      setArchive(ptc?.collection);
    }
  };
  const colInView = useSelector((state) => state.books.collectionInView);
  const dispatch = useDispatch();
  const router = useIonRouter();
  const pathParams = useParams();
  const { openDialog ,resetDialog} = useDialog();

  const [likeFound, setLikeFound] = useState(null);
  const [bookmarked, setBookmarked] = useState(null);

  const { canSee } = computePermissions(page, currentProfile, {
    getAccessList: (s) => s.betaReaders ?? [],
    getAccessRole: (r) => r.permission,
    isPrivate: (s) => s.isPrivate,
    isOpen: () => false,
    canWriteRoles: ["commenter", "editor"],
    canEditRoles: ["editor"],
  });

  const storySource = useMemo(() => {
    const pathname = router.routeInfo?.pathname || "";
    if (pathname.startsWith("/profile")) return "profile_page";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/discovery")) return "discovery";
    if (pathname.startsWith("/collection")) return "collection";
    if (pathname.startsWith("/library")) return "library";
    return "unknown";
  }, [router.routeInfo?.pathname]);

  // Sync like + bookmark state whenever currentProfile loads or changes
  // useEffect(() => {
  //   if (!currentProfile?.id || !page) return;

  //   if (currentProfile.likedStories) {
  //     const found = currentProfile.likedStories.find(
  //       (like) => like?.storyId === page.id
  //     );
  //     setLikeFound(found ?? null);
  //   }

  //   if (currentProfile.profileToCollections) {
  //     // bookmarked = the storyIdList entry (stc) so deleteStc can use stc.id
  //     const homePtc = currentProfile.profileToCollections.find(
  //       (ptc) => ptc?.type === "home"
  //     );
  //     const stc = homePtc?.collection?.storyIdList?.find(
  //       (s) => s.storyId === page.id
  //     );
  //     setBookmarked(stc ?? null);
  //   }
  // }, [currentProfile, page]);
useEffect(() => {
  if (!currentProfile?.id || !page) return;

  if (currentProfile.likedStories) {
    const found = currentProfile.likedStories.find(
      (like) => like?.storyId === page.id
    );
    setLikeFound(found ?? null);
  }

  const bookmarkCollections = currentProfile.profileToCollections || [];

  const archivePtc = bookmarkCollections.find((ptc) => ptc?.type === "archive");
  const archiveStc = archivePtc?.collection?.storyIdList?.find(
    (s) => s.storyId === page.id
  );

  const homePtc = bookmarkCollections.find((ptc) => ptc?.type === "home");
  const homeStc = homePtc?.collection?.storyIdList?.find(
    (s) => s.storyId === page.id
  );

// in the useEffect that sets `bookmarked`:
setBookmarked(
  archiveStc ? { ...archiveStc, collectionId: archivePtc.collectionId }
  : homeStc ? { ...homeStc, collectionId: homePtc.collectionId }
  : null
);
}, [currentProfile, page]);
  // ── Like ──────────────────────────────────────────────────────────────────
  const handleApprovalClick = () => {
    if (!currentProfile) return alert("Please Sign Up to Like");

    if (likeFound) {
      setLikeFound(null);
      dispatch(deletePageApproval({ id: likeFound.id })).then((res) =>
        checkResult(
          res,
          () => sendGAEvent("story_unlike", { story_id: page.id, source: storySource }),
          (err) => console.error(err)
        )
      );
    } else {
      setLikeFound(true);
      dispatch(createPageApproval({ story: page, profile: currentProfile })).then((res) =>
        checkResult(
          res,
          (payload) => {
            sendGAEvent("story_like", { story_id: page.id, source: storySource });
            // Re-sync from the returned profile so likeFound has a real id
            const found = payload.profile?.likedStories?.find(
              (l) => l?.storyId === page.id
            );
            setLikeFound(found ?? true);
          },
          (err) => console.error(err)
        )
      );
    }
  };
  const handleBookmark = (e) => {
  e.preventDefault();
  if (!currentProfile) return setError("Please Sign Up");
  const bookmarkCollections = currentProfile.profileToCollections || [];
  const archivePtc = bookmarkCollections.find((ptc) => ptc?.type === "archive");
  const homePtc = bookmarkCollections.find((ptc) => ptc?.type === "home");

  if (bookmarked) {
    dispatch(deleteStoryFromCollection({ storyId: bookmarked.storyId ||page.id, collectionId: bookmarked.collectionId })).then((res) =>
      checkResult(
        res,
        () => {
          resetDialog()
          setBookmarked(null)
        },
        (err) => setError("Error removing bookmark: " + err.message)
      )
    );
  } else {
    const targetPtc = archivePtc || homePtc;
    if (!targetPtc?.collectionId) return;
    dispatch(
      addStoryListToCollection({
        id: targetPtc.collectionId,
        list: [page],
        profile: currentProfile,
      })
    ).then((res) =>
      checkResult(
        res,
        (payload) => {
          const stc = payload.collection?.storyIdList?.find(
            (s) => s.storyId === page.id
          );
          setBookmarked(stc ? { ...stc, collectionId: targetPtc.collectionId } : null);
          setSuccess("Added Successfully");
          sendGAEvent("story_bookmark", { story_id: page.id, source: storySource });
        },
        () => setError("Error Bookmarking")
      )
    );
  }
};

const handleClickComment = () => {
    if (!page) return;
    sendGAEvent("story_review_open", { story_id: page.id, source: storySource });
    router.push(Paths.page.createRoute(page.id));
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const onClickShare = () => {
    openDialog({
      isOpen: true,
      title: null,
      scrollY: false,
      height: 50,
      text: (
        <ShareList
          page={page}
          profile={currentProfile}
          authorProfile={page.author}
          archive={archive}
          setArchive={setArchive}
          bookmark={bookmarked}
          setBookmarked={setBookmarked}
        />
      ),
      agree: null,
      agreeText: null,
      breakpoint: 0.95,
    });
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (!page) {
    return <span className="skeleton w-[100%] h-[20em]" />;
  }

  if (!canSee) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`mt-3 mx-auto rounded-2xl ${theme.card}`}>
      {/* Header */}
      <IonCardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div onClick={() => router.push(Paths.profile.createRoute(page.author.id))}>
            <ProfileCircle includeUsername={false} profile={page.author} />
          </div>
          <div className="flex flex-col">
            <IonText className={`text-sm font-semibold ${theme.headerText}`}>
              {page.author?.username}
            </IonText>
            <IonText className={`text-xs ${theme.subText}`}>{page.title}</IonText>
          </div>
        </div>
      </IonCardHeader>

      {/* Content */}
      <IonCardContent className="pt-0">
        {page.description && (
          <IonText
            className={`text-sm ${theme.contentText} leading-relaxed line-clamp-3`}
          >
            {page.description}
          </IonText>
        )}
        <div
          className={`mt-3 rounded-2xl overflow-hidden border ${theme.softBg}`}
        >
          <DataElement isGrid={isGrid} shortenTo={shortenTo} page={page} />
        </div>
      </IonCardContent>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={handleApprovalClick} className={theme.primaryBtn(!!likeFound)}>
            Yea
          </button>
          <button onClick={handleClickComment} className={theme.iconBtn}>
            Comment
          </button>
          <button onClick={onClickShare} className={theme.iconBtn}>
            ⤴
          </button>
        </div>

        <button onClick={handleBookmark} className={theme.bookmarkBtn}>
          <IonImg
            className="w-5 h-5"
            src={bookmarked ? bookmarkfill : bookmarkoutline}
          />
        </button>
      </div>
    </div>
  );
}

export default React.memo(DashboardItem);