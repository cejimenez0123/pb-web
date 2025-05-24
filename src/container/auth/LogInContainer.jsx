import React ,{useContext, useLayoutEffect,useEffect, useState} from 'react'
import "../../App.css"
import { logIn} from '../../actions/UserActions';

import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {
        
        Dialog,
        } from "@mui/material"
import loadingGif from "../../images/loading.gif"
import theme from '../../theme';
import { Clear } from '@mui/icons-material';
import Paths from '../../core/paths';
import { useLocation } from 'react-router-dom';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import { initGA,sendGAEvent } from '../../core/ga4';
function LogInContainer(props) {
    const location = useLocation()
    const {setError,seo,setSeo}=useContext(Context)
    useLayoutEffect(()=>{
        initGA()
    },[])
    useLayoutEffect(()=>{
        let soo = seo
        soo.title = "Plumbum (LogIn) - Share Your Weirdness"
        setSeo(soo)
   },[])
    return (
        <div id="" className='sm:mx-2 py-16'>
            <LogInCard  
                       
            setLogInError={setError}
            handleSubmit={(e)=>handleLogIn(e)}
            setPassword={(str)=>setLiPassword(str)}/>
        </div>
    )
}

function LogInCard({setLogInError}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pending,setPending]=useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("")
    const [open,setOpen] = useState(false);

    const handleFirstTimeClick=()=>{
        navigate("/onboarding")
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
        setPending(true)
        if(email.length>3 && password.length){
            const params ={email:email.toLowerCase(),password:password}
            dispatch(logIn(params)).then(res=>{
                checkResult(res,payload=>{
                    setPending(false)
                        console.log("STORX",payload)
                    if(payload.error){
                        setLogInError("Error with Username or Password")
                    }else{
                        navigate(Paths.myProfile())
                    }
                },err=>{
                    if(err.message=="Request failed with status code 401"){
setLogInError("User Not Found. Apply Below")
                    }else{
                        setLogInError(err.message)
                    }
             
                    
                    setPending(false)
                })
            })       
        }else{
            setPending(false)
            setLogInError("Values can't be empty")
        }
    }
    useEffect(()=>{
        if(currentProfile){
            navigate(-1)
        }
    },[location,currentProfile])
    
    return(
    <div className='sm:border-4  mt-16 md:max-w-[42rem]  border-emerald-600 lg:mt-36 mb-16 rounded-lg  sm:mt-12  mx-auto text-emerald-800 p-4 '><div className='   flex items-center gap-2'>
        
        <div  className='mx-auto'>
            <form className='max-w-[100vw] sm:max-w-82 text-center pt-4'>
        <h1 className='text-emerald-800 lora-medium pb-4'> Log In</h1>
        <div >
         <div className='max-w-[91vw]'>
        <label className="input  open-sans-medium text-emerald-800 pl-6 w-52 overflow-hidden pl-2  rounded-full border-emerald-600 bg-transparent mt-4 flex items-center gap-2">
  Email
  <input type="text" className="shrink overflow-hidden  text-[1rem] w-[100%] sm:max-w-[100%]  open-sans-medium py-2 bg-transparent text-emerald-800" 
         value={email} 
         onChange={(e) => setEmail(e.target.value.trim())}
        placeholder='example@email.com' />
</label>
</div>   
<div className='mb-8 max-w-[91vw] '>
    <label className="input open-sans-medium pl-6 inline-block flex rounded-full flex-row text-emerald-800 w-72 overflow-hidden border-emerald-600 bg-transparent mt-4 items-center gap-2">
  Password
  <input type={showPassword?"text":`password`} className="shrink max-w-36 open-sans-medium sm:max-w-52  shrink text-emerald-800 " 
         value={password}
         
         onChange={(e) => setPassword(e.target.value.trim())}
        placeholder='*****' />
         
         <label onClick={()=>setShowPassword(!showPassword)}
                className={`text-[0.7rem] min-w-[5em] w-64 open-sans-medium p-2 ${showPassword?"":"" }ml-1 my-auto`}>
                    {showPassword?"Hide":"Show"}</label>
</label> 
    
    </div>
            <div 
                className='  '
                onClick={()=>{
                    setOpen(true)
                }}>
                <a className='text-[1rem] mont-medium hover:text-green-400 text-emerald-800'>Forgot Password?</a>
            </div>
            <button
            className='bg-green-600   text-white rounded-full hover:bg-green-400  font-bold py-3 px-12 mt-4 '
               onClick={handleLogIn}
                
                variant="contained" ><h6 className='mont-medium text-xl tracking-wide'>Log In</h6></button>
                
        </div>
        <div className='mt-4 p-4'>
        <a  onClick={handleFirstTimeClick}className='text-emerald-800 text-xl mont-medium hover:text-green-400  '>Click here if this your first time?</a>
        </div>
        {pending? <div className='flex'>
       <img  
        className="max-w-24 mx-auto max-w-24 min-w-20 min-h-20"src={loadingGif}/>
        </div>:null}
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

            
                </Dialog>
                </div></div>
    </div>)
}


export default LogInContainer