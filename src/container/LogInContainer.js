import React ,{useState,useEffect,useLayoutEffect} from 'react'
import "../App.css"
import { logIn,signUp} from '../actions/UserActions';
import { connect,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { TextField ,Checkbox, FormControlLabel,Button, FormGroup, Typography} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles';
import { TextareaAutosize } from '@mui/base/TextareaAutosize'
import { uploadProfilePicture } from '../actions/UserActions';
import {InputAdornment,IconButton} from "@mui/material"
import { VisibilityOff,Visibility } from '@mui/icons-material';
import {sendPasswordResetEmail } from "firebase/auth";
import theme from '../theme';
// import Modal from '../components/Modal';
import { Modal } from '@mui/joy';
import { auth } from '../core/di';
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
const style = theme =>({
    textField: {
        width:"100%"}
})
function LogInContainer(props) {
    const dispatch = useDispatch()
    const [suUsername, setSuUsername] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPassword, setSuPassword] = useState('');
    const [selfStatement,setSelfStatement] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [privacy, setPrivacy] = useState(false)
    const [liEmail, setLiEmail] = useState('');
    const [liPassword, setLiPassword] = useState('');
    const navigate = useNavigate()
    const handleNewUser = (event) => {
        event.preventDefault();
       
        const params ={email:suEmail,
                        password:suPassword,
                        username:suUsername,
                        profilePicture:profilePicture,
                        selfStatement:selfStatement,
                        privacy:privacy}
                      
        dispatch(signUp(params)).then((result) => {
         
            if (result.payload.profile!=null){
                navigate("/profile/home")
             }
        }).catch((err) => {
            
        });;
 
    };
    const handleProfilePicture =(e)=>{
        const files = Array.from(e.target.files)
        const params = { file: files[0]
        }
        dispatch(uploadProfilePicture(params)).then((result) => {
            const { payload } = result
            if(payload!=null){
            const {url}= payload
            
            setProfilePicture(url)
            }
        })
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
        const params ={email:liEmail,password:liPassword}
        dispatch(logIn(params)).then((result) => {
        if(result.error==null){
           navigate("/profile/home")
           }
        }).catch((err) => {
            
        });
    }
    return (
        <div id="LogInContainer">
            <SignInCard username={suUsername}
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
            <LogInCard  password={liPassword} 
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
                            label='Username'
                            value={props.username}
                            onChange={(e) =>
                            { 
                                props.setUsername(e.target.value)
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
                        label="E-mail" 
                        value={props.email} 
                        onChange={(e) =>{
                           props.setEmail(e.target.value)
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
                                       props.setPrivacy(e.target.value)
                                    }
                                   }
                                    />}
                    />
                    </div>
                    <div id="self-statement"> 
                        <h6>Self Statement</h6>
                        <TextareaAutosize 
                        name="selfStatement" onChange={(e)=>props.setSelfStatement(e.target.value)}minRows={3}
                        style={
                            {
                                        width: inputStyle.width,
                                        backgroundColor:theme.palette.primary.contrastText
                                }
                        }
                      
                        />
                    </div>
                    <TextField value={props.password}
                 
                                label="Password"
                                onChange={(e) => 
                                props.setPassword(e.target.value)}
                          
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
            value={props.password} 
            name='password'placeholder='Password'
            onChange={(e) => props.setPassword(e.target.value)}
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
        // aria-describedby="modal-modal-description"
                // isOpen={open}
                // onClose={()=>setOpen(false)}
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