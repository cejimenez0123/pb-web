import React from 'react'
import "../Dashboard.css"
// import {getPagesComments} from "../../actions/PageActions"
import { PageType } from '../core/constants'
import {connect ,useDispatch} from 'react-redux'
// import {useBottomScrollListener} from "react-bottom-scroll-listener"
  let size= {width: window.innerWidth,height: window.innerHeight}

function DashboardItem({page}) {
  
//   componentDidMount(){
// if(this.props.pages && this.props.pages.length>0){
//     debugger
//       this.props.getLikesOfPages(this.props.pages)
//       }
// if(this.props.currentUser){
//       this.props.getLikesOfUser()}
//   }

//  renderPages(){
        
    
//       // console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
//         if(this.props.pages && this.props.pages.length>0){
         
//             return ( this.props.pages.map((page,key)=>{
//                 let comments = []

//                  if(page.attributes){
//                     page = page.attributes}
//                 return (
//                       <h3>{page.title}</h3> 
//                     )
//                         })
//                     )
//                 }else{

//                 return(<div className="noPages"> 
//                     <h3>0 pages</h3>
//                 </div>)
//             }
//     }
            

    
    
//    render(){     
//     return(<div className="pages">

//     {this.renderPages()}
//     </div>)
//    }
let pageDataElement = (<div></div>)
switch(page.type){
    case PageType.text:
        pageDataElement = <div className='dashboard-data text' dangerouslySetInnerHTML={{__html:page.data}}></div>
    break;
    case PageType.picture:
        pageDataElement = <img className='dashboard-data' src={page.data} alt={page.title}/>
    break;
    case PageType.video:
        pageDataElement = <video src={page.data}/>
    break;
    default:
        pageDataElement = <div className='dashboard-data' dangerouslySetInnerHTML={{__html:page.data}}/>
    break;
}
        return(<div className='dashboard-item'>
            <style>
                
            </style>
            <div className='dashboard-header'>
                <h2>{page.title}</h2>
            </div>
            <div >
                {pageDataElement}
            </div>
            <div className='btn-row'>
                <button>
                    Yea
                </button>
                <button>
                    Nah
                </button>
                <button>
                    Comments
                </button>
                <button>
                    Info
                </button>
                <button>
                    Share
                </button>
            </div>
        </div>)

}


const mapState=(state)=>{
    return{
        // currentUser: state.users.currentUser,
        // comments: state.pages.pageCommentsInView,
        // userLikes: state.users.userLikes
    }
}
const mapDispatch=(dispatch)=>{
    return{
//         getPagesComments: (arr)=>dispatch(getPagesComments(arr)),
//         pageComments: (comments)=>dispatch({type: "PAGE_COMMENTS",comments}),
//      getLikesOfUser: ()=>dispatch(getLikesOfUser())
    }
}
export default connect(mapState,mapDispatch)(DashboardItem)