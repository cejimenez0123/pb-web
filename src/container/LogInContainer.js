import React ,{useState} from 'react'
import "../App.css"
import { logIn,signUp,uploadProfilePicture} from '../actions/UserActions';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {InputAdornment,
        IconButton, 
        TextField ,
        Checkbox, 
        FormControlLabel,
        Button, 
        FormGroup, 
        Typography} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { VisibilityOff,Visibility } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import {sendPasswordResetEmail } from "firebase/auth";
import theme from '../theme';
import { Modal } from '@mui/joy';
import { auth } from '../core/di';
import checkResult from '../core/checkResult';
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
    const handleNewUser = (event) => {
        event.preventDefault();
       if(suEmail.length>0 && suPassword.length > 6 && suUsername.length>2){
        const params ={email:suEmail,
                        password:suPassword,
                        username:suUsername,
                        profilePicture:profilePicture,
                        selfStatement:selfStatement,
                        privacy:privacy}
                      
        dispatch(signUp(params)).then((result) => {
            checkResult(result,payload=>{
                const {profile} = payload
                navigate("/profile/home")
            },()=>{
                setSignUpError(true)
            })

        }).catch((err) => {
            
        });;
    }else{
        setSignUpError(true)
    }
    };
    const handleProfilePicture =(e)=>{
        const files = Array.from(e.target.files)
        const params = { file: files[0]
        }
        dispatch(uploadProfilePicture(params)).then((result) => {
            checkResult(result,(payload)=>{
                const {url}= payload
                setProfilePicture(url)
            },()=>{
                setSignUpError(true)
            })
    
        })
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
        if(liEmail.length>3 && liPassword.length>6){

      
        const params ={email:liEmail,password:liPassword}
        dispatch(logIn(params)).then((result) => {
        checkResult(result,payload=>{
            navigate("/profile/home")
        },()=>{
            setLogInError(true)
        })
          
        }).catch((err) => {
            
        });
    }else{
        setLogInError(true)
    }
    }
    return (
        <div id="LogInContainer">
            <SignInCard setError={setSignUpError}
                        error={signUpError}
                        username={suUsername}
                        password={suPassword}
                        email={suEmail}
                        setUsername={setSuUsername}
                        setEmail={setSuEmail} 
                        setPassword={setSuPassword}
                        setSelfStatement={setSelfStatement}
                        profilePicture={profilePicture}
                        setProfilePicture={handleProfilePicture}
                        setPrivacy={setPrivacy}
                        handleSubmit={handleNewUser}/>
            <LogInCard  setError={setLogInError}
                        error={logInError}
                        password={liPassword} 
                        email={liEmail}
                        handleSubmit={handleLogIn}
                        setEmail={setLiEmail}
                        setPassword={(str)=>setLiPassword(str)}/>
        </div>
    )
}

