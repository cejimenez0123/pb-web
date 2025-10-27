
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { IonCard, IonCardHeader, IonCardContent, IonImg } from '@ionic/react';
import "../../Dashboard.css";
import {
  deletePageApproval,
  setEditingPage,
  setPageInView,
  setPagesInView,
  createPageApproval,
 
} from '../../actions/PageActions';
import { addStoryListToCollection, deleteStoryFromCollection } from '../../actions/CollectionActions'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import addCircle from "../../images/icons/add_circle.svg";
import bookmarkFillGreen from "../../images/bookmark_fill_green.svg";
import bookmarkfill from "../../images/bookmarkfill.svg";
import checkResult from '../../core/checkResult';
import Paths from '../../core/paths';
import loadingGif from "../../images/loading.gif";
import bookmarkoutline from "../../images/bookmarkadd.svg";
import bookmarkadd from "../../images/bookmark_add.svg";
import PageDataElement from './PageDataElement';
import ProfileCircle from '../profile/ProfileCircle';
import Context from '../../context';
import Enviroment from '../../core/Enviroment';
import ErrorBoundary from '../../ErrorBoundary';
import { debounce } from 'lodash';
import { initGA, sendGAEvent } from '../../core/ga4';
import adjustScreenSize from '../../core/adjustScreenSize';

