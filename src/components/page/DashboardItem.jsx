
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
import adjustScreenSize from '../../core/adjustScreenSize';
import ShareList from './ShareList';
import { setDialog } from '../../actions/UserActions';
function DashboardItem({ page, book, isGrid }) {
  const { isPhone, isHorizPhone, setSuccess, setError} = useContext(Context);
  const currentProfile = useSelector(state=>state.users.currentProfile)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const dialog = useSelector(state=>state.users.dialog)
    const router = useIonRouter()
  const pathParams = router.routeInfo.params

  const [canUserEdit, setCanUserEdit] = useState(false);
  const pagesInView = useSelector((state) => state.pages.pagesInView);
  const colInView = useSelector((state) => state.books.collectionInView);
  const [likeFound, setLikeFound] = useState(false);
  const [bookmarked, setBookmarked] = useState();
  const [archiveCol,setArchiveCol]=useState(null)


  const widthSize = adjustScreenSize(isGrid, true, "", " pt-1 pb-2 ", "", "", "", "");
 
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

  const soCanUserEdit = () => {
    if (currentProfile && currentProfile.id && page && page.authorId === currentProfile.id) {
      setCanUserEdit(true);
      return;
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
      setLoading(true);
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
      sendGAEvent(
        `Click to Review`,
        `Click Review ${JSON.stringify({ id: page.id, title: page.title })}`,
        "Review",
        0,
        false
      );
      router.push(Paths.page.createRoute(page.id));
    }
  };

  const header = () => {
    return (
      <span
        className={`flex-row flex justify-between  px-1 rounded-t-lg pt-2 pb-1`}>
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
  if (!page || !currentProfile) {
    setError("Please Sign Up");
    return;
  }

  if (likeFound) {
    setLikeFound(false); // update immediately
    dispatch(deletePageApproval({ id: likeFound.id }))
      .then(res => checkResult(res, () => {
        setLikeFound(null);
      }, err => console.error(err)));
  } else {
    setLikeFound(true); // update immediately
    const params = { story: page, profile: currentProfile };
    dispatch(createPageApproval(params))
      .then(res => checkResult(res, (payload) => {

        const {profile} = payload;
        checkLike(profile);
      }, err => console.error(err)));
  }
};
useEffect(() => {
    checkLike(currentProfile);
}, []); 


  
  const onClickShare=()=>{
    let dia = {...dialog}
    dia.text = <ShareList page={page} setArchive={setArchiveCol}profile={currentProfile} archive={archiveCol}
      bookmark={bookmarked}
    setBookmarked={setBookmarked}/>
    dia.title="Share"
    dia.isOpen=true
    dia.onClose=()=>{
        dispatch(setDialog({...dialog,isOpen:false}))
    }
    dia.agreeText=null
    dia.agree=null
    dia.disagreeText="Close"
    dispatch(setDialog(dia))
  }

  useLayoutEffect(() => {
    soCanUserEdit();
  }, [page]);

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
    let title = book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title;
    bookTitleDiv = (
      <a onClick={() => { router.push(Paths.collection.createRoute(book.id)); }}>
        <p>{title} {">"}</p>
      </a>
    );
  }

  const bookmarkBtn = () => {
    return isGrid ? (
      <div className={`bg-emerald-100 ${widthSize} flex flex-row justify-between text-emerald-700`}>
        {isPhone ? null : <ProfileCircle isGrid={isGrid} profile={page.author} color='emerald-700' />}
        <span className={
          `${isGrid ? isPhone ? " w-grid-mobile-content flex flex-row justify-between"
            : " flex justify-end "
            : isHorizPhone ? "" : ""}`
        }>
          <h6 className={`text-emerald-700 ${isGrid ? isPhone ? "" : " text-right " : isHorizPhone ? "" : ""}${isPhone ? " text-[0.6rem] " : "text-[0.9rem]  w-[10rem] ml-1 pr-2"}   whitespace-nowrap  no-underline text-ellipsis  overflow-hidden  my-auto `}
            onClick={() => {
              sendGAEvent("Navigate", `Navigate to ${JSON.stringify({ id: page.id, title: page.title })}`);
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

  const description = (story) => {
    if (!story.description || story.description.length === 0) return null;

    return (
      <div className="md:pt-4 p-1">
        {story.needsFeedback ? (
          <label className="text-emerald-800">Feedback Request:</label>
        ) : null}
        <h6
          className={`overflow-hidden text-emerald-800`}
        >
          {story.description}
        </h6>
      </div>
    );
  };

  const buttonRow = () => {
    return isGrid
      ? null
      : (
         <div className="flex-row w-[100%] sm:w-[50em] h-16 overflow-clip mx-auto bg-emerald-200 flex text-white">
       <div className={`${likeFound ? "bg-emerald-400" : "bg-emerald-200"} text-center grow w-1/3`}>
            <div
              onClick={handleApprovalClick}
              className={`py-2 flex mont-medium mx-auto text-white border-none h-[100%] border-none`}
            >
              <IonText className="text-xl text-emerald-700 m-auto p-0">Yea{likeFound ? "" : ""}</IonText>
            </div>
          </div>
          <div className={" bg-emerald-200  border-white border-x-2 border-y-0 text-center border-white grow w-1/3"}>
            <div
              className='text-emerald-700 text-center mx-auto bg-emerald-200 py-2 border-none'
              onClick={() => handleClickComment()}>
              <IonText className="text-xl text-emerald-700 m-auto p-0">Review</IonText> 
            </div>
          </div>
         
          {!page.recommended ? (
               <div onClick={onClickShare} className="flex-1/3 grow bg-emerald-200 text-center flex justify-center items-center">
                    {/* <IonButton  fill="clear" color="success"> */}
                      <IonText className="text-xl text-emerald-700 m-auto p-0">Share</IonText>
                      </div>
             
          ) : (
            <div onClick={addStoryToCollection}
              className='bg-emerald-700 flex grow flex-1/3'>
              <IonImg className="mx-auto my-auto" src={addCircle} />
            </div>
          )}
        </div>
      );
  };

  if (!page) {
    return (
      <span className={ " skeleton"} />
    );
  }

  return (
    
    <ErrorBoundary >
    <IonCard
      id="dashboard-item"
      className={
        'mt-3 rounded-lg rounded-b-lg  w-[100vw] sm:max-w-[50em] mx-auto justify-between bg-emerald-100 shadow-md flex flex-col '
      }
 
    >
      <IonCardHeader className="p-0 m-0 bg-transparent">
        {header()}
        {bookTitleDiv}
      </IonCardHeader>

      <IonCardContent className="pb-4 mx-auto bg-transparent">
        {description(page)}
        <div className='  overflow-clip p-2 max-h-[30rem] sm:max-h-[50rem]'>
        <PageDataElement isGrid={isGrid} page={page} />
        </div>
      </IonCardContent>

  
      {isGrid ? (
        <div id="bottom-dash" className={`flex flex-row  sm:w-[50em] justify-between rounded-b-lg bottom-0 w-full`}>
          {bookmarkBtn()}
        </div>
      ) : <div className={ `flex w-[100%] flex-row sm:w-[50em] justify-between  bottom-0 w-full`}>
        {buttonRow()}</div>}
    </IonCard>
    </ErrorBoundary>
  );
}






export default React.memo(DashboardItem);