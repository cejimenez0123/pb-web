import React ,{useEffect, useState} from 'react'
import "../../App.css"
import { logIn} from '../../actions/UserActions';

import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {
        TextField ,
 
        Button, 
        FormGroup, 
        Dialog,
        Typography} from "@mui/material"

import theme from '../../theme';
import { Clear } from '@mui/icons-material';
import { auth } from '../../core/di';
import ReactGA from "react-ga4"
import Paths from '../../core/paths';
import { useLocation } from 'react-router-dom';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';

function LogInContainer(props) {
    const location = useLocation()

  
  
    const [logInError,setLogInError] = useState(null)

    ReactGA.send({ hitType: "pageview", page: window.location.pathname+window.location.search, title: "About Page" })



  
    return (
        <div id="" className='sm:mx-2'>
             <div className='fixed top-4 left-0 right-0 md:left-[20%] w-[96vw] mx-4 md:w-[60%]  z-50 mx-auto'>
   {logInError?
  <div role="alert" className={`alert    
  ${"alert-warning"} animate-fade-out`}>
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
  <span>{logInError}</span>
</div>:null}</div>
            <LogInCard  setError={setLogInError}
                        error={logInError}
            setLogInError={setLogInError}
                        handleSubmit={(e)=>handleLogIn(e)}
            
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



function LogInCard({setLogInError}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("")
    const [open,setOpen] = useState(false);
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    const handleFirstTimeClick=()=>{
        navigate("/apply")
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
        if(email.length>3 && password.length){
            const params ={email:email.toLowerCase(),password:password}
            dispatch(logIn(params)).then(res=>{
                checkResult(res,payload=>{
                    if(payload.error){
                        setLogInError("Error with Username or Password")
                    }else{
                        navigate(Paths.myProfile())
                    }
                },err=>{
                    setLogInError(err.message)
                })
            })       
        }else{
            setLogInError("Error")
        }
    }
    useEffect(()=>{
        if(currentProfile){
            navigate(-1)
        }
    },[location,currentProfile])
    
    return(
    <div className='sm:border-4  md:max-w-[42rem]  border-emerald-600 lg:mt-36 mb-16 rounded-lg  sm:mt-12  mx-auto text-emerald-800 p-4 '><div className='   flex items-center gap-2'>
        
        <div  className='mx-auto'>
            <form className='max-w-[100vw] sm:max-w-82 text-center pt-4'>
        <h1 className='text-emerald-800 lora-medium pb-4'> Log In</h1>
        <div >
         <div className='max-w-[91vw]'>
        <label className="input  open-sans-medium text-emerald-800 w-52 overflow-hidden pl-2  border-emerald-600 bg-transparent mt-4 flex items-center gap-2">
  Email
  <input type="text" className="shrink overflow-hidden text-[1rem] w-[100%] sm:max-w-[100%]  py-2 bg-transparent text-emerald-800" 
         value={email} 
         onChange={(e) => setEmail(e.target.value.trim())}
        placeholder='example@email.com' />
</label>
</div>   
<div className='mb-8 max-w-[91vw] '>
    <label className="input open-sans-medium inline-block flex flex-row text-emerald-800 w-72 overflow-hidden border-emerald-600 bg-transparent mt-4 items-center gap-2">
  Password
  <input type={showPassword?"text":`password`} className="shrink max-w-36 sm:max-w-52  shrink text-emerald-800 " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
         
         <label onClick={()=>setShowPassword(!showPassword)}
                className={`text-[0.7rem] min-w-[5em] w-64 open-sans-medium p-2 ${showPassword?"":"" }ml-1 my-auto`}>
                    {showPassword?"Hide":"Show"}</label>
</label> 
    
    </div>
            <div 
                className='text-emerald-800 open-sans-medium hover:text-green-400'
                onClick={()=>{
                    setOpen(true)
                }}>
                <a>Forgot Password?</a>
            </div>
            <button
            className='bg-green-600 mont-medium  text-white rounded-full hover:bg-green-400  font-bold py-3 px-12 mt-4 '
               onClick={handleLogIn}
                
                variant="contained" >Submit</button>
                
        </div>
        <div className='mt-4 p-4'>
        <a  onClick={handleFirstTimeClick}className='text-emerald-800 open-sans-medium hover:text-green-400  '>Click here if this your first time?</a>
        </div>
        <div>
        
        </div>
        </form>
        <Dialog
       
        open={open}
        onClose={()=>{setOpen(false)}}
      
                >
                <div>
                    <Clear onClick={
                        ()=>setOpen(false)
                    }/>    
                </div>  
                <ForgotPasswordForm/>

                    {/* <FormGroup
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
                            
                                    marginBottom:"2em",
                                    backgroundColor:theme.palette.secondary.contrastText}}
                            onChange={(e)=>setForgotEmail(e.target.value)}
                        />
                        <Button 
                            style={{backgroundColor:theme.palette.secondary.main,
                                    color:theme.palette.secondary.contrastText}}
                            variant='outlined'
                            onClick={()=>{
                                {username,email}
                            
                                // if(forgotEmail.length > 0){
                                // sendPasswordResetEmail(auth, forgotEmail)
                                // .then(() => {
                                //   window.alert("Email Sent!")
                                // })
                                // .catch((error) => {
                                //   const errorCode = error.code;
                                //   const errorMessage = error.message;
                                //   if(error.message.includes("(auth/user-not-found)")){
                                //     window.alert("User not found")
                                //   }
                            
                                  // ..
                                // });}else{
                                //     window.alert("Please write an email")
                                // }
                            }}>
                            Send
                        </Button>
                    </FormGroup> */}
                </Dialog>
                </div></div>
    </div>)
}


export default LogInContainer