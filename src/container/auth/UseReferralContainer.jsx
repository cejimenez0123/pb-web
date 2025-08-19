import { useLocation, useNavigate,  useSearchParams } from "react-router-dom";
import { useState,useEffect, useContext,useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture} from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import info from "../../images/icons/info.svg"
import "../../App.css"
import {  useReferral } from "../../actions/UserActions";
import Context from "../../context";
import authRepo from "../../data/authRepo";
import { debounce } from "lodash";
import setLocalStore from "../../core/setLocalStore";
import DeviceCheck from "../../components/DeviceCheck";
import { Preferences } from "@capacitor/preferences";
export default function UseReferralContainer(props){
    const location = useLocation();
    const isNative = DeviceCheck()
    const query = new URLSearchParams(location.search);
    const selectRef = useRef()
    const [token, setToken] = useState(query.get("token"));
    const [password,setPassword]=useState("")
    const navigate = useNavigate()
    const [email,setEmail]=useState("")
    const [username,setUsername]=useState("")
    const searchParams = useSearchParams()
    const [confirmPassword,setConfirmPassword]=useState("")
    const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
    const [selfStatement,setSelfStatement]=useState("")
    const [file,setFile]=useState(null)
    const {error,setError,setSuccess,success}=useContext(Context)
    const [frequency,setFrequency]=useState(1)
    const [isPrivate,setIsPrivate]=useState(false)
    const [usernameUnique,setUsernameUnique]=useState(true)
    const [canUser,setCanUser]=useState(false)
    const handleUsername=(e)=>{
      setUsername(e.target.value.trim())
    
    }
    useEffect(()=>{
      if(confirmPassword==password){
        if(username.length>4){
        setCanUser(usernameUnique)
        }else{
          setCanUser(false)
        }
      }else{
        setCanUser(false)
      }
    },[usernameUnique,password,confirmPassword])
    useEffect(()=>{
     debounce(()=>{
      if(username.length>0){
      authRepo.checkUsername(username).then(data=>{
   
        if(data){
      setUsernameUnique(data.available)
        }else{
          setUsernameUnique(false)
        }
      })}
    }
      ,[10])()
    },[username])
    const handleFileInput = (e) => {
    const img = e.target.files[0];

    if (img) {
   
      if (!img.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        setSuccess(null)
        setSelectedImage(null);
      
        return;
      }
      setFile(img)
      setError(null);
    
      setSelectedImage(URL.createObjectURL(img));
    }
  };
  useEffect(()=>{


setToken(token)


    return

  },[searchParams])
     const dispatch = useDispatch()

    const completeSignUp=()=>{
     let toke = searchParams[0].get("token")
     if(!toke){
      toke = token
     }

    if( password.length>6&&username.length>3){

        if(file){
        dispatch(uploadProfilePicture({file:file})).then(res=>checkResult(res,payload=>{
                const{fileName}=payload
                const params = {email:email,token:toke,password:password,username:username,frequency:frequency,profilePicture:fileName,selfStatement:selfStatement,isPrivate:isPrivate}
      

                        dispatch(useReferral(params)).then(res=>checkResult(res,payload=>{
                          
                          if(payload.message){
                            setError(err.message.includes("400")?"This link has already been put to use.":err.message)
    
                          }
                        
                        },err=>{
                          setError(err.message.includes("400")?"This link has already been put to use.":err.message)
    
                        }))
                    
                .then(res=>checkResult(res,payload=>{
     Preferences.set("firstTime",true).then(()=>{})
                    Preferences.set("token",payload.token).then(()=>{})
                   if(payload.profile){navigate(Paths.myProfile())}else{
                   
                    setSuccess(null)
                   }
                   if(payload.error){
                    setError(payload.error)
                   }
                },err=>{
                    setSuccess(null)
                    if(err.message){
                      setError(err.message.includes("400")?"This link has already been put to use.":err.message)
    
                    }else{
                      setError(err.message.includes("400")?"This link has already been put to use.":err.message)
    
                    }
                }))
     
       
        })
      )
      }else{
        // const params = {email,token:toke,password,username,profilePicture:selectedImage,selfStatement,privacy:isPrivate}
        

      const params = {email:email,
        token:toke,
        password:password,username:username,
        frequency:frequency,
        profilePicture:selectedImage,selfStatement:selfStatement,isPrivate:isPrivate}
      
      dispatch(useReferral(params))
      .then(res=>checkResult(res,payload=>{
        if(payload.message){
          
          setError(payload.message.includes("400")?"This link has already been put to use.":payload.message)
    
        }else{

      if(payload.token){
        Preferences.set("token",payload.token)
      }
       
         if(payload.profile){
          Preferences.set("firstTime",true)
          navigate(Paths.myProfile())}else{
         
          setSuccess(null)
         }
         if(payload.error){
          setError(payload.message.includes("400")?"This link has already been put to use.":payload.message)
    
       
         }}
      },err=>{
          setSuccess(null)
          if(err.message){
            setError(err.message.includes("400")?"This link has already been put to use.":payload.message)
          }else{
            setError(err)
          }
      }))
        // },err=>{

        //       setError(err.mesage)
          
    
        // }))
      }
      }else{
          setError("Password and Username can't be empty")
        }
      
    }
    return(
                <div  className=" ">


        <div className=" px-4 my-2  bg-emerald-700 bg-opacity-80 rounded-lg max-w-[96%] md:max-w-[42em] md:px-12 mx-auto">
          <div className="flex">
        <h2 className='text-green-100 mont-medium text-4xl text-center mx-auto pt-8  px-4 md:pt-24 md:pb-8'>Complete Sign Up</h2>
        </div>
        <div className='pb-4 mx-auto'>
      
        <label className="input mont-medium text-white border bg-transparent rounded-full h-[4em]  border-white  mt-4 flex items-center ">
Email
  <input className="grow text-white mx-2 " 
         value={email}
         placeholder="example@x.com"
         onChange={(e) => setEmail(e.target.value.trim())}
         />
</label>
            <label className="input mont-medium text-white border bg-transparent rounded-full h-[4em]  border-white  mt-4 flex items-center ">
  Username
  <input className="grow text-white mx-2 " 
         value={username}
         placeholder="username"
         onChange={(e) => handleUsername(e)}
         />
</label>
<span className="flex flex-col">
{ username.length!=0 && username.length<4?<h6 className="text-white mx-4 my-1 open-sans-medium">Minimum username length is 4 characters</h6>:null}    
{usernameUnique?null:<h6 className="text-white mx-4 my-1 open-sans-medium">Username is alredy taken</h6>}
</span>
<div className='pb-4'>
            <label className="input mont-medium text-white border bg-transparent  rounded-full h-[4em] border-white  mt-4 flex items-center">
  Password
  <input type="password" className="grow  mx-2  my-2 text-white " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
</label>
{password.length==0 || password.length>6?null:<h6 className="text-white mx-4 my-1 open-sans-medium">Minimum Password Length is 6 characters</h6>}  

<label className="input mont-medium text-white border bg-transparent border-white  rounded-full h-[4em] mt-4 flex items-center ">
  Confirm Password
  <input type="password" className="grow  p-2 mx-2 text-white " 
         value={confirmPassword}
         
         onChange={(e) => setConfirmPassword(e.target.value.trim())}
        placeholder='*****' />
</label>  
{password==confirmPassword?null:<h6 className="text-white mx-4 my-1 open-sans-medium">Passwords need to match</h6>}  
<label className="w-full mt-8 flex flex-row justify-between  text-left">
<div className="flex  flex-row">
  <div className='has-tooltip mx-2'>
 <img src={info}/> <span className=' bg-slate-50 text-emerald-800 rounded-lg p-2 is-tooltip'>Would you like to be hidden from search?</span>
</div>
    <span className="text-white text-l open-sans-medium">Will your account be private?</span>    </div>
    <div className="flex flex-row">
<h6 className="mx-2  my-auto text-white ">{isPrivate?"Yes":"No"}</h6>
<input value={isPrivate} onChange={(e)=>setIsPrivate(e.target.checked)}
    type="checkbox" className="toggle my-auto toggle-success"  />

</div>

</label>


    </div>
    <div className="mb-8 flex flex-col mx-auto">
      <label className="flex font-bold text-white mont-medium text-xl text-left pb-2 flex-col">
        Add a Profile Picture
        </label>
    <input
    className="file-input my-8 mx-auto text-left  max-w-[90%] lg:w-72 mx-auto"
        type="file"
        accept="image/*"
        onInput={handleFileInput}
      />
   </div>   
{/* </label> */}
<div className="max-w-72 mx-auto mb-8">
      {selectedImage && (
        <div style={{ marginTop: '20px' }}>
          
          <img
          className="mx-auto"
            src={selectedImage}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px' }}
          />
        </div>
        
      )}
      </div>
      <div>
      <div className="mb-4 flex flex-row justify-between">
          <label className="block text-white mont-medium text-[1.5rem] font-semibold mb-2">
            Email Frequency
          </label>
          <select
            className="w-full bg-white select text-emerald-700 mont-medium select-bordered "
            value={frequency}
            ref={selectRef}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option className="text-emerald-700" value={1}>daily</option>
            <option  className="text-emerald-700" value={2}>Every 3 days</option>
            <option  className="text-emerald-700" value={3}>Weekly</option>
            <option  className="text-emerald-700" value={14}>Every 2 Weeks</option>
            <option  className="text-emerald-700" value={30}>Monthly</option>

          </select>
        </div>
      </div>
      <label className="text-left  min-w-[100%] mx-auto mont-medium text-xl text-white my-1 font-bold  mb-2">Self Statement </label> 
      <textarea 
      placeholder="What are you about?"
      className="textarea bg-transparent border w-[100%]  border-white text-md lg:text-l" value={selfStatement} onChange={(e)=>setSelfStatement(e.target.value)}/>
         <div
            disabled={!canUser}
            className={`${canUser?"bg-gradient-to-r from-emerald-500  to-emerald-700  ":"bg-gradient-to-r from-slate-300  to-emerald-500"} btn bg-transparent border-none mont-medium text-white max-w-[18em] mx-auto mb-12 flex border hover:bg-emerald-400  border-0 text-white py-2 rounded-full px-4 mt-8 min-h-14 `}
               onClick={completeSignUp}
                
                 ><h6 className="px-1 text-xl">Join Plumbum!</h6></div>
            </div>
            
            </div>   
        </div>)
}