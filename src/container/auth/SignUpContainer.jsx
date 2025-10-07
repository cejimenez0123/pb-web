import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState,useEffect,useRef, useContext, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePicture} from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import info from "../../images/icons/info.svg"
import "../../App.css"
import { signUp } from "../../actions/UserActions";
import Context from "../../context";
export default function SignUpContainer(props){
    const location = useLocation();
    const currentProfile = useSelector(state=>state.users.currentProfile)
    useLayoutEffect(()=>{
      if(currentProfile){
        navigate(Paths.myProfile())
      }
    },[currentProfile])
    const [token, setToken] = useState('');
    const [password,setPassword]=useState("")
    const navigate = useNavigate()
    const [username,setUsername]=useState("")
    const searchParams = useSearchParams()
    const selectRef = useRef()
    const [confirmPassword,setConfirmPassword]=useState("")
    const [selectedImage, setSelectedImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png");
    const [selfStatement,setSelfStatement]=useState("")
    const [file,setFile]=useState(null)
    const {setError,setSuccess,success,seo,setSeo}=useContext(Context)
    const [frequency,setFrequency]=useState(1)
    const [isPrivate,setIsPrivate]=useState(false)
    const [email,setEmail]=useState("")
    useLayoutEffect(()=>{
      let soo = seo
      soo.title= "Plumbum (Sign Up) - Your Writing, Your Community"
      setSeo(soo)
    
    },[])
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
  useLayoutEffect(()=>{

let toke = searchParams[0].get("token")
if(toke&&toke.length>0){
setToken(toke)

localStorage.setItem("token",toke)
}
    return

  },[searchParams])
     const dispatch = useDispatch()

    const completeSignUp=()=>{
     let toke = searchParams[0].get("token") &&searchParams[0].get("token").length>0?searchParams[0].get("token"):localStorage.getItem("token")
     if(!toke){
      toke = token
      return setError("Try reusing the link")
     }
     
    if( password.length>6&&username.length>3){
        if(file){
        dispatch(uploadProfilePicture({file:file})).then(res=>checkResult(res,payload=>{
                const{fileName}=payload
                const params = {email,token:toke,password,username,frequency,profilePicture:fileName,selfStatement,privacy:isPrivate}
                dispatch(signUp(params))

                .then(res=>checkResult(res,payload=>{
                  
                   if(payload.profile){navigate(Paths.myProfile())}else{
                   localStoage.setItem("firstTime",payload.firstTime)
                    setSuccess(null)
                   }
                   if(payload.error){
                    setError(payload.error)
                   }
                },err=>{
                    setSuccess(null)
                    if(err.message){
                      setError(err.mesage)
                    }else{
                      setError(err)
                    }
                }))
     
       
        })
      )
      }else{
        const params = {email,token:toke,password,username,profilePicture:selectedImage,selfStatement,privacy:isPrivate}
      dispatch(signUp(params))
        .then(res=>checkResult(res,payload=>{
            const {profile}=payload
            localStorage.setItem("firstTime",payload.firstTime)
           if(profile){
            
            navigate(Paths.myProfile())}
           else{
            setSuccess(null)
            setError("Try reusing the link")
           }
          
        },err=>{

              setError(err.mesage)
          
    
        }))}}else{
          setError("Password and Username can't be empty")
        }
      
    }
    return(
                <div  className=" ">


        <div className=" px-4 my-2  bg-emerald-700 bg-opacity-80 rounded-lg max-w-[96%] md:max-w-[42em] md:px-12 mx-auto">
          <div className="flex">
        <h2 className='text-green-100 lora-medium text-4xl text-center mx-auto pt-8  px-4 md:pt-24 md:pb-8'>Complete Sign Up</h2>
        </div>
        <div className='pb-4 mx-auto'>
   
            <label className="input lora-medium text-white border bg-transparent rounded-full h-[4em]  border-white  mt-4 flex items-center ">
  Username
  <input className="grow text-white mx-2 " 
         value={username}
         placeholder="username"
         onChange={(e) => setUsername(e.target.value.trim())}
         />
</label>
{username.length!=0 && username.length<4?<h6>Minimum username length is 4 characters</h6>:null}    
<div className='pb-4'>
            <label className="input lora-medium text-white border bg-transparent  rounded-full h-[4em] border-white  mt-4 flex items-center">
  Password
  <input type="password" className="grow  mx-2  my-2 text-white " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
</label>
{password.length==0 || password.length>6?null:<h6>Minimum Password Length is 6 characters</h6>}  

<label className="input lora-medium text-white border bg-transparent border-white  rounded-full h-[4em] mt-4 flex items-center ">
  Confirm Password
  <input type="password" className="grow  p-2 mx-2 text-white " 
         value={confirmPassword}
         
         onChange={(e) => setConfirmPassword(e.target.value.trim())}
        placeholder='*****' />
</label>  
{password==confirmPassword?null:<h6>Passwords need to match</h6>}  
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
      <label className="flex font-bold text-white lora-medium text-xl text-left pb-2 flex-col">
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
      <label className="text-left  min-w-[100%] text-white mx-auto lora-medium text-xl font-bold  mb-2">Self Statement </label> 
      <textarea 
      placeholder="What are you about?"
      className="textarea bg-transparent border w-[100%]  border-white text-md lg:text-l" value={selfStatement} onChange={(e)=>setSelfStatement(e.target.value)}/>
         <div
            disabled={confirmPassword!==password&&username.length>4}
            className='bg-green-600 mont-medium text-white max-w-[18em] mx-auto mb-12 flex border hover:bg-emerald-400 bg-gradient-to-r from-emerald-300  to-emerald-500  border-0 text-white py-2 rounded-full px-4 mt-8 min-h-14 '
               onClick={completeSignUp}
                
                 ><h6 className="mx-auto my-auto py-4 px-1 text-xl">Join Plumbum!</h6></div>
            </div>
            
            </div>   
        </div>)
}