const inputStyle = {
    width: '20em'
}
function SignInCard(props) {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    let img = (<div></div>)
    if(props.profilePicture){
        img = (<img src={props.profilePicture} alt=""/>)
    }
    return (<div className='sign-card'>
        <div id="sign-in">
        <h1> Sign Up</h1>
                <FormGroup 
                
                     >
                     <div > 
                    <div className="username">
                    <TextField
                            error={props.error}
                            label='Username'
                            value={props.username}
                            onChange={(e) =>
                            {   props.setError(false)
                                props.setUsername(e.target.value.trim())
                            }}
                            
                            InputProps={{
                                style: {
                                    width: inputStyle.width,
                                    backgroundColor: theme.palette.primary.contrastText
                                }
                            }}
                            />
                    </div>
                    <div className="email">
                    <TextField 
                        error={props.error}
                        label="E-mail" 
                        value={props.email} 
                        onChange={(e) =>{
                            props.setError(false)
                           props.setEmail(e.target.value.trim())
                        }}
                        InputProps={{
                            style: {
                                width: inputStyle.width,
                                backgroundColor: theme.palette.primary.contrastText
                            }
                            }
                        }
                    />
                    </div>
                    </div>
                    <div className='privacy'>
                    <FormControlLabel
                        label="Private"
                        control={
                            <Checkbox 
                                onChange={
                                    (e)=>{
                                        props.setError(false)
                                       props.setPrivacy(e.target.value)
                                    }
                                   }
                                    />}
                    />
                    </div>
                    <div id="self-statement"> 
                        <h6>Self Statement</h6>
                        <TextareaAutosize 
                        name="selfStatement" onChange={(e)=>{
                            props.setError(false)
                            props.setSelfStatement(e.target.value)}}minRows={3}
                        style={
                            {
                                        width: inputStyle.width,
                                        backgroundColor:theme.palette.primary.contrastText
                                }
                        }
                      
                        />
                    </div>
                    <TextField 
                                error={props.error}
                                value={props.password}
                                label="Password"
                                onChange={(e) => {
                                props.setError(false)
                                props.setPassword(e.target.value.trim())}}
                          
                            type={showPassword ? "text" : "password"} 
                            InputProps={{
                                style: {
                                   
                                    width: inputStyle.width,
                                    backgroundColor:theme.palette.primary.contrastText
                                },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        ),
                      }}
                      style={{ margin: "auto",}}/>
                    <div className='file'>
                                <Button 
                                style={{
                                backgroundColor:theme.palette.secondary.main}}
                                
                                component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                   
                    Upload Picture
                    <VisuallyHiddenInput type="file"  name ='profile_picture'
                        onInput={(e)=>
                        props.setProfilePicture(e)}/>

                    </Button>
                    {img}
                    </div>
            <div className='button'>

         
            <Button 
                    onClick={
                        props.handleSubmit
                       }
                    variant="contained" 
                    style={{width:"20em",
                            backgroundColor:theme.palette.secondary.main
        }}type="submit">Sign Up</Button>
            </div>
        </FormGroup>
        </div>
    </div>)
}

function LogInCard(props){
    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("")
    const [open,setOpen] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

    return(<div className='sign-card'>
        <h1> Log In</h1>
        <FormGroup  id="login"
        
            >
                <div className="email">
            <TextField
                error={props.error}
                label="E-mail"
                value={props.email} 
                name='E-mail'placeholder='E-mail' 
                onChange={(e) => props.setEmail(e.target.value)}
                InputProps={{
                    style: {
                        width: inputStyle.width,
                }}}
                
                />
                </div>
                <div className="password-div">
            <TextField label="Password"
            error={props.error}
            value={props.password} 
            name='password'placeholder='Password'
            onChange={(e) => props.setPassword(e.target.value.trim())}
            type={showPassword ? "text" : "password"} 
            InputProps={{
                style: {
                    width: inputStyle.width,
                },
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
        ),
      }}
            
            />
            <div onClick={()=>{
                setOpen(true)
            }}className='forgot'>
               <a>Forgot Passowrd?</a>
            </div>
            </div>
         
            <Button 
               onClick={props.handleSubmit}
                style={{width:"20em",
                backgroundColor:theme.palette.secondary.main}}
                variant="contained" type="submit">Log In</Button>
        </FormGroup>
        <Modal
       
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
                >
                   

                    <FormGroup id="modal-modal-description" 
                     style={{width: "40em",
                            margin:"auto",
                            marginTop:"4em",
                            borderRadius:"25px",
                            padding:"6em",
                            backgroundColor:theme.palette.secondary.light}}  
                     //</Modal>sx={{ mt: 2 }}
                     >
                         <Typography 
                    id="modal-modal-title" variant="h6" component="h2"
                    >
      Forgot Passowrd
    </Typography>

                        <TextField 
                            label="E-mail" 
                            value={forgotEmail} 
                            style={{marginTop:"4em",
                                    marginBottom:"3em",
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
                                  // ..
                                });}else{
                                    window.alert("Please write an email")
                                }
                            }}>
                            Send
                        </Button>
                    </FormGroup>
                </Modal>
    </div>)
}


  export default LogInContainer