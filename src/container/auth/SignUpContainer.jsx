import { useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture,createProfile } from "../../actions/ProfileActions";
import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";


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
    const [errorMessage, setErrorMessage] = useState('');
    const [isPrivate,setIsPrivate]=useState(false)
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

        dispatch(uploadProfilePicture({file:file})).then(res=>checkResult(res,payload=>{
                const{fileName}=payload
                const params = {token,password,username,profilePicture:fileName,selfStatement,privacy:isPrivate}
                dispatch(createProfile(params))
                .then(res=>checkResult(res,payload=>{
                   const {profile}=payload
                    localStorage.setItem("token",payload.token)
                   if(profile) navigate(Paths.myProfile())
                },err=>{
                    alert("profile"+JSON.stringify(err))
                }))
        },err=>{
            alert("profilepicture"+JSON.stringify(err))
        }))
    }
    return(
                <div  className="">
        <h2 className='text-green-100 poppins text-4xl pt-4 pb-4'>Complete Sign Up</h2>
        <div className="max-w-96 mx-auto">
        <div className='pb-4'>
            <label className="input poppins text-white border bg-transparent border-white  mt-4 flex items-center gap-2">
  Username
  <input className="grow text-white " 
         value={username}
         
         onChange={(e) => setUsername(e.target.value.trim())}
         />
</label>
<div className='pb-4'>
            <label className="input poppins text-white border bg-transparent border-white  mt-4 flex items-center gap-2">
  Password
  <input type="password" className="grow text-white " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
</label>      
<label className="input poppins text-white border bg-transparent border-white  mt-4 flex items-center gap-2">
  Confirm Password
  <input type="password" className="grow text-white " 
         value={confirmPassword}
         
         onChange={(e) => setConfirmPassword(e.target.value.trim())}
        placeholder='*****' />
</label>  
<label className="w-full mt-4 flex flex-row justify-content-between  text-left">
    <span>Is Private?</span><input value={isPrivate} onChange={(e)=>setIsPrivate(e.target.checked)}
    type="checkbox" className="toggle my-auto toggle-success"  /></label>
    </div>
    <div className=" flex flex-col">
    <input
    className="file-input mx-auto max-w-48"
        type="file"
        accept="image/*"
        onInput={handleFileInput}
       
      />

    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
      <label className="text-left mb-2">Self Statement </label> 
      <textarea 
      placeholder="What are you about?"
      className="textarea bg-transparent border border-white text-xl" value={selfStatement} onChange={(e)=>setSelfStatement(e.target.value)}/>
         <button
            disabled={confirmPassword!==password}
            className='bg-green-900 poppins border-none hover:bg-green-400 text-white font-bold py-2 px-4 mt-4 btn-lg rounded '
               onClick={completeSignUp}
                
                variant="contained" >Submit</button>
            </div>
            </div>  
            </div>   
        </div>)
}