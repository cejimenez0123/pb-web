import React ,{useState} from 'react'
import "../../App.css"
import { logIn,signUp,uploadProfilePicture} from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {InputAdornment,
        IconButton, 
        TextField ,
        Checkbox, 
        FormControlLabel,
        Button, 
        FormGroup, 
        Dialog,
        Typography} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { VisibilityOff,Visibility } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import {sendPasswordResetEmail } from "firebase/auth";
import theme from '../../theme';
import { Clear } from '@mui/icons-material';
import { auth } from '../../core/di';
import checkResult from '../../core/checkResult';
import ReactGA from "react-ga4"
import Paths from '../../core/paths';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

function LogInContainer(props) {
    const dispatch = useDispatch()
    const [loading,setLoading]=useState(true)
    const [suUsername, setSuUsername] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [selfStatement,setSelfStatement] = useState('')
    const [profilePicture, setProfilePicture] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png')
    const [privacy, setPrivacy] = useState(false)
    const [liEmail, setLiEmail] = useState('');
    const [liPassword, setLiPassword] = useState('');
    const [signUpError, setSignUpError] = useState(false)
    const [logInError,setLogInError] = useState(false)
    const navigate = useNavigate()
    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })



    // const handleProfilePicture =(e)=>{
    //     const files = Array.from(e.target.files)
    //     const params = { file: files[0]
    //     }
    //     dispatch(uploadProfilePicture(params)).then((result) => {
    //         checkResult(result,(payload)=>{
    //             const {url}= payload
    //             setProfilePicture(url)
    //         },(err)=>{
    //             window.alert(err.message)
    //             setSignUpError(true)
    //         })
    
    //     })
    // }

    const handleLogIn = (event)=>{
        event.preventDefault()
        if(liEmail.length>3 && liPassword.length>6){
            const params ={email:liEmail,password:liPassword}
            dispatch(logIn(params))
            navigate(Paths.myProfile())
        }else{
            setLogInError(true)
        }
    }
  
    return (
        <div id="">
         
            <LogInCard  setError={setLogInError}
                        error={logInError}
                        password={liPassword} 
                        email={liEmail}
                        handleSubmit={(e)=>handleLogIn(e)}
                        setEmail={setLiEmail}
                        setPassword={(str)=>setLiPassword(str)}/>
         
        </div>
    )
}

const inputStyle = {
    width: '95%',
    backgroundColor:theme.palette.primary.contrastText,
    marginTop:"1em",
    marginBottom:"1em",
    marginLeft:"1em"
}



function LogInCard(props){
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("")
    const [open,setOpen] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    const handleFirstTimeClick=()=>{
        navigate("/apply")
    }
    
    return(<div className='md:max-w-[42rem] bg-dark lg:mt-36 sm:mt-12 rounded-lg form-control  border-dark border mx-auto p-4'>
        <div  id="log-in">
        <h1 className='text-green-100 poppins pb-4'> Log In</h1>
        <div >
            <div className='pb-4 '>
        <label className="input poppins text-green-100 bg-dark border border-slate-100 flex items-center gap-2">
  Email
  <input type="text" className="grow  overflow-hidden text-green-100" 
         value={props.email} 
         onChange={(e) => props.setEmail(e.target.value)}
        placeholder='example@x.com' />
</label>
</div>
<div className='pb-4'>
            <label className="input poppins text-green-100 mt-4c bg-dark border border-slate-100 flex items-center gap-2">
  Password
  <input type="password" className="grow text-green-100 " 
         value={props.password}
         
         onChange={(e) => props.setPassword(e.target.value.trim())}
        placeholder='*****' />
</label>      
    </div>
            <div 
                className='text-green-100 poppins hover:text-green-400'
                onClick={()=>{
                    setOpen(true)
                }}>
                <a>Forgot Password?</a>
            </div>
            <button
            className='bg-green-600 poppins border-none hover:bg-green-400 text-white font-bold py-2 px-4 mt-4 btn-lg rounded '
               onClick={props.handleSubmit}
                
                variant="contained" >Submit</button>
                
        </div>
        <div className='mt-4 p-4'>
        <a  onClick={handleFirstTimeClick}className='text-green-100 poppins hover:text-green-400  '>Click here if this your first time?</a>
        </div>
        <div>
        
        </div>
        <Dialog
       
        open={open}
        onClose={()=>{setOpen(false)}}
      
                >
                <div>
                    <Clear onClick={
                        ()=>setOpen(false)
                    }/>    
                </div>  

                    <FormGroup
                     style={{
                       
                            marginLeft: inputStyle.marginLeft,
                            margin:"4em auto 0em auto ",
                            padding:"2em",
                            minWidth: "20em"
                            }}  
                    
                     >
                         <Typography 
                    id="modal-modal-title" variant="h6" component="h2"
                    >
      Forgot Password
    </Typography>

                        <TextField 
                            label="E-mail" 
                            value={forgotEmail} 
                            style={{marginTop:"4em",
                            width:"90%",
                                    marginBottom:"2em",
                                    backgroundColor:theme.palette.secondary.contrastText}}
                            onChange={(e)=>setForgotEmail(e.target.value)}
                        />
                        <Button 
                            style={{backgroundColor:theme.palette.secondary.main,
                                    color:theme.palette.secondary.contrastText}}
                            variant='outlined'
                            onClick={()=>{
                                if(forgotEmail.length > 0){
                                sendPasswordResetEmail(auth, forgotEmail)
                                .then(() => {
                                  window.alert("Email Sent!")
                                })
                                .catch((error) => {
                                  const errorCode = error.code;
                                  const errorMessage = error.message;
                                  if(error.message.includes("(auth/user-not-found)")){
                                    window.alert("User not found")
                                  }
                            
                                  // ..
                                });}else{
                                    window.alert("Please write an email")
                                }
                            }}>
                            Send
                        </Button>
                    </FormGroup>
                </Dialog>
                </div>
    </div>)
}


export default LogInContainer