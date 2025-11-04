import {useContext,useEffect,useState} from 'react'
import "../../App.css"
import { logIn, setDialog} from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom'
import loadingGif from "../../images/loading.gif"
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent,  IonInput, IonText } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import { useSelector } from 'react-redux';
import GoogleLogin from '../../components/GoogleLogin';
import ErrorBoundary from "../../ErrorBoundary.jsx"
import { Capacitor } from '@capacitor/core';
export default function LogInContainer() {
    const {setError,seo,setSeo}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
  
 const navigate = useNavigate()
    useEffect(()=>{
        let soo = seo
        soo.title = "Plumbum (Log In) - Share Your Weirdness"
        setSeo(soo)
       
   },[])
   useEffect(()=>{
    //.then(res=>{
        // if(res && res.value && res.value.length>10 && currentProfile){
    const checkAuth= async()=>{
       const token = (await Preferences.get({key:"token"})).value
       token&& currentProfile &&currentProfile.id&& navigate(Paths.myProfile())

    }
    checkAuth()
        // }
    // })
   },[currentProfile])

    return (
        <IonContent fullscreen={true}>
            <div className='py-10'>
     
            <LogInCard  
                       
            setLogInError={setError}
            handleSubmit={(e)=>handleLogIn(e)}
            setPassword={(str)=>setLiPassword(str)}/>
            </div>
        {/* </div> */}
        </IonContent>
    )
}

function LogInCard({setLogInError}){
    const {isPhone}=useContext(Context)
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
    
  
    const dialog = useSelector(state=>state.users.dialog)
     
    
       
    const handleFirstTimeClick=()=>{
  
       isPhone?navigate("/onboard"):navigate("/apply")
    
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
   
        if(email.length>3 && password.length){
            setPending(true)
            const params ={email:email.toLowerCase(),password:password,isNative:Capacitor.isNativePlatform()}
            dispatch(logIn(params)).then(res=>{
                checkResult(res,payload=>{
                    setPending(false)
                  console.log(payload)
                    if(payload && payload.profile && payload.profile.id){

                   
                    navigate(Paths.myProfile())
                     }else{
                        setError("Error with Profile")
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
               
                 
                //    await Preferences.set({key:"cachedMyProfile",value:JSON.stringify(payload.profile)})
                   
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
              
                // Preferences.set({key:"cachedMyProfile",value:payload.profile}).then(()=>{})
            
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
    const handleForgotPasswordDialog=()=>{
        let dia = {...dialog}
        
    dia.
    dia.onClose=()=>{
        dispatch(setDialog({isOpen:false}))
    }
dia.title=("Forgot Password")
dia.disagreeText=("Close")
dia.text=(<ForgotPasswordForm/>)
dispatch(setDialog(dia))
    }
    return(
        <ErrorBoundary>
    <div  className=' py-0 scroll-auto flex md:mt-8  mx-auto sm:max-w-[50em]  lg:mt-36 mb-16 rounded-lg   text-emerald-800 p-4 '><div className='   flex items-center gap-2'>
        
        <div  className='mx-auto'>
            <form className=' sm:max-w-[40em] overflow-auto pt-4'>
        <h1 className='text-emerald-800 mont-medium mx-auto text-center pb-4'> Log In</h1>
        <div className='w-[90vw] text-center sm:w-[40em] '>
  <div className='text-left'>
  <IonInput type="text" 
//   className="grow overflow-hidden w-full my-auto text-[1rem] sm:max-w-72   open-sans-medium  bg-transparent text-emerald-800" 
         value={email} 
         className=' bg-transparent text-emerald-800 mx-auto'
         labelPlacement='stacked'
         label='Email'
         style={{"--ion-max-width":"50em"}}
         onIonInput={(e) => setEmail(e.target.value)}
        placeholder='example@email.com' />
    </div>
{/* </label> */}
</div>   


  <IonInput type={showPassword?"text":`password`}
//    className="grow my-auto max-w-46 open-sans-medium sm:max-w-96  text-emerald-800 " 
         value={password}
         label='Password'
         labelPlacement='stacked'
         onIonInput={(e) => setPassword(e.target.value)}
        placeholder='*****' 
        >
            {/* <IonIcon slot='end'> */}
         <h5 slot='end' onClick={()=>setShowPassword(!showPassword)}
                className={`text-[0.7rem] open-sans-medium ${showPassword?"":"" } my-auto`}>
                    {showPassword?"Hide":"Show"}</h5>
                    {/* </IonIcon> */}
        </IonInput>
         


         
            
            <div
            // style={{margin:"0 auto",width:"fit-content"}}
            className='bg-green-600  rounded-full btn w-[100%] mx-4 mx-auto sm:w-[40em] mx-auto hover:bg-green-400  font-bold py-3 px-12 mt-4 '
               onClick={handleLogIn}
                
                variant="contained" ><IonText className='  text-white text-xl text-center '>Log In</IonText></div>
                
        {/* </div> */}
        <span className='flex flex-col mt-4 justify-center '> 
        <div className='w-fit mx-auto'>
        <AppleSignInButton
        onUserSignIn={({idToken,email})=>{
            dispatchLogin({email,idToken,isNative})
        }}
        />
        </div>
         <GoogleLogin
         onUserSignIn={({email, idToken, googleId, driveAccessToken})=>{

         }}
     
            

    
     />
     </span>
        <div className='mt-4 text-center p-4'>
        <a  onClick={handleFirstTimeClick}
        className='text-emerald-800 text-xl hover:text-green-400  '>Click here if this your first time?</a>
      
        {pending? <div className='flex'>
       <img  
        className="max-w-24 mx-auto max-w-24 min-w-20 min-h-20"src={loadingGif}/>
        </div>:null}
        {/* <div  */}
              {/* > */}
                
                <h5 onClick={()=>{
                    handleForgotPasswordDialog()
                 }} className='text-[1rem] pt-8 w-fit hover:text-green-400 mx-auto text-emerald-800'>Forgot Password?</h5>
            {/* </div> */}
              </div>
        </form>

                </div></div>
    </div></ErrorBoundary>)
}