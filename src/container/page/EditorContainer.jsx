import RichEditor from "../../components/page/RichEditor"
import "../../styles/Editor.css"
import "../../App.css"
import {useDispatch, useSelector} from "react-redux"
import { useParams,useNavigate } from "react-router-dom"
import menu from "../../images/icons/menu.svg"
import {  setHtmlContent,
      
       
          deletePage, 
          setEditingPage,
          } from "../../actions/PageActions"
import React,{ useEffect, useLayoutEffect, useState } from "react"
import {  Button,} from "@mui/material"
import { useMediaQuery } from "react-responsive"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PageType } from "../../core/constants"
import Paths from "../../core/paths"
import PicturePageForm from "../../components/PicturePageForm"
import { updateStory } from "../../actions/StoryActions"
function EditorContainer({currentProfile}){
        const pageInView = useSelector(state=>state.pages.pageInView)
        const pathParams = useParams()
        const dispatch = useDispatch()
        const md = useMediaQuery({ query: '(min-width:768px)'})
        const [title,setTitle] = useState(pageInView?pageInView.title:"")
        const navigate = useNavigate()
        const [isSaved,setIsSaved]=useState(true)
  
        const [privacy,setPrivacy] = useState(pageInView?pageInView.isPrivate:true)

        const [commentable,setCommentable] = useState(pageInView?pageInView.commentable:true)

        const htmlContent = useSelector((state)=>state.pages.editorHtmlContent)
        const {id }= pathParams
 const setPageInfo =(page)=>{
      dispatch(setEditingPage({page}))
      setTitle(page.title)
      setPrivacy(page.privacy)
      setCommentable(page.commentable)
      dispatch(setHtmlContent(page.data))
    }

    useLayoutEffect(()=>{ 
      if(htmlContent.length<0 && title.length<0){
        let result =window.confirm("Story Will Be deleted")
        if(result){
          dispatch(deletePage(pathParams))
        }
      }
    },[])
  useEffect(()=>{
    let params = { page:{id},
      title: title,
      data: htmlContent,
      privacy:privacy,
      commentable:commentable,  
      type:"html"
    }
      setIsSaved(false)
      dispatch(updateStory(params)).then(res=>{
        setIsSaved(true)
      })
    },[htmlContent,title])
      const [open, setOpen] = useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const handleDelete =()=>{
          handleClose()
          if(pageInView){
          const params = {page:pageInView}
          dispatch(deletePage(params)).then(()=>{
            navigate("/profile/home")
          })
        }
      }
    
    
  
     
  
 
      const contentDiv = ()=>{
        if(currentProfile){
          if(pageInView){
              if(pageInView.type===PageType.text){
                  return (<div id=""><RichEditor  initialContent={htmlContent}/></div>)
              }else if(pageInView.type===PageType.picture){
                
                  return (<div  className="image">

                    <img src={htmlContent} alt={pageInView.data}/>
                    </div>)
              }else if(pageInView.type === PageType.link){
                  return(
                      <PicturePageForm />
                  )
              }else{
                  return (<div id=""><RichEditor initialContent={htmlContent}/></div>)}
            }else{

              
            let href = window.location.href.split("/")
            let last = href[href.length-1]
            if(last.toUpperCase()=="image".toUpperCase()||last.toUpperCase()=="link".toUpperCase()){
              return (<PicturePageForm />)
            }else{
              return(<div id=""><RichEditor initialContent={""}/></div>)
            }
          }
            
          }
        }
      const [anchorEl,setAnchorEl]=useState(null)



        const handleClickAddToCollection=()=>{
        
          navigate(Paths.addStoryToCollection.createRoute(id))
        }
        const handlePostPublicly=()=>{
          
        }
        const handleTitle = (e)=>{
          setTitle(e.target.value)
        }
        return(
          <div className="max-w-[100vw] sm:max-w-[45rem] mx-auto"> 
       
                <div className=" rounded-lg sm:my-4 mx-auto ">
                  <div className="bg-green-600  sm:rounded-t-lg content-end border border-white   flex flex-row  ">
                    <div style={{borderRight:"1px solid white" }}
                    className="  flex flex-col-reverse">
                      <div className="flex-row flex">
                    <input type="text " className=" p-2 bg-green-600 h-fit text-xl w-[78%] sm:w-[30em] text-white font-bold" value={title} onChange={handleTitle}placeholder="Untitled"/>
                    {isSaved?<h6 className=" mx-2 mt-1 text-white ">Saved</h6>:
                    <h6 className=" mx-2 mt-1 text-white">Draft</h6>}</div>
                    </div>
                    <div className="max-w-fit">
                      
                    {md?<div className="  flex flex-col p-1 ">
                      <button className=" mb-1  bg-emerald-800 text-white "
                      onClick={handleClickAddToCollection}>Add to Collection</button>
                      <button className=" text-white bg-emerald-800 ">Post Public</button>
                    </div>:
                    <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" ><img className="w-12 h-12 bg-green-800 rounded-lg m-1" src={menu}/></div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      <li className="text-green-600"
                      onClick={handleClickAddToCollection}><a>Add to Collection</a></li>
                      <li className="text-green-600"> Post Public</li>
                    </ul>
                  </div>}
                    
                  </div>
                  </div>
                {contentDiv()}
                </div>
              

             
           
           

                    <div>
                      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deleting?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this page?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={()=>handleDelete()} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
      </div>
 
  )     
}

