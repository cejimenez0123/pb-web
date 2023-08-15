
import { PageType } from "../core/constants";


function PageListItem({page}) {
 
    let pageDataElement = (<div></div>)
    switch(page.type){
        case PageType.text:
            pageDataElement = <div className='text' dangerouslySetInnerHTML={{__html:page.data}}></div>
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
            return(<div className='page-list-item'>
                <style>
                    
                </style>
                <div className='title'>
                    <h2>{page.title}</h2>
                </div>
                <div >
                    {/* {pageDataElement} */}
                </div>
    
            </div>)
    
    }
    
    
    // const mapState=(state)=>{
    //     return{
    //         // currentUser: state.users.currentUser,
    //         // comments: state.pages.pageCommentsInView,
    //         // userLikes: state.users.userLikes
    //     }
    // }
    // const mapDispatch=(dispatch)=>{
    //     return{
    // //         getPagesComments: (arr)=>dispatch(getPagesComments(arr)),
    // //         pageComments: (comments)=>dispatch({type: "PAGE_COMMENTS",comments}),
    // //      getLikesOfUser: ()=>dispatch(getLikesOfUser())
    //     }
    // }
    export default (PageListItem)
