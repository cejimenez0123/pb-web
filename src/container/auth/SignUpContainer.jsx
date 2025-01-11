import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture,createProfile } from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import info from "../../images/icons/info.svg"
import "../../App.css"
export default function SignUpContainer(props){
    const location = useLocation();
    const [token, setToken] = useState('');
    const [password,setPassword]=useState("")
    const navigate = useNavigate()
    const [username,setUsername]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [selectedImage, setSelectedImage] = useState(null);
    const [selfStatement,setSelfStatement]=useState("")
    const [file,setFile]=useState(null)
    const [error,setError]=useState(null)
    const [success,setSuccess]=useState(null)
    const [isPrivate,setIsPrivate]=useState(false)
    const [email,setEmail]=useState("")
    const handleFileInput = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        setSelectedImage(null);
    
        return;
      }
      setFile(file)
      setErrorMessage('');
      setSelectedImage(URL.createObjectURL(file));
    }
  };
     const dispatch = useDispatch()
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
          setToken(tokenParam);
        }
      }, [location.search]);
    const completeSignUp=()=>{
        if(password.length>6){
        dispatch(uploadProfilePicture({file:file})).then(res=>checkResult(res,payload=>{
                const{fileName}=payload
                const params = {email,token,password,username,profilePicture:fileName,selfStatement,privacy:isPrivate}
                dispatch(createProfile(params))
                .then(res=>checkResult(res,payload=>{
                   const {profile}=payload
                    localStorage.setItem("token",payload.token)
                   if(profile){navigate(Paths.myProfile())}else{
                    setError("Error creating profile")
                    setSuccess(null)
                   }
                },err=>{
                    setSuccess(null)
                    setError(err.messgage)
                }))
        },err=>{
          setSuccess(null)
          setError(err.message)
       
        }))
      }
    }
    return(
                <div  className=" ">
 <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
   {error || success? 
  <div role="alert" className={`alert    
  ${success?"alert-success":"alert-warning"} animate-fade-out`}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0 stroke-current"
    fill="none"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{error?error:success}</span>
</div>:null}</div>

        <div className=" px-4 my-2  bg-emerald-700 bg-opacity-80 rounded-lg max-w-[96%] md:max-w-[42em] md:px-12 mx-auto">
          <div className="flex">
        <h2 className='text-green-100 poppins text-4xl text-center mx-auto pt-8  px-4 md:pt-24 md:pb-8'>Complete Sign Up</h2>
        </div>
        <div className='pb-4 mx-auto'>
        <label className="input poppins text-white border bg-transparent rounded-full h-[4em]  border-white  mt-4 flex items-center ">
Email
  <input className="grow text-white mx-2 " 
         value={email}
         placeholder="email"
         onChange={(e) => setEmail(e.target.value.trim())}
         />
</label>
            <label className="input poppins text-white border bg-transparent rounded-full h-[4em]  border-white  mt-4 flex items-center ">
  Username
  <input className="grow text-white mx-2 " 
         value={username}
         placeholder="username"
         onChange={(e) => setUsername(e.target.value.trim())}
         />
</label>
{username.length==0 || username.length>6?null:<h6>Minimum username length is 4 characters</h6>}    
<div className='pb-4'>
            <label className="input poppins text-white border bg-transparent  rounded-full h-[4em] border-white  mt-4 flex items-center">
  Password
  <input type="password" className="grow  mx-2  my-2 text-white " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
</label>
{password.length==0 || password.length>6?null:<h6>Minimum Password Length is 6 characters</h6>}    
<label className="input poppins text-white border bg-transparent border-white  rounded-full h-[4em] mt-4 flex items-center ">
  Confirm Password
  <input type="password" className="grow  p-2 mx-2 text-white " 
         value={confirmPassword}
         
         onChange={(e) => setConfirmPassword(e.target.value.trim())}
        placeholder='*****' />
</label>  

<label className="w-full mt-8 flex flex-row justify-content-between  text-left">
<div className="flex flex-row">
  <div className='has-tooltip mx-2'>
 <img src={info}/> <span className=' bg-slate-50 text-emerald-800 rounded-lg p-2 is-tooltip'>Do you want to found?</span>
</div>
    <span>Will your account be private?</span>    </div>

<input value={isPrivate} onChange={(e)=>setIsPrivate(e.target.checked)}
    type="checkbox" className="toggle my-auto toggle-success"  />



</label>


    </div>
    <div className="text-left">
      <label className="flex font-bold text-left pb-2 flex-col">
        Add a Profile Picture
        </label>
    <input
    className="file-input my-8  text-left w-[100%] md:max-w-[20em]"
        type="file"
        accept="image/*"
        onInput={handleFileInput}
     
       
      />
   </div>   
{/* </label> */}

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
      <label className="text-left  min-w-[100%] mx-auto poppins text-xl font-bold  mb-2">Self Statement </label> 
      <textarea 
      placeholder="What are you about?"
      className="textarea bg-transparent border w-[100%]  border-white text-l lg:text-xl" value={selfStatement} onChange={(e)=>setSelfStatement(e.target.value)}/>
         <div
            disabled={confirmPassword!==password&&username.length>4}
            className='bg-cyan-500 poppins text-white max-w-[16em] mx-auto mb-12 flex border hover:bg-emerald-400  border-0 text-white py-2 rounded-full px-4 mt-4 min-h-12 '
               onClick={completeSignUp}
                
                 ><h6 className="mx-auto my-auto py-2 text-xl">Join Plumbum!</h6></div>
            </div>
            
            </div>   
        </div>)
}