export default EditorContainer



// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";
// import RichEditor from "../../components/page/RichEditor";
// import "../../styles/Editor.css";
// import "../../App.css";
// import menu from "../../images/icons/menu.svg";
// import {
//   setHtmlContent,
//   deletePage,
//   setEditingPage,
// } from "../../actions/PageActions";
// import { Button } from "@mui/material";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { PageType } from "../../core/constants";
// import Paths from "../../core/paths";
// import PicturePageForm from "../../components/PicturePageForm";
// import { updateStory } from "../../actions/StoryActions";

// class EditorPage extends Component {
//   constructor(props) {
//     super(props);
//     const { pageInView } = this.props;

//     this.state = {
//       title: pageInView ? pageInView.title : "",
//       isSaved: true,
//       privacy: pageInView ? pageInView.isPrivate : true,
//       commentable: pageInView ? pageInView.commentable : true,
//       open: false,
//     };

//     this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
//     this.handleTitle = this.handleTitle.bind(this);
//     this.handleClickOpen = this.handleClickOpen.bind(this);
//     this.handleClose = this.handleClose.bind(this);
//     this.handleDelete = this.handleDelete.bind(this);
//     this.handleClickAddToCollection = this.handleClickAddToCollection.bind(this);
//     this.setPageInfo = this.setPageInfo.bind(this);
//   }

//   // componentDidMount() {
//   //   const { dispatch } = this.props;
//   //   window.addEventListener("beforeunload", this.handleBeforeUnload);

//   //   const { pageInView } = this.props;
//   //   if (pageInView) {
//   //     this.setPageInfo(pageInView);
//   //   }
//   // }

//   componentDidUpdate(prevProps) {
//     const { htmlContent, title } = this.state;
//     const { dispatch } = this.props;

//     if (prevProps.htmlContent !== htmlContent || prevProps.title !== title) {
//       const params = {
//         page: { id: this.props.match.params.id },
//         title: title,
//         data: htmlContent,
//         privacy: this.state.privacy,
//         commentable: this.state.commentable,
//         type: "html",
//       };

//       this.setState({ isSaved: false });
//       dispatch(updateStory(params)).then(() => {
//         this.setState({ isSaved: true });
//       });
//     }
//   }

//   componentWillUnmount() {
//     const { htmlContent, title } = this.state;
//     const { dispatch } = this.props;

// ; // Required for Chrome

//     // if (htmlContent.length < 0 && title.length < 0) {
//       const result = window.confirm("Story Will Be deleted");
//       if (result) {
//         dispatch(deletePage(this.props.match.params));
//       }
  
//   }

//   setPageInfo(page) {
//     const { dispatch } = this.props;

//     dispatch(setEditingPage({ page }));
//     this.setState({
//       title: page.title,
//       privacy: page.privacy,
//       commentable: page.commentable,
//     });
//     dispatch(setHtmlContent(page.data));
//   }

//   handleTitle(e) {
//     this.setState({ title: e.target.value });
//   }

//   handleClickOpen() {
//     this.setState({ open: true });
//   }

//   handleClose() {
//     this.setState({ open: false });
//   }

//   handleDelete() {
//     const { pageInView, dispatch, history } = this.props;

