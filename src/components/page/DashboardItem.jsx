
import React,{ useContext, useEffect, useLayoutEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonText,IonImg, useIonRouter } from '@ionic/react';
import "../../Dashboard.css";
import {
  deletePageApproval,
  setPageInView,
  setPagesInView,
  createPageApproval,
 
} from '../../actions/PageActions';
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import { useDispatch, useSelector } from 'react-redux';

import addCircle from "../../images/icons/add_circle.svg";
import bookmarkfill from "../../images/bookmarkfill.svg";
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import bookmarkoutline from "../../images/bookmarkadd.svg";
import PageDataElement from './PageDataElement';
import ProfileCircle from '../profile/ProfileCircle';
import Context from '../../context';
import Enviroment from '../../core/Enviroment';
import ErrorBoundary from '../../ErrorBoundary';
import { debounce, set } from 'lodash';
import { sendGAEvent } from '../../core/ga4';
import ShareList from './ShareList';
import { useParams } from 'react-router';
import { useDialog } from '../../domain/usecases/useDialog';
import computePermissions from '../../core/compusePermissions';
function DashboardItem({ page, book, isGrid }) {
  const { isPhone, isHorizPhone, setSuccess, setError} = useContext(Context);
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dialog = useSelector(state=>state.users.dialog)
    const router = useIonRouter()
  const pathParams = useParams()
const {canSee,canAdd,canEdit,role}= computePermissions(page,currentProfile, {
  getAccessList: (s) => s.betaReaders??[],
  getAccessRole: (r) => r.permission,
  isPrivate: (s) => s.isPrivate,
  isOpen: () => false, // stories usually not open collab
  canWriteRoles: ["commenter", "editor"],
  canEditRoles: ["editor"],
});
  
  const pagesInView = useSelector((state) => state.pages.pagesInView);
  const colInView = useSelector((state) => state.books.collectionInView);
  const [likeFound, setLikeFound] = useState(false);
  const [bookmarked, setBookmarked] = useState();
  const [archiveCol,setArchiveCol]=useState(null)
const {openDialog,closeDialog}=useDialog()

  // const widthSize = adjustScreenSize(isGrid, true, "", " pt-1 pb-2 ", "", "", "", "");
 const getStorySource = () => {
  const pathname = router.routeInfo?.pathname || "";

  if (pathname.startsWith("/profile")) return "profile_page";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/discovery")) return "discovery";
  if (pathname.startsWith("/collection")) return "collection";
  if (pathname.startsWith("/library")) return "library";

  return "unknown";
};

  const addStoryToCollection = () => {
    if (page) {
      const list = [page];
      if (
      router.routeInfo.pathname.includes("collection") &&
        pathParams.id &&
        colInView.id === pathParams.id
      )
        dispatch(addStoryListToCollection({ id: colInView.id, list: list, profile: currentProfile }))
          .then(res => {
            checkResult(
              res,
              payload => {
                let pages = pagesInView;
                let index = pages.findIndex(page => page === Enviroment.blankPage);
                let stories = payload.collection.storyIdList.map(sTc => sTc.story);
                let back = pages.slice(index, pages.length).filter(page => {
                  return !stories.find(story => story && page && story.id && page.id && story.id === page.id);
                });
                dispatch(setPagesInView({ pages: [...stories, ...back] }));
                setSuccess("Added");
              },
              err => {
                if (err.message) {
                  setError("Error Adding Story to Collection " + err.message);
                }
              }
            );
          });
    }
  };



  const checkLike = (profile) => {
    if ( profile &&profile.id && page) {
      if (profile.likedStories) {
        let found = profile.likedStories.find(like => like && like.storyId === page.id);
        setLikeFound(found);
      }
      if (profile.profileToCollections) {
        let marked = profile.profileToCollections.find(
          ptc => 
            ptc && ptc.type === "archive" && ptc.collection && ptc.collection.storyIdList && ptc.collection.storyIdList.find(stc => stc.storyId === page.id)
        );
        setBookmarked(marked);
      }
    }
  };

  const deleteStc = () => {
    if (bookmarked && bookmarked.id) {

      dispatch(deleteStoryFromCollection({ stId: bookmarked.id })).then(res => {
        checkResult(
          res,
          payload => {
            setBookmarked(null);
            setLoading(false);
          },
          err => {
            if (err.message) {
              setError("Error deleting bookmark " + err.message);
            }
          }
        );
      });
    }
  };

  const handleClickComment = () => {
    if (page) {
sendGAEvent("story_review_open", {
  story_id: page.id,
  source: getStorySource(),
});

      router.push(Paths.page.createRoute(page.id));
    }
  };

  const header = () => {
    return (
      <span
        className={`flex-row flex justify-between  px-2  rounded-t-lg pt-2 pb-2`}>
        <div onClick={()=>router.push(Paths.profile.createRoute(page.author.id))}><ProfileCircle isGrid={isGrid} color={"emerald-700"} profile={page.author} /></div>
        {!isGrid ?
          <h6
            className={
              `text-emerald-800 mx-2 no-underline pt-2 text-ellipsis text-emerald-700 whitespace-nowrap overflow-hidden ${isGrid ? "text-[0.7rem] " : "text-[0.9rem]"}`
            }
            onClick={() => {
              dispatch(setPageInView({ page }));
              router.push(Paths.page.createRoute(page.id));
            }}>
            {` ` + (page.title?.length > 0 ? page.title : "")}
          </h6>
          : null}
      </span>
    );
  };
  const handleApprovalClick = () => {
    if(!currentProfile){
      return alert("Please Sign Up to Like")
    }
  if (likeFound) {
    setLikeFound(false); // update immediately
    dispatch(deletePageApproval({ id: likeFound.id }))
      .then(res => checkResult(res, () => {
        setLikeFound(null);
        sendGAEvent("story_unlike" ,{
  story_id: page.id,
  source: getStorySource(),
});

      }, err => console.error(err)));
  } else {
    setLikeFound(true); // update immediately
    const params = { story: page, profile: currentProfile };
    dispatch(createPageApproval(params))
      .then(res => checkResult(res, (payload) => {
sendGAEvent( "story_like", {
  story_id: page.id,
  source: getStorySource(),
});

        const {profile} = payload;
        checkLike(profile);
      }, err => console.error(err)));
  }
};
useEffect(() => {
    checkLike(currentProfile);
}, []); 


  const onClickShare = () => {
openDialog({
    isOpen: true,
    title: null,
    scrollY:false,
    height:50,
    text: (
      <ShareList
        page={page}
        profile={currentProfile}
        archive={archiveCol}
        bookmark={bookmarked}
        setArchive={setArchiveCol}
        setBookmarked={setBookmarked}
      />
    ),
    agree: null,
    agreeText: null,
   
    breakpoint: .95
  })
};




  const onBookmarkPage = () => {
    if (currentProfile && currentProfile.profileToCollections) {
      setLoading(true);
      let ptc = currentProfile.profileToCollections.find(ptc => ptc.type === "archive");
      ptc && ptc.collection && setArchiveCol(ptc.collection)
      if (ptc && ptc.collectionId && page && page.id) {
        dispatch(addStoryListToCollection({
          id: ptc.collectionId,
          list: [page],
          profile: currentProfile
        })).then(res => {
          checkResult(res, payload => {
            const { collection } = payload;
            let stc = collection.storyIdList.find(stc => stc.storyId === page.id);
            setBookmarked(stc);
            setSuccess("Added Successfully");
            setLoading(false);
            sendGAEvent("story_bookmark", {
  story_id: page.id,
  source: getStorySource(),
});

          }, err => {
            setBookmarked(null);
            setError("Error Bookmarking");
            setLoading(false);
            
          });
        });
      }
    }
  };

  

  let bookTitleDiv = null;
  if (book) {
    let title = book?.title.length > 30 ? book?.title.slice(0, 30) + "..." : book?.title;
    bookTitleDiv = (
      <a onClick={() => { router.push(Paths.collection.createRoute(book.id)); }}>
        <p>{title} {">"}</p>
      </a>
    );
  }

  const bookmarkBtn = () => {
    return isGrid ? (
      <div className={`bg-emerald-100 flex flex-row justify-between  text-emerald-700`}>
        {isPhone ? null : <ProfileCircle isGrid={isGrid} includeUsername={false} profile={page.author} color='emerald-700' />}
        <span >
          <h6 className={`text-emerald-700 ${isGrid ? isPhone ? "" : " text-right " : isHorizPhone ? "" : ""}${isPhone ? " text-[0.6rem] " : "text-[0.9rem]  w-[10rem] ml-1 pr-2"}   whitespace-nowrap  no-underline text-ellipsis  overflow-hidden  my-auto `}
            onClick={() => {
              sendGAEvent("story_open", {
  story_id: page.id,
  source: getStorySource(),
  author_id: page.authorId,
});
              
              router.push(Paths.page.createRoute(page.id));
            }}>
            {` ` + (page.title?.length > 0 ? page.title : "")}
          </h6>
          <IonImg onClick={handleBookmark} className='text-white' src={bookmarked ? bookmarkfill : bookmarkoutline} />
        </span>
      </div>
    ) : null;
  };

  const handleBookmark = debounce((e) => {
    if (currentProfile) {
      e.preventDefault();
      if (bookmarked) {
        
        deleteStc();
      } else {
        onBookmarkPage();
      }
    } else {
      setError("Please Sign Up");
    }
  }, 10);


  
  if (!page) {
    return (
      <span className={ " skeleton w-[100%] h-[20em]"} />
    );
  }


return (
  <div className="mt-3 mx-auto bg-base-bg rounded-2xl border border-blue shadow-sm">

    {/* Header */}
    <IonCardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <div onClick={() => router.push(Paths.profile.createRoute(page.author.id))}>
          <ProfileCircle includeUsername={false} profile={page.author} />
        </div>

        <div className="flex flex-col">
          <IonText className="text-sm font-semibold text-[#003b44]">
            {page.author?.username}
          </IonText>
          <IonText className="text-xs text-[#0097b2]/70">
            {page.title}
          </IonText>
        </div>
      </div>
    </IonCardHeader>

    {/* Content */}
    <IonCardContent className="pt-0">
      {page.description && (
        <IonText className="text-sm text-[#003b44]/80 leading-relaxed line-clamp-3">
          {page.description}
        </IonText>
      )}

      <div className="mt-3 rounded-xl overflow-hidden border border-[#bae6fe]/30">
        <PageDataElement truncateNumber={200}isGrid={isGrid} page={page} />
      </div>
    </IonCardContent>
<div className="flex items-center justify-between px-4 pb-3">

  {/* Left actions */}
  <div className="flex items-center gap-3">

    {/* Like */}
    <button
      onClick={handleApprovalClick}
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium
        transition active:scale-95
        ${likeFound 
          ? "bg-[#0097b2] text-white" 
          : "bg-[#bae6fe]/40 text-[#003b44]"
        }
      `}
    >
      Yea
    </button>

    {/* Comment */}
    <button
      onClick={handleClickComment}
      className="
        px-3 py-1.5 rounded-full text-sm
        bg-[#bae6fe]/30 text-[#003b44]
        transition active:scale-95
      "
    >
      💬
    </button>

    {/* Share */}
    <button
      onClick={onClickShare}
      className="
        px-3 py-1.5 rounded-full text-sm
        bg-[#bae6fe]/30 text-[#003b44]
        transition active:scale-95
      "
    >
      ⤴
    </button>
  </div>

  {/* Bookmark */}
  <button
    onClick={handleBookmark}
    className="
      p-2 rounded-full 
      bg-[#bae6fe]/30 
      active:bg-[#bae6fe]/60 
      transition
    "
  >
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