export default function DashboardItem({ page, book, isGrid }) {
  const { isPhone, isHorizPhone, setSuccess, setError, currentProfile } = useContext(Context);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const pathParams = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [canUserEdit, setCanUserEdit] = useState(false);
  const pagesInView = useSelector((state) => state.pages.pagesInView);
  const [expanded, setExpanded] = useState(false);
  const colInView = useSelector((state) => state.books.collectionInView);
  const [likeFound, setLikeFound] = useState(false);
  const [overflowActive, setOverflowActive] = useState(null);
  const [bookmarked, setBookmarked] = useState();

  useLayoutEffect(() => {
    initGA();
  }, []);

  const widthSize = adjustScreenSize(isGrid, true, "", " pt-1 pb-2 ", "", "", "", "");
  let sizeOuter = adjustScreenSize(isGrid, false, "rounded-lg shadow-md grid-item relative ", "justify-between flex ", "mt-2 mx-auto ", " mt-2 ", "  ");

  const addStoryToCollection = () => {
    if (page) {
      const list = [page];
      if (
        location.pathname.includes("collection") &&
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
    if (currentProfile && page && page.authorId === currentProfile.id) {
      setCanUserEdit(true);
      return;
    }
  };

  const checkLike = () => {
    if (currentProfile && page) {
      if (currentProfile.likedStories) {
        let found = currentProfile.likedStories.find(like => like && like.storyId === page.id);
        setLikeFound(found);
      }
      if (currentProfile.profileToCollections) {
        let marked = currentProfile.profileToCollections.find(
          ptc => ptc && ptc.type === "archive" &&
                 ptc.collection.storyIdList.find(stc => stc.storyId === page.id)
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
      navigate(Paths.page.createRoute(page.id));
    }
  };

  const header = () => {
    return (
      <span
        className={`flex-row flex justify-between w-[95vw] sm:w-[50em]  px-1 rounded-t-lg pt-2 pb-1`}>
        <ProfileCircle isGrid={isGrid} color={"emerald-700"} profile={page.author} />
        {!isGrid ?
          <h6
            className={
              `text-emerald-800 mx-2 no-underline pt-2 text-ellipsis text-emerald-700 whitespace-nowrap overflow-hidden ${isGrid ? "text-[0.7rem] " : "text-[0.9rem]"}`
            }
            onClick={() => {
              dispatch(setPageInView({ page }));
              navigate(Paths.page.createRoute(page.id));
            }}>
            {` ` + (page.title?.length > 0 ? page.title : "")}
          </h6>
          : null}
      </span>
    );
  };
  useEffect(()=>{
      checkLike()
  },[page])
  const handleApprovalClick = () => {
    if (page) sendGAEvent(`Click to Yea ${JSON.stringify({ id: page.id, title: page.title })}`, `Click Yea`, "Review", 0, false);
    if (currentProfile) {
      if (likeFound) {
        checkLike();
        dispatch(deletePageApproval({ id: likeFound.id })).then(res => {
          checkResult(res, payload => { }, err => { });
        });
        setLikeFound(false);
      } else {
        if (page && currentProfile) {
          const params = { story: page, profile: currentProfile };
          setLikeFound(true);
          dispatch(createPageApproval(params)).then(res => {
            checkResult(res, payload => { checkLike(); }, err => { });
          });
        } else {
          setError("Sign Up so you can show support");
        }
      }
    } else {
      setError("Please Sign Up");
    }
  };

  // const expandedBtn = () => {
  //   if (overflowActive && !expanded) {
  //     return <Button onClick={() => setExpanded(true)}>See More</Button>;
  //   } else if (expanded) {
  //     return (
  //       <Button onClick={() => setExpanded(false)}>See Less</Button>
  //     );
  //   } else if (overflowActive) {
  //     return <Button onClick={() => setExpanded(true)}>See More</Button>;
  //   } else {
  //     return <div></div>;
  //   }
  // };

  useLayoutEffect(() => {
    soCanUserEdit();
  }, [page]);

  const onBookmarkPage = () => {
    if (currentProfile && currentProfile.profileToCollections) {
      setLoading(true);
      let ptc = currentProfile.profileToCollections.find(ptc => ptc.type === "archive");
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

  const ClickAddStoryToCollection = () => {
    navigate(Paths.addStoryToCollection.story(page.id));
  };

  let bookTitleDiv = null;
  if (book) {
    let title = book.title.length > 30 ? book.title.slice(0, 30) + "..." : book.title;
    bookTitleDiv = (
      <a onClick={() => { navigate(Paths.collection.createRoute(book.id)); }}>
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
              navigate(Paths.page.createRoute(page.id));
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
          className={`overflow-hidden text-emerald-800  ${
            isGrid
              // ? isPhone
              //   ? "max-h-20 m-1 p-1 w-grid-mobile-content text-white"
              //   : isHorizPhone
              //   ? "w-page-mobile-content text-white"
              //   : "w-page-content text-emerald-700 text-white"
              // : isHorizPhone
              // ? "text-emerald-800"
              // : ""
            }`}
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
        <div className='flex w-[95vw] rflex-row w-full rounded-b-lg overflow-hidden justify-evenly'>
          <div className={`${likeFound ? "bg-emerald-400" : "bg-emerald-200"} text-center grow w-1/3`}>
            <div
              onClick={handleApprovalClick}
              className={`py-2 flex mont-medium mx-auto text-white border-none h-[100%] border-none`}
            >
              <h6 className='text-[1.2rem] text-emerald-700 my-auto mx-auto'>Yea{likeFound ? "" : ""}</h6>
            </div>
          </div>
          <div className={" bg-emerald-200  border-white border-x-2 border-y-0 text-center border-white grow w-1/3"}>
            <div
              className='text-emerald-700 text-center mx-auto bg-emerald-200 py-2 border-none'
              onClick={() => handleClickComment()}>
              <h6 className='text-[1.2rem]'> Review</h6>
            </div>
          </div>
          {!page.recommended ? (
            <div className="dropdown text-center bg-emerald-200 py-2  grow w-1/3 dropdown-top">
              <div tabIndex={0} role="button"
              className="text-emerald-800 text-center mx-auto rounded-b-lg bg-emerald-200 border-none ">
                <h6 className='text-[1.2rem]'>Share</h6>
              </div>
              <ul tabIndex={0} className="dropdown-content text-center bg-emerald-100 text-emerald-800  menu rounded-box w-60 p-1 shadow">
                {currentProfile.id == page.authorId?<li className='text-emerald-700'
                  onClick={() => navigate(Paths.editPage.createRoute(page.id))}>
                  <a className='text-emerald-800'>
                    Edit
                  </a></li>:null}
                <li className='text-emerald-700'
                  onClick={() => ClickAddStoryToCollection()}>
                  <a className='text-emerald-800'>
                    Add to a Collection
                  </a>
                </li>
                <li>
                  <a
                    className='text-emerald-700'
                    onClick={() => {
                      navigator.clipboard.writeText("https://plumbum.app/page" + Paths.page.createRoute(page.id))
                        .then(() => setSuccess('Text copied to clipboard'));
                    }}>
                    Share Link
                  </a>
                </li>
                {canUserEdit ? (
                  <li className='text-emerald-700'>
                    <a onClick={() => {
                      dispatch(setEditingPage({ page }));
                      dispatch(setPageInView({ page: null }));
                      navigate(Paths.editPage.createRoute(page.id));
                    }}
                      className='text-emerald-700'>
                      Edit
                    </a>
                  </li>
                ) : null}
                <li>
                  <button className="my-auto w-fit mx-auto border-none bg-transparent"
                    onClick={handleBookmark}
                    disabled={!currentProfile}>
                    {loading
                      ? <IonImg className="max-h-6" src={loadingGif} />
                      : bookmarked
                        ? <IonImg src={bookmarkFillGreen} className='text-emerald-800' />
                        : <IonImg src={bookmarkadd} />}
                  </button>
                </li>
              </ul>
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

  // --- FINAL RENDER WITH IONIC CARD CONTAINMENT ---
  if (!page) {
    return (
      <span className={sizeOuter + " skeleton"} />
    );
  }

  return (
    
    <ErrorBoundary >
    <IonCard
      id="dashboard-item"
      className={
        'mt-3 rounded-lg rounded-b-lg w-[95vw] sm:w-[50em] min-h-60 justify-between bg-emerald-100 shadow-md flex flex-col ' +
        sizeOuter +
        (isGrid ? ' overflow-hidden' : '')
      }
      style={{
        maxWidth: '100vw',
        overflow: 'hidden', // critical for native
      }}
    >
      <IonCardHeader className="p-0 m-0 bg-transparent">
        {header()}
        {bookTitleDiv}
      </IonCardHeader>

      <IonCardContent className="pb-4 m-0 bg-transparent">
        {description(page)}
        <PageDataElement isGrid={isGrid} page={page} />
      </IonCardContent>

  
      {isGrid ? (
        <div id="bottom-dash" className={`flex flex-row  sm:w-[50em] justify-between rounded-b-lg bottom-0 w-full`}>
          {bookmarkBtn()}
        </div>
      ) : buttonRow()}
    </IonCard>
    </ErrorBoundary>
  );
}
