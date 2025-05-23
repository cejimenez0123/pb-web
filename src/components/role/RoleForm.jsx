import { useContext, useEffect,useLayoutEffect,useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { useSelector ,useDispatch } from "react-redux"
import { fetchProfiles } from "../../actions/ProfileActions"
import { fetchStoryRoles, patchRoles } from "../../actions/RoleActions"
import { RoleType } from "../../core/constants"
import Role from "../../domain/models/role"
import close from "../../images/icons/clear.svg"
import checkResult from "../../core/checkResult"
import { patchCollectionRoles } from "../../actions/CollectionActions"
import Context from "../../context"
import ProfileCircle from "../profile/ProfileCircle"
function RoleForm({item,onClose}){
    const profiles = useSelector(state=>state.users.profilesInView)
    const currentProfile = useSelector(state=>state.users.currentProfile)
   
    const {error,success,setError,setSuccess}=useContext(Context)
    const pending = useSelector(state=>state.roles.loading)
    const [roles,setRoles]=useState([])
    const dispatch = useDispatch()

    useLayoutEffect(()=>{
        dispatch(fetchProfiles())
    },[])

    useEffect(()=>{
        if(item && item.storyIdList && item.roles){
           const list = item.roles.map(role=>{
                    return new Role(
                    role.id,role.profile,role.collection,role.role,role.created)
                    })
                    setRoles(list)

    }else{
        if(item && item.betaReaders){
            const list = item.betaReaders.map(role=>{
                return new Role(
                role.id,role.profile,role.story,role.role,role.created)
                })
                setRoles(list)
        }
    }
    },[item])

    const handlePatchRoles=()=>{
        if(currentProfile){
        if(item.storyIdList){
            dispatch(patchCollectionRoles({roles,profile:currentProfile,collection:item}))
            .then(
                res=>checkResult(res,payload=>{
                        setSuccess("Successful Save")
                        setError(null)
                },err=>{
                    setError("Error Saved")
                    setSuccess(null)
                })
            )
        }else{
       
            dispatch(patchRoles({roles:roles,profileId:currentProfile.id,storyId:item.id}))     .then(
                res=>checkResult(res,payload=>{
                        setSuccess("Successful Save")
                        setError(null)
                },err=>{
                    setError("Error Saved")
                    setSuccess(null)
                })
            )}
        
        }else{
            setError("No current Profile")
            setSuccess(null)
        }
    }
    const handleUpdateRole=({role,profile})=>{
       let roleI = new Role(null,profile,item,role)
       let newRoles = roles.filter(role=>role.profile.id != profile.id)
        
       setRoles([...newRoles,roleI])
     
    }
    return(<div className="background-blur lg:p-2 h-screen w-[100%] h-[100%] bg-emerald-100 px-4">
                          <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
         {error || success? <div role="alert" className={`alert    ${success?"alert-success":"alert-warning"} animate-fade-out`}>{error?error:success}</div>:null}
       
         </div> <div className="pt-4 px-4">
            
           <div className=" flex text-emerald-900 flex-row justify-between">
            <div className="mont-medium"><h1 className="text-[2rem]">Share</h1></div><img onClick={onClose} src={close}/>
        </div>
        <div className=" py-4 ">
            <p className="text-sm text-emerald-900">{item.title}</p>
        </div>
        <div>
            <div className="
            text-white  border rounded-full flex text-l lg:text-xl w-[8rem] h-[4rem] mont-medium shadow-sm border-white mb-8 bg-emerald-800"
            onClick={handlePatchRoles}
            >
                <h6 className="mx-auto text-[1.2rem] mx-auto my-auto">Save</h6></div>
        </div>
        <InfiniteScroll
        className="scroll max-h-full sm:max-h-[25em] overflow-x-hidden rounded-lg"
        dataLength={profiles.length}
        next={()=>{

        }}
        hasMore={pending} 
      loader={<p>Loading...</p>}
        endMessage={
            <div className="">
                <h6 className="mx-auto w-24 text-center text-2xl text-bold text-emerald-800">Fin</h6>
            </div>
        }>
            
            {profiles.map((profile,i)=>{


                   let role = []
                   if(roles){
                    role = roles.find(role=>role.profile.id==profile.id)
                   }
                return(<div> 

             <div key={i}className=" shadow-sm flex flex-row h-[4em] rounded-full justify-between px-4 bg-opacity-60 bg-transparent border-emerald-600 border-2  my-4 ">
                    <span className="my-auto"><ProfileCircle  profile={profile} color="text-emerald-700"/></span>
                        <div className="my-auto w-fit">
                        <div className={`dropdown  ${i>profiles.length/2?"dropdown-top":"dropdown-bottom"} dropdown-end`}>
  <div tabIndex={0}  role="button" className=" bg-opeacity-90 py-2 w-[9em]  px-4 mont-medium text-emerald-600 flex  ">
    <h6 className="mx-auto underline my-auto">{role?role.role:"Role"}</h6></div>
  <ul tabIndex={0} className="dropdown-content menu bg-emerald-50 rounded-box z-[1] w-52 p-2 shadow">
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
</div>
                    </div></div>)
            })}
            
            </InfiniteScroll> </div></div>)


}

export default RoleForm