//     this.handleClose();
//     if (pageInView) {
//       const params = { page: pageInView };
//       dispatch(deletePage(params)).then(() => {
//         history.push("/profile/home");
//       });
//     }
//   }

//   handleClickAddToCollection() {
//     const { match, history } = this.props;
//     history.push(Paths.addStoryToCollection.createRoute(match.params.id));
//   }

//   contentDiv() {
//     const { pageInView, currentProfile } = this.props;
//     const { htmlContent } = this.state;

//     if (currentProfile) {
//       if (pageInView) {
//         if (pageInView.type === PageType.text) {
//           return (
//             <div id="">
//               <RichEditor initialContent={htmlContent} />
//             </div>
//           );
//         } else if (pageInView.type === PageType.picture) {
//           return (
//             <div className="image">
//               <img src={htmlContent} alt={pageInView.data} />
//             </div>
//           );
//         } else if (pageInView.type === PageType.link) {
//           return <PicturePageForm />;
//         } else {
//           return (
//             <div id="">
//               <RichEditor initialContent={htmlContent} />
//             </div>
//           );
//         }
//       } else {
//         const href = window.location.href.split("/");
//         const last = href[href.length - 1];
//         if (
//           last.toUpperCase() === "image".toUpperCase() ||
//           last.toUpperCase() === "link".toUpperCase()
//         ) {
//           return <PicturePageForm />;
//         } else {
//           return (
//             <div id="">
//               <RichEditor initialContent={""} />
//             </div>
//           );
//         }
//       }
//     }
//   }

//   render() {
//     const { isSaved, title, open } = this.state;
//     const md = window.matchMedia("(min-width: 768px)").matches;

//     return (
//       <div className="max-w-[100vw] sm:max-w-[45rem] mx-auto">
//         <div className="rounded-lg sm:my-4 mx-auto">
//           <div className="bg-green-600 sm:rounded-t-lg content-end border border-white flex flex-row">
//             <div
//               style={{ borderRight: "1px solid white" }}
//               className="flex flex-row"
//             >
//               <input
//                 type="text"
//                 className="p-2 bg-green-600 text-xl w-[19.3rem] sm:w-[30rem] sm:max-w-[35rem] text-white font-bold"
//                 value={title}
//                 onChange={this.handleTitle}
//                 placeholder="Untitled"
//               />
//               {isSaved ? (
//                 <h6 className="mx-2 mt-1 text-white">Saved</h6>
//               ) : (
//                 <h6 className="mx-2 mt-1 text-white">Draft</h6>
//               )}
//             </div>
//             <div className="max-w-fit">
//               {md ? (
//                 <div className="flex flex-col p-1">
//                   <button
//                     className="mb-1 bg-emerald-800 text-white"
//                     onClick={this.handleClickAddToCollection}
//                   >
//                     Add to Collection
//                   </button>
//                   <button className="text-white bg-emerald-800">
//                     Post Public
//                   </button>
//                 </div>
//               ) : (
//                 <div className="dropdown dropdown-bottom dropdown-end">
//                   <div tabIndex={0} role="button">
//                     <img
//                       className="w-12 h-12 bg-green-800 rounded-lg m-1"
//                       src={menu}
//                     />
//                   </div>
//                   <ul
//                     tabIndex={0}
//                     className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
//                   >
//                     <li
//                       className="text-green-600"
//                       onClick={this.handleClickAddToCollection}
//                     >
//                       <a>Add to Collection</a>
//                     </li>
//                     <li className="text-green-600"> Post Public</li>
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//           {this.contentDiv()}
//         </div>

//         <Dialog
//           open={open}
//           onClose={this.handleClose}
//           aria-labelledby="alert-dialog-title"
//           aria-describedby="alert-dialog-description"
//         >
//           <DialogTitle id="alert-dialog-title">{"Deleting?"}</DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               Are you sure you want to delete this page?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={this.handleClose}>Disagree</Button>
//             <Button onClick={this.handleDelete} autoFocus>
//               Agree
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => ({
//   pageInView: state.pages.pageInView,
//   htmlContent: state.pages.editorHtmlContent,
//   currentProfile: state.users.currentProfile,
// });
// const EditorContainer = withRouter(connect(mapStateToProps)(EditorPage))
// export default EditorContainer;
