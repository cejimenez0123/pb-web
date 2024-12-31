import { useEffect,useLayoutEffect,useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector ,useDispatch } from "react-redux"
import { fetchProfiles } from "../../actions/ProfileActions"
import { fetchStoryRoles, patchRoles } from "../../actions/RoleActions"
import { RoleType } from "../../core/constants"
import Role from "../../domain/models/role"
import close from "../../images/icons/close.svg"
import checkResult from "../../core/checkResult"
import { patchCollectionRoles } from "../../actions/CollectionActions"
function RoleForm({book,onClose}){
    const profiles = useSelector(state=>state.users.profilesInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const storyRoles = useSelector(state=>state.roles.storyRoles)
    const colRoles = useSelector(state=>state.roles.collectionRoles)
    const pending = useSelector(state=>state.roles.loading)
    const [roles,setRoles]=useState([])
    const dispatch = useDispatch()
    
    useLayoutEffect(()=>{
        dispatch(fetchProfiles())

    if(!book.childCollections){
        dispatch(fetchStoryRoles({storyId:book.id})).then(res=>{
            checkResult(res,payload=>{
                setRoles(payload.roles)

            },err=>{

            })
        })}else{


        }
    },[])
    useEffect(()=>{
        if(!book.childCollections){

      let list = storyRoles.map(role=>{
        return new Role(
        role.id,role.profile,role.story,role.role,role.created)
        })
        setRoles(list)
    }
    },[])

    const handlePatchRoles=()=>{
        if(currentProfile){
        if(book.childCollections){
            dispatch(patchCollectionRoles({roles,profileId:currentProfile.id,colId:book.id}))
        }else{
       
            dispatch(patchRoles({roles:roles,profileId:currentProfile.id,storyId:book.id}))
        }}
    }
    const handleUpdateRole=({role,profile})=>{
       let roleI = new Role(null,profile,book,role)
       let newRoles = roles.filter(role=>role.profile.id != profile.id)
        
       setRoles([...newRoles,roleI])
       console.log(roles)
    }
    return(<div className="background-blur h-screen sm:min-w-[30em] overflow-scroll max-h-[80vh] bg-gradient-to-br from-emerald-300 to-emerald-50 px-4">
        <div className="pt-4">
           <div className=" flex text-emerald-900 flex-row justify-between">
            <div>Share</div><img onClick={onClose} src={close}/>
        </div>
        <div className=" py-4 ">
            <p className="text-sm text-emerald-900">{book.title}</p>
        </div>
        <div>
            <button className="
            text-white  botder rounded-full text-xl shadow-sm border-white mb-8 bg-emerald-800"
            onClick={handlePatchRoles}
            >
                Save</button>
        </div>
        <InfiniteScroll
        className="scroll max-h-full sm:max-h-[25em] overflow-y-scroll overflow-x-hidden rounded-lg"
        dataLength={profiles.length}
        next={()=>{

        }}
        hasMore={pending} 
      loader={<p>Loading...</p>}
        endMessage={
            <div className="no-more-data">
                <h6 className="mx-auto w-24 text-center text-2xl text-bold text-emerald-800">Fin</h6>
            </div>
        }>
            
            {profiles.map((profile,i)=>{


                   let role = []
                   if(roles){
                    role = roles.find(role=>role.profile.id==profile.id)
                   }
                return(<div key={i}className="background-blur shadow-sm flex flex-row rounded-full justify-between px-4 bg-opacity-60 bg-emerald-600  my-4 ">
                    <h6 className="text-sm opacity-100 text-white py-4 mx-2 mx-y">
                        {profile.username}</h6>
                        <div className="my-auto w-fit">
                        <div className="dropdown   dropdown-bottom">
  <div tabIndex={0}  role="button" className=" bg-green-800 bg-opeacity-90 py-2  px-4 rounded-full text-white ">{role?role.role:"Role"}</div>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
  <li onClick={()=>handleUpdateRole({role:RoleType.role,profile:profile})}>
    <a className="label text-emerald-600">{RoleType.role}</a></li>
  <li onClick={()=>handleUpdateRole({role:RoleType.reader,profile:profile})}>
    <a className="label text-emerald-600">{RoleType.reader}</a></li>
    <li 
    onClick={()=>handleUpdateRole({role:RoleType.writer,profile:profile})}
    ><a className="label text-emerald-600">{RoleType.writer}</a></li>
    <li
    onClick={()=>handleUpdateRole({role:RoleType.commenter,profile:profile})}
    ><a className="label text-emerald-600">{RoleType.commenter}</a></li>
    <li
    onClick={()=>handleUpdateRole({role:RoleType.editor,profile:profile})}
    ><a className="label text-emerald-600">{RoleType.editor}</a></li>
  </ul>
</div>
  
                    </div></div>)
            })}
            
            </InfiniteScroll> </div></div>)


}

export default RoleForm