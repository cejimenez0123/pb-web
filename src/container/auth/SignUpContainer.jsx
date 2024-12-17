import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";


export default function SignUpContainer(props){
    const location = useLocation();
    const [token, setToken] = useState('');
    const [password,setPassword]=useState("")
    const [username,setUsername]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
    const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        setSelectedImage(null);
        return;
      }

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
        {id,token,password,username,profilePicture,selfStatement,privacy
       
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
            const params = { file: file
            }
        }
    
    }}
        URL.createObjectURL(file)
    }
    return(
                <div  id="log-in">
        <h1 className='text-green-100 poppins pb-4'>Complete Sign Up</h1>
        <div className="max-w-96 mx-auto">
        <div className='pb-4'>
            <label className="input poppins text-white border bg-transparent border-white  mt-4 flex items-center gap-2">
  Username
  <input type="password" className="grow text-white " 
         value={username}
         
         onChange={(e) => setUsername(e.target.value.trim())}
        placeholder='*****' />
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
    </div>
    <input
    className="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '20px' }}
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
      
            <button
            disabled={confirmPassword!==password}
            className='bg-green-600 poppins border-none hover:bg-green-400 text-white font-bold py-2 px-4 mt-4 btn-lg rounded '
               onClick={completeSignUp}
                
                variant="contained" >Submit</button>
            </div>
            </div>     
        </div>)
}