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
import { margin } from '@mui/system';
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
                navigate("/profile/home")
            },()=>{
                setSignUpError(true)
            })

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
            },(err)=>{
                window.alert(err.message)
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
    width: '95%',
    backgroundColor:theme.palette.primary.contrastText,
    marginTop:"1em",
    marginBottom:"1em",
    marginLeft:"1em"
}
const outerInputStyle={width:inputStyle.width,
    marginTop:inputStyle.marginTop,
    marginLeft:inputStyle.marginLeft}
const innerInputStyle={backgroundColor: inputStyle.backgroundColor}
const btnStyle ={
    width: '95%',
    padding: '1em',
    marginTop:"1em",
    marginBottom:"1em",
    marginLeft:"1em",
    backgroundColor:theme.palette.secondary.main
}
function SignInCard(props) {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    let img = (<div></div>)
    if(props.profilePicture){
        img = (<img style={{marginLeft:"1em",width:"50%"}}
                src={props.profilePicture} alt=""/>)
    }
    return (<div className='sign-card'>

        <div id="sign-in" >
        <h1 style={{marginLeft:"0.4em"}}> Sign Up</h1>
                <FormGroup >
                    <TextField
                        error={props.error}
                        label='Username'
                        value={props.username}
                        onChange={(e) =>{   
                            props.setError(false)
                            let value=e.target.value.trim()
                            if(value.length <=30){
                                props.setUsername(value)
                            }
                         
                        }}
                        style={outerInputStyle}
                    />
                    <TextField 
                        error={props.error}
                        label="E-mail" 
                        value={props.email} 
                        onChange={(e) =>{
                            props.setError(false)
                           props.setEmail(e.target.value.trim())
                        }}
                        style={outerInputStyle}
                        InputProps={{
                            style: innerInputStyle
                            }
                        }
                    />
                    <FormControlLabel
                        label="Private"
                        style={{marginLeft:inputStyle.marginLeft}}
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
                    
                    <div style={{marginLeft:inputStyle.marginLeft}}id="self-statement"> 
                        <h6>Self Statement</h6>
                        <TextareaAutosize 
                            name="selfStatement" 
                            onChange={(e)=>{
                            props.setError(false)
                            let value = e.target.value
                            if(value.length <= 240){
                            props.setSelfStatement(value)}}}
                            minRows={3}
                            style={
                            {   marginBottom:"2em",
                                width: "99%",
                                padding:"1em",
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
                            style={outerInputStyle} 
                            InputProps={{
                                style:innerInputStyle,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleTogglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                        ),
                      }}
                      />
                    <div className='file'>
                                <Button 
                                style={btnStyle}
                                
                                component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                   
                    Upload Picture
                    <VisuallyHiddenInput type="file"  name ='profile_picture'
                        onInput={(e)=>
                        props.setProfilePicture(e)}/>

                    </Button>
                    {img}
                    </div>
           
            <Button 
                    onClick={
                        props.handleSubmit
                       }
                    variant="contained" 
                    style={btnStyle}
                    type="submit">Sign Up</Button>
     
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
        <div  id="log-in">
        <h1 style={{marginLeft:"0.4em",marginTop:"1em",marginRight:"0.4em"}}> Log In</h1>
        <FormGroup >
        
            <TextField
                error={props.error}
                label="E-mail"
                value={props.email} 
                name='E-mail'
                placeholder='E-mail' 
                onChange={(e) => props.setEmail(e.target.value)}
                style={outerInputStyle}
            />
                
            <TextField label="Password"
            error={props.error}
            value={props.password} 
            name='password'placeholder='Password'
            onChange={(e) => props.setPassword(e.target.value.trim())}
            type={showPassword ? "text" : "password"} 
            style={outerInputStyle}
            InputProps={{
                style:innerInputStyle,
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
        ),
      }}
            
            />
            <div 
                style={{color:theme.palette.primary.dark,marginLeft:"1em"}}
                onClick={()=>{
                    setOpen(true)
                }}>
                <a>Forgot Password?</a>
            </div>
            <Button 
               onClick={props.handleSubmit}
                style={btnStyle}
                variant="contained" type="submit">Log In</Button>
        </FormGroup>
        <Modal
       
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
                >
                   

                    <FormGroup id="modal-modal-description" 
                     style={{width: "40em",
                            marginLeft: inputStyle.marginLeft,
                            marginTop:"4em",
                            borderRadius:"25px",
                            padding:"6em",
                            backgroundColor:theme.palette.secondary.light,
                            }}  
                    
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
                </div>
    </div>)
}


  export default LogInContainer