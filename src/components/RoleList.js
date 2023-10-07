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
export default function RoleList({getRoles,library}) {
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
                    role.profileId == profile.id)
                return !roleFound
            })
            setProfileList(list)
        })
    }
   
    useEffect(()=>{
        getRoles(newRoles)
    },[newRoles]) 
    useEffect(()=>{
        fetchProfiles()
    },[])
    const handleChosingProfileRole =(profile,role)=>{
        const br = new LibraryRole( `${library.id}_${profile.userId}`,
            profile.userId,
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
           let roles = newRoles.filter(role=>role.profile == profile.id)
           setNewRoles(roles) 
           setProfileList(prevState=>{
                return [...prevState, profile]
            })
        }}
    
    
    const bookRolesView =  ()=>{
        if(newRoles!=null && newRoles.length > 0){
    
            return (<div>
                {       
                        newRoles.map((role)=>{
                            let username = ""
                            let id = ""
                            let profile = profilesInView.find(prof=>prof.id==role.profileId)
                            if(profile){
                                username=profile.username
                                id = profile.id
                            }
                            return(<div key={id}>
                                <div>
                                    {username}
                                </div>
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
        <div>
            <div className="book-roles">
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

                return(<div key={profile.id}>
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