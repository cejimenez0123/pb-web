import { useState,useEffect } from "react"
import { useSelector } from "react-redux"
import BookRole from "../domain/models/bookrole"
import LibraryRole from "../domain/models/libraryrole"
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import { RoleType } from "../core/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchAllProfiles } from "../actions/UserActions";
import { useDispatch } from "react-redux";
import { Timestamp } from "firebase/firestore";
import Role from "../domain/models/role";
export default function RoleList({getRoles,library,book,type}) {
    const dispatch = useDispatch()
    const [newRoles, setNewRoles ]= useState([])
    const libraryRoles = useSelector(state=>state.libraries.libraryRoles)
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const [profileHasMore,setProfileHasMore]= useState(false)
    const [profileList,setProfileList] = useState([])
    const fetchProfiles=()=>{
        dispatch(fetchAllProfiles()).then((result) => {
            const {payload} = result
            const {profileList } = payload
            const list = profileList.filter(profile=>{
                const roleFound  = newRoles.find(role=>
                    role.profile.id == profile.id)
                return !roleFound
            })
            setRoleList()
            setOldRoles()
            setProfileList(list)
        })
    }
   
    useEffect(()=>{
        getRoles(newRoles)
    },[newRoles]) 
    useEffect(()=>{
        fetchProfiles()
    },[])
    const setRoleList = ()=>{
        if(book && profilesInView.length>0){
           
                let profiles = book.readers.map(id=>profilesInView.find(profile=>profile.id == id)
                  )  
                  console.log(`rolelist`+JSON.stringify(book))
                 let roleList = profiles.map(prof=>{return new BookRole(`${book.id}_${prof.id}`,prof,book.id,RoleType.reader)})           
                
                 setNewRoles(prevState=>{
                  return [...prevState,...roleList]
              }) 
              console.log(`new ROLES`+JSON.stringify(newRoles))
        }
        if(library && profilesInView.length >0){        
          let profiles = library.readers.map(id=>profilesInView.find(profile=>profile.id == id)
            )  

           let roleList = profiles.map(prof=>{return new LibraryRole(`${library.id}_${prof.id}`,prof,library.id,RoleType.reader)})           
        setNewRoles(prevState=>{
            return [...prevState,...roleList]
        })
    }
    }
    const handleChosingProfileRole =(profile,role)=>{

        if(library){
            const br = new LibraryRole( `${library.id}_${profile.userId}`,
            profile,
            library.id,
            role
            )
            if(role.length > 0){
               
                let profiles = profileList.filter(prof=>{
                    return profile.id != prof.id
                })
                setNewRoles(prevState=>{
                    return [...prevState,br]
                })
                setProfileList(profiles)
                
            }else{
               let roles = newRoles.filter(role=>role.profile.id == profile.id)
               setNewRoles(roles) 
               setProfileList(prevState=>{
                    return [...prevState, profile]
                })
            }
        }
        if(book){
            const br = new BookRole( `${book.id}_${profile.userId}`,
            profile,
            book.id,
            role
            )
            if(role.length > 0){
               
                let profiles = profileList.filter(prof=>{
                    return profile.id != prof.id
                })
                
                setNewRoles(prevState=>{
                    return [...prevState,br]
                })
                setProfileList(profiles)
               
            }else{
               let roles = newRoles.filter(role=>role.profile.id == profile.id)
               setNewRoles(roles) 
               setProfileList(prevState=>{
                    return [...prevState, profile]
                })
            }
        }
     

        
       
    }
    const setOldRoles = ()=>{
        if(library){
            let writers =library.writers.map(wUId=> {
               let profile = profilesInView.find(profile=>profile.userId == wUId)
               let role =new LibraryRole("",profile,library.id,RoleType.writer)
               return role
            })
           let editors = library.editors.map(wUId=> {
               let profile = profilesInView.find(profile=>profile.userId == wUId)
               let role =new LibraryRole("",profile,library.id,RoleType.editor)
               return role
            })
            let readers = library.readers.map(wUId=> {
                let profile = profilesInView.find(profile=>profile.userId == wUId)
                let role =new LibraryRole("",profile,library.id,RoleType.reader)
                return role
             })
            let commenters = library.commenters.map(wUId=> {
                let profile = profilesInView.find(profile=>profile.userId == wUId)
                let role =new LibraryRole("",profile,library.id,RoleType.commenter)
                return role
             })
            let roleList = [...writers,...editors,...readers,...commenters]
            setNewRoles(roleList)
        } 
        
        if(book){
            let writers =book.writers.map(wUId=> {
                let profile = profilesInView.find(profile=>profile.userId == wUId)
                let role =new BookRole(`${book.id}_${profile.userId}`,profile,book.id,RoleType.writer)
                return role
             })
            let editors = book.editors.map(wUId=> {
                let profile = profilesInView.find(profile=>profile.userId == wUId)
                let role =new BookRole("",profile,book.id,RoleType.editor)
                return role
             })
             let readers = book.readers.map(wUId=> {
                 let profile = profilesInView.find(profile=>profile.userId == wUId)
                 let role =new BookRole("",profile,book.id,RoleType.reader)
                 return role
              })
             let commenters = book.commenters.map(wUId=> {
                 let profile = profilesInView.find(profile=>profile.userId == wUId)
                 let role =new BookRole("",profile,book.id,RoleType.commenter)
                 return role
              })
             let roleList = [...writers,...editors,...readers,...commenters]
             setNewRoles(roleList)
        }
    }
    
    
    const bookRolesView =  ()=>{
        if(newRoles!=null && newRoles.length > 0){
    
            return (<div>
                {       
                        newRoles.map((role)=>{
                            let username = ""
                            let id = ""
                            let profile = profilesInView.find(prof=>prof.id==role.profileId)
                            // if(profile){
                            //     username=profile.username
                            //     id = profile.id
                            // }
                            return(<div class="role-item" key={role.profile.id}>
                                <div>
                                    {role.profile.username}
                                </div>
                                <div>
                                <Dropdown>
                                    <MenuButton>
                                    {role.role}
                                    </MenuButton>
                                    <Menu>
                                        <MenuItem onClick={()=>handleChosingProfileRole(profile,"")}>
                                            Delete
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.editor)}>
                                            Editor
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.writer)}>
                                            Writer
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.commenter)}>
                                            Commenter
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.reader)}>
                                            Reader
                                        </MenuItem>
                                    </Menu>
                                </Dropdown>
                                </div>
                                </div>)
                        })
                    }
            </div>)
        }else{
            return(<div >
    
            </div>)
        }
    }
        return ( 
        <div className="role-list">
           
           <label>Contributors   </label>
            <div className="item-roles">
           
                {bookRolesView()}
                
            </div>
           
            <div className="profile-list">
        <InfiniteScroll
        dataLength={profileList.length}
        next={fetchProfiles}
        hasMore={profileHasMore} // Replace with a condition based on your data source
        loader={<p>Loading...</p>}
        endMessage={<p>No more data to load.</p>}
        scrollableTarget="scrollableDiv"
        >
            {profileList.map(profile=>{

                return(<div className="role-item" key={profile.id}>
                    {profile.username}
                    <Dropdown>
                        <MenuButton>
                            Role
                        </MenuButton>
                        <Menu>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.editor)}>
                                Editor
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.writer)}>
                                Writer
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.commenter)}>
                                Commenter
                            </MenuItem>
                            <MenuItem onClick={()=>handleChosingProfileRole(profile,RoleType.reader)}>
                                Reader
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </div>)
            })}
        </InfiniteScroll>
        </div>
        </div>)
}