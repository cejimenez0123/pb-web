import { useState,useEffect } from "react"
import { useSelector } from "react-redux"
import BookRole from "../domain/models/bookrole"
import LibraryRole from "../domain/models/library_role"
import { MenuItem } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { MenuButton } from '@mui/base/MenuButton'
import { Menu } from '@mui/base/Menu';
import { RoleType } from "../core/constants";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchAllProfiles } from "../actions/UserActions";
import { useDispatch } from "react-redux";
import Role from "../domain/models/role";
import Contributors from "../domain/models/contributor";
import PageRole from "../domain/models/page_role";
import checkResult from "../core/checkResult"
export default function RoleList({getRoles,item,type}) {
    const dispatch = useDispatch()
    const [newRoles, setNewRoles ]= useState([])
    const profilesInView = useSelector(state=>state.users.profilesInView)
    const editingPage = useSelector(state=>state.pages.editingPage)
    const [profileHasMore,setProfileHasMore]= useState(false)
    const [profileList,setProfileList] = useState([])
    const setProfiles=()=>{
        const list = profilesInView.filter(profile=>{
            const roleFound  = newRoles.find(role=>
                role.profile.id == profile.id)
            return !roleFound
           
        })
        setProfileList(list)
    }
    useEffect(()=>{
        setProfiles()
    },[newRoles])
    const fetchProfiles=()=>{
     if(profilesInView!=null && profilesInView.length>0){
            setProfiles()
            setRoleList()
            setOldRoles()
           
       }else{
        dispatch(fetchAllProfiles()).then((result) => {
            
            checkResult(result,payload=>{
                setProfiles()
                setRoleList()
                setOldRoles()
                
              
            },err=>{

            })
          
            
           
        })
       }
    }
    
    useEffect(()=>{
        fetchProfiles()
    },[])
    useEffect(()=>{
        getRoles(newRoles)
    },[newRoles]) 

    const createContributors=(item,type)=>{
       let readers = item.readers.map(id=>{
        let profile = profilesInView.find(profile=>profile&& id && profile.userId == id)
        if(type=="book"){
            return new BookRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.reader)
        }else if(type=="library"){
            return new LibraryRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.reader)
        }else if(type=="page"){
            return new PageRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.reader)
        }
    })
    let commenters = item.commenters.map(id=>{
        let profile = profilesInView.find(profile=>profile&& id && profile.userId == id)
        if(type=="book"){
            return new BookRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.commenter)
        }else if(type=="library"){
            return new LibraryRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.commenter)
        }else if(type=="page"){
            return new PageRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.commenter)
        }
    })
    let editors = item.editors.map(id=>{
        let profile = profilesInView.find(profile=>profile&& id && profile.userId == id)
        if(type=="book"){
            return new BookRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.editor)
        }else if(type=="library"){
            return new LibraryRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.editor)
        }else if(type=="page"){
            return new PageRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.editor)
        }
    })
    
    let writers = item.writers.map(id=>{
        let profile = profilesInView.find(profile=>profile&& id && profile.userId == id)
        if(type=="book"){
            return new BookRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.writer)
        }else if(type=="library"){
            return new LibraryRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.writer)
        }else if(type=="page"){
            return new PageRole(`${item.id}_${profile.userId}`,profile,item.id,RoleType.writer)
        }
    })
        return new Contributors(commenters,readers,writers,editors)
    }
    const setRoleList = ()=>{
        if(item){
                const contributors = createContributors(item,type)

                
                setNewRoles([...contributors.editors,...contributors.writers,...contributors.readers,...contributors.commenters])
        }
    }
    useEffect(()=>{
        setRoleList()
    },[item])
    const createRole=(type,item,profile,role)=>{
        switch(type){
            case "page":return new PageRole(`${item.id}_${profile.userId}`,profile,item.id,role);
            case "book":return new BookRole(`${item.id}_${profile.userId}`,profile,item.id,role);
            case "library":return new LibraryRole(`${item.id}_${profile.userId}`,profile,item,role);
            default:{
                return new Role(`${item.id}_${profile.userId}`,profile,role)
            }
        }
    }
    const handleChosingProfileRole =(profile,role)=>{
                const newRole = createRole(type,item,profile,role)
             
    
            if(role.length > 0){
                
                let profiles = profileList.filter(prof=>{
                    return profile.id != prof.id
                })
            
                let foundInRole = newRoles.find(role=>role.id===newRole.id)
                if(foundInRole){
                    let list = newRoles
                let updatedRoles =list.map(role=>{
                    if(role.id == newRole.id){
                        return newRole
                    }else{
                        return role
                    }
                })
                setNewRoles(updatedRoles)
                }else{
                setNewRoles(prevState=>{
                    return [...prevState,newRole]
                })}
                setProfileList(profiles)
            }else{
               let roles = newRoles.filter(role=>role.profile.id != profile.id)
               setNewRoles(roles) 
               setProfileList(prevState=>{
                    return [...prevState, profile]
                })
            }
        
    }
    const setOldRoles = ()=>{
            const contributors= createContributors(item,type)
            let roleList = [...contributors.writers,...contributors.editors,...contributors.readers,...contributors.commenters]
            setNewRoles(roleList)
        }
    
    
    
    const bookRolesView =  ()=>{
        if(newRoles!=null && newRoles.length > 0){
    
            return (<div>
                {       
                        newRoles.map((role)=>{
         
                            if(role){
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
                                        <MenuItem onClick={()=>handleChosingProfileRole(role.profile,"")}>
                                            Delete
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(role.profile,RoleType.editor)}>
                                            Editor
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(role.profile,RoleType.writer)}>
                                            Writer
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(role.profile,RoleType.commenter)}>
                                            Commenter
                                        </MenuItem>
                                        <MenuItem onClick={()=>handleChosingProfileRole(role.profile,RoleType.reader)}>
                                            Reader
                                        </MenuItem>
                                    </Menu>
                                </Dropdown>
                                </div>
                                </div>)}else{
                                    return null;
                                }
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
            <label>Users  </label> 
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