import ContentList from "../components/ContentList"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { fetchProfile } from "../actions/UserActions"
import ProfileCard from "../components/ProfileCard"

function ProfileContainer(props){
    const profile = useSelector(state=>state.users.profileInView)
    const dispatch = useDispatch()
    const pathParams = useParams()
    useEffect(()=>{
        const { id} = pathParams
        console.log(`fdfds${id}`)
        if(profile==null || (profile != null && profile.id != id)){

            dispatch(fetchProfile(pathParams))
        }else{

        }
    },[profile])
    // const profileCard = ()=>{
    //     if(profile!=null){
    //         return (
               
    //             }else{
    //                 return (<div></div>)
    //             }
    // }
    let profileCardDiv = (<div>

    </div>)
    if(profile!=null){
      profileCardDiv =  ( <div className="info">
        <h1>{profile.username}</h1>
        </div>)
    }
    return(
        <div>
            <div className="left-side-bar">
               {profileCardDiv}
            </div>
            <div className="main-side-bar">
                <ContentList curreentProfile/>
            </div>
            <div className="right-side-bar">

            </div>
            {/* <div className="profileBackground">
                <div className="profileContainer">
                <div className="profile">
                    <div classname="" > */}
                                {/* {this.profileCard()} */}
                            
{/*                                 
                                <section>
         */}
                        {/* <div onClick={(e)=>this.handleModalClose(e)} style={{width: "100%",display: this.state.showStartLibraries}} class="modal">
                            <div   class="modalContent">
                              <span  class="close">&times;</span>
                               
                                <form  className="startForm" onSubmit={(e)=>this.startLib(e)}>
                                    <h4>Name of Library:</h4>
                                    <br/>
                                    <input type="text" name="name" placeholder="untitled"/>
                                    <br/>
                                    <label> Intro to Library: </label>
                                    <br/>
                                    <textarea/>
                                    <h4> Privacy:</h4>
                                    <select name="privacy">
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    <br/>
                                        <input type="submit" value="Create"/>
                                </form> 
                            </div>
                        </div> */}
                                    
                                        {/* <div onClick={(e)=>this.handleModalClose(e)} style={{display: this.state.showStartBook}} class="modal">
                            <div   class="modalContent">
                              <span  class="close">&times;</span>
                              <div  className="modalIndex">
                             
                                <form onSubmit={(e)=>this.startBook(e)}>
                                 <div className="startForm">
                                    <label htmlFor="name">Name of Book:  </label>
                                    <br/>
                                    <input type="text"  className="form-control" name="name" placeholder="untitled"/>
                                    <br/>
                                    <label> Introduction to Book</label>
                                    <br/>
                                    <textarea className=" form-control" placeholder="What's the why" rows="3"/>
                                    <br/>
                                    <label> Privacy:</label>
                                    <select className="form-control" name="privacy">
                                        <option value="private">Private</option>
                                        <option value="public">Public</option>
                                    </select>
                                    <br/>
                                        <input type="submit" value="Create"/>
                                        </div>
                                </form>
                                
                            </div>
                        </div>
                    </div> */}
                    {/* "start-btn btn btn-secondary btn-dark btn-sm */}
                       
                                {/* </section>
                                
                          
                    </div>
                    <Modal button={<h3>Books</h3>} className={"book-index"} content={<BookIndex books={this.props.followedBooks}/>}/>
                  
                          <Modal button={ <h3 >Libraries</h3> } className={"lib-index"} content={<LibraryIndex libraries={this.props.libraries} bookLibraries={this.props.bookLibraries}/>
                      }/>
                    </div>
                     
                      <div >
                      <div className="pageMain">
                   <BottomScrollListener onBottom={()=>this.handleOnBottom()}>
                <Pages pages={this.props.pagesInView} />
         </BottomScrollListener>
                </div>
                </div>
                <a href={`/user/${this.props.currentUser.id}/settings`} >
                                    <img src="https://img.icons8.com/ios/50/000000/settings.png"/>
                                </a>
            </div>
            </div> */}
        </div>
                
            )
}
export default ProfileContainer