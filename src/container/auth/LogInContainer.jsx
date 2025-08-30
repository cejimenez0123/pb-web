import React ,{useContext,useEffect,useLayoutEffect,useState} from 'react'
import "../../App.css"
import { logIn} from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import loadingGif from "../../images/loading.gif"
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import DeviceCheck from '../../components/DeviceCheck';
import GoogleLogin from '../../components/GoogleLogin';
import Dialog from '../../components/Dialog';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import { IonContent, IonInput } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';

export default function LogInContainer() {
    const {setError,seo,setSeo,currentProfile}=useContext(Context)
 const navigate = useNavigate()
    useLayoutEffect(()=>{
        let soo = seo
        soo.title = "Plumbum (Log In) - Share Your Weirdness"
        setSeo(soo)
       
   },[])
   useEffect(()=>{
    if(currentProfile){
        navigate(Paths.myProfile())
    }
   },[])

    return (
        <IonContent fullscreen={true}>
        <div  fullscreen={true} className='sm:mx-2 overflow-y-scroll py-10 md:py-4'>
            <LogInCard  
                       
            setLogInError={setError}
            handleSubmit={(e)=>handleLogIn(e)}
            setPassword={(str)=>setLiPassword(str)}/>
        </div>
        </IonContent>
    )
}

function LogInCard({setLogInError}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {setError}=useContext(Context)
    const [email, setEmail] = useState('');
    const isNative = DeviceCheck()
    const [password, setPassword] = useState('');
    const [pending,setPending]=useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("")
    const [open,setOpen] = useState(false);
    
  
   
     
    
       
    const handleFirstTimeClick=()=>{
  
        navigate("/apply")
    
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
   
        if(email.length>3 && password.length){
            setPending(true)
            const params ={email:email.toLowerCase(),password:password,isNative}
            dispatch(logIn(params)).then(res=>{
                checkResult(res,payload=>{
                    setPending(false)
                    if(payload && payload.error){
                        setError("Error with Username or Password")
                    }else{
                       Preferences.set({key:"cachedMyProfile",value:payload.profile})
                        navigate(Paths.myProfile())
                    }
                },err=>{
                    if(err.message=="Request failed with status code 401"){
setError("User Not Found. Apply Below")
                    }else{
                        setError(err.message)
                    }
             
                    
                    setPending(false)
                })
            })       
        }else{
            setPending(false)
            setError("Values can't be empty")
        }
    }
  
    const dispatchLogin=  ({email,googleId,idToken})=>{
        if(idToken){
            dispatch(logIn({email,idToken:idToken,isNative})).then(res=>{
                checkResult(res,async payload=>{
               
              
                   await Preferences.set({key:"cachedMyProfile",value:JSON.stringify(payload.profile)})
                   
                    setPending(false)
                },err=>{

                    if(err.message=="Request failed with status code 401"){
    setError("User Not Found. Apply Below")
                    }else{
                        setError(err.message)
                    }
             
                    
                    setPending(false)
                })
            })   
        }else if(googleId){

        
        dispatch(logIn({email,uId:googleId,isNative})).then(res=>{
            checkResult(res,payload=>{
              
                Preferences.set({key:"cachedMyProfile",value:payload.profile})
                navigate(Paths.myProfile())
                setPending(false)
            },err=>{
               
                if(err.message=="Request failed with status code 401"){
setError("User Not Found. Apply Below")
                }else{
                    setError(err.message)
                }
         
                
                setPending(false)
            })
        })   
    }
    }
    return(
    <div  className=' md:mt-8 md:max-w-[42rem]  lg:mt-36 mb-16 rounded-lg    mx-auto text-emerald-800 p-4 '><div className='   flex items-center gap-2'>
        
        <div  className='mx-auto'>
            <form className='max-w-[100vw] sm:max-w-82 text-center pt-4'>
        <h1 className='text-emerald-800 mont-medium pb-4'> Log In</h1>
        <div >
         <div className='max-w-[91vw]'>
        <label className="input  open-sans-medium text-emerald-800 pl-6 w-52 overflow-hidden pl-2  rounded-full border-emerald-600 bg-transparent mt-4 flex items-center gap-2">
  Email
  <IonInput type="text" className="shrink overflow-hidden  my-auto text-[1rem] w-[100%] sm:max-w-[100%]  open-sans-medium  bg-transparent text-emerald-800" 
         value={email} 
         onIonInput={(e) => setEmail(e.target.value)}
        placeholder='example@email.com' />
</label>
</div>   
<div className='mb-8 max-w-[91vw] '>
    <label className="input open-sans-medium pl-6 inline-block flex rounded-full flex-row text-emerald-800 w-72 overflow-hidden border-emerald-600 bg-transparent mt-4 items-center gap-2">
  Password
  <IonInput type={showPassword?"text":`password`} className="shrink my-auto max-w-36 open-sans-medium sm:max-w-52  shrink text-emerald-800 " 
         value={password}
         
         onIonInput={(e) => setPassword(e.target.value)}
        placeholder='*****' />
         
         <label onClick={()=>setShowPassword(!showPassword)}
                className={`text-[0.7rem] min-w-[5em] w-64 open-sans-medium p-2 ${showPassword?"":"" }ml-1 my-auto`}>
                    {showPassword?"Hide":"Show"}</label>
</label> 
    
    </div>
         
            
            <button
            className='bg-green-600   text-white rounded-full hover:bg-green-400  font-bold py-3 px-12 mt-4 '
               onClick={handleLogIn}
                
                variant="contained" ><h6 className='mont-medium text-xl tracking-wide'>Log In</h6></button>
                
        </div>
        <span className='flex flex-col mt-4 justify-center '> 
        <div className='w-fit mx-auto'>
        <AppleSignInButton
        onUserSignIn={({idToken,email})=>{
            dispatchLogin({email,idToken,isNative})
        }}
        />
        </div>
         <GoogleLogin 
     onUserSignIn={({email, name,googleId})=>{
dispatchLogin({email,googleId,isNative})
            
     }}/>
     </span>
        <div className='mt-4 p-4'>
        <a  onClick={handleFirstTimeClick}
        className='text-emerald-800 text-xl mont-medium hover:text-green-400  '>Click here if this your first time?</a>
        </div>
        {pending? <div className='flex'>
       <img  
        className="max-w-24 mx-auto max-w-24 min-w-20 min-h-20"src={loadingGif}/>
        </div>:null}
        <div 
                className='  '
                onClick={()=>{
                    setOpen(true)
                }}>
                <a className='text-[1rem] mont-medium hover:text-green-400 text-emerald-800'>Forgot Password?</a>
            </div>
        </form>
<Dialog isOpen={open} onClose={()=>setOpen(false)}
title={"Forgot Password"}
disagreeText={"Close"}
text={<ForgotPasswordForm/>}/>
                </div></div>
    </div>)
}

