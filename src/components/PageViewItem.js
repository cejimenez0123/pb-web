import { useDispatch,useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {useState} from "react"
import { createComment } from "../actions/PageActions"
import { TextareaAutosize,Button } from "@mui/material"
import { PageType } from "../core/constants"
import { setProfileInView } from "../actions/UserActions"
import {ThemeProvider} from "@mui/material/styles";
import theme from "../theme"
import { fetchCommentsOfPage } from "../actions/PageActions"
import CommentInput from "./CommentInput"
export default function PageViewItem({page,currentProfile}) {
    // const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const [commenting,setCommenting]=useState(false)
    const [commentInput,setComment] = useState("")

const saveComment=()=>{
    if(currentProfile && page && commentInput.length >0){
    const params =  {profileId: currentProfile.id,
          text:commentInput,
          pageId:page.id,
          parentCommentId:"",
    }
    dispatch(createComment(params)).then(result=>{
        if(result.error==null){
            const {payload} = result
            if(payload != null && payload.error==null){
                const params = {page}
                dispatch(fetchCommentsOfPage(params))
            }
        }
    })
}
        
       
}

const commentBox = (show)=>{
    if (show){
        return(<CommentInput page={page} />)
        // return(<div className="comment-input" 
        // style={{
        //     backgroundColor:"white",
        //     paddingTop:"1em",
        //     width: "50em",
        //     margin:"auto",
            
            
        // }}>
        //     <TextareaAutosize

        //     value={commentInput}
        //     minRows={3} 
        //     cols={85}
        //     onChange={(e)=>{
        //        setComment(e.target.value)
        // }} />
        //     <div className="button-row">
        //         <Button onClick={saveComment}>
        //             Save
        //         </Button>
        //     </div>
        // </div>)
    }
}
let pageDataElement = (<div></div>)
if(page){
switch(page.type){
    case PageType.text:
        pageDataElement = <div className='dashboard-content text' dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className='dashboard-content' src={page.data} alt={page.title}/>
    break;
    case PageType.video:
        pageDataElement = <video src={page.data}/>
    break;
    default:
        pageDataElement = <div className='dashboard-content' dangerouslySetInnerHTML={{__html:page.data}}/>
    break;
}
let profile = (<div></div>)
        let prof= profilesInView.find(profile=>profile.id == page.profileId)
        if(prof){
            profile=(<a 
            onClick={()=>{
                const params = { profile: prof}
                setProfileInView(params)
                navigate(`/profile/${prof.id}`)
            }}><p>{prof.username}</p></a>)
        }
        return(
        <div className='dashboard-item'>
        
            <div className='dashboard-header'>
                <p>{page.title}</p>
                {profile}
            </div>
           
                {pageDataElement}
        
            <div className='btn-row'>
                <Button 
                    style={{color:theme.palette.info.contrastText,
                            backgroundColor:currentProfile?theme.palette.info.main:theme.palette.info.disabled}}
                    disabled={!currentProfile} 
                >
                    Yea
                </Button>
                {/* <button>
                    Nah
                </button> */}
                <Button 
                    style={{color:"white",
                    backgroundColor:currentProfile?theme.palette.info.main:theme.palette.info.disabled}} 
                    disabled={!currentProfile} 
                    onClick={()=>{setCommenting(!commenting)}}>
                
                    Comment
                </Button>
                <Button>
                    Info
                </Button>
                <Button>
                    Share
                </Button>
            </div>
            
                {commentBox(commenting)}   
            
            
        </div>
        )
            }else{
                <div>
                    Loading..
                </div>
            }
}
