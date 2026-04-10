import {useContext,useEffect,useState} from 'react'
import "../../App.css"
import { logIn, } from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import loadingGif from "../../images/loading.gif"
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent,  IonInput, IonText, useIonRouter } from '@ionic/react';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import GoogleLogin from '../../components/GoogleLogin';
import { Capacitor } from '@capacitor/core';
import { useDialog } from '../../domain/usecases/useDialog.jsx';
// ── Layout System ─────────────────────────────
const WRAP = "max-w-2xl mx-auto px-4";
const CARD = "max-w-lg mx-auto px-4 py-6 rounded-lg text-emerald-800";
const FORM = "space-y-6";
const FIELD = "space-y-2";
const ACTIONS = "space-y-4 pt-4";
const CENTER = "flex flex-col items-center justify-center";

// ── Inputs / Buttons ─────────────────────────
const INPUT =
  "w-[100%] rounded-full px-4 py-2 text-emerald-800 bg-base-bg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300";

const BUTTON_PRIMARY =
  "bg-soft rounded-full w-[90%] mx-auto py-3 mt-2 text-white text-lg";

const LINK =
  "text-emerald-800 hover:text-green-400 cursor-pointer";

// ── Width Consistency ────────────────────────
const INPUT_WRAP = "max-w-md mx-auto";
export default function LogInContainer({currentProfile}) {
    const {setError,seo,setSeo}=useContext(Context)

    useEffect(()=>{
        let soo = seo
        soo.title = "Plumbum (Log In) - Share Your Weirdness"
        setSeo(soo)
       
   },[])


    return (
        <IonContent fullscreen={true}>
            <div className='py-10'>
     
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
    const router = useIonRouter()
    const {setError}=useContext(Context)
    const [email, setEmail] = useState('');
    const isNative = DeviceCheck()
    const [password, setPassword] = useState('');
    const [pending,setPending]=useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const {openDialog,closeDialog,dialog}=useDialog()

     
    
       
    const handleFirstTimeClick=()=>{
  
 router.push(Paths.onboard)
    
    }

    const handleLogIn = (event)=>{
        event.preventDefault()
   console.log(email,password)
        if(email.length>3 && password.length){
            setPending(true)
            const params ={email:email.toLowerCase(),password:password,isNative:Capacitor.isNativePlatform()}
            dispatch(logIn(params)).then(res=>{
                checkResult(res,payload=>{
                    setPending(false)
                  
                    if(payload && payload.profile && payload.profile.id){

                   
                    router.push(Paths.home,"root","replace")
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
                router.push(Paths.home,"root","replace")
           

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
           router.push(Paths.home,"root","replace")
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
        
    
    dia.onClose=()=>{
       closeDialog()
    }
    dia.isOpen = true
dia.title=null
dia.agree=null
dia.agreeText=null
dia.disagreeText=("Close")
dia.breakpoint=1
dia.text=(<ForgotPasswordForm/>)
openDialog(dia)
    }
    return(
    //    
<div className={WRAP}>
  <div className={CARD}>
        
        <div  className='mx-auto'>
           <form className={FORM}>
        <h1 className='text-emerald-800 mont-medium mx-auto text-center pb-4'> Log In</h1>
 
    <div className={FIELD}>
  <label>Email</label>
  <div className={INPUT_WRAP}>
    <input
      type="text"
      value={email}
      onInput={(e) => setEmail(e.target.value)}
      placeholder="example@email.com"
      className={INPUT}
    />
  </div>
</div>
    {/* <label>Email</label>
  <input type="text" 
    value={email} 
         className='  w-[100%] rounded-full  px-2 py-2 text-emerald-800 bg-base-bg text-[1rem]'
         labelPlacement='stacked'
         label='Email'
        //  style={{"--ion-max-width":"50em"}}
        onInput={(e) => setEmail(e.target.value)}
        placeholder='example@email.com' />
    </div> */}
{/* </div>    */}
<div className={FIELD}>
  <label>Password</label>
  <div className={INPUT_WRAP}>
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onInput={(e) => setPassword(e.target.value)}
      placeholder="*****"
      className={INPUT}
    />
  </div>

  <div className="text-right text-xs pr-2">
    <span onClick={() => setShowPassword(!showPassword)} className={LINK}>
      {showPassword ? "Hide" : "Show"}
    </span>
  </div>
</div>



         
            {/* <div className={INPUT_WRAP}> */}
  <button type="button" onClick={handleLogIn} className={BUTTON_PRIMARY}>
    Log In
  </button>
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
     
     onUserSignIn={({
        email,
        name,
        googleId,
       
        idToken,
     })=>{
        
        dispatchLogin({email,googleId,isNative})
        }}
            

    
     />
     </span>
     <div className={ACTIONS}>
  <div className={CENTER}>
    <AppleSignInButton
      onUserSignIn={({ idToken, email }) => {
        dispatchLogin({ email, idToken, isNative });
      }}
    />
  </div>

  <GoogleLogin
    onUserSignIn={({ email, googleId }) => {
      dispatchLogin({ email, googleId, isNative });
    }}
  />

  <div className="text-center space-y-3">
    <p onClick={handleFirstTimeClick} className={LINK}>
      First time here?
    </p>

    {pending && (
      <img
        className="mx-auto w-16 h-16"
        src={loadingGif}
      />
    )}

    <p
      onClick={handleForgotPasswordDialog}
      className={`${LINK} text-sm`}
    >
      Forgot Password?
    </p>
  </div>
</div>
        {/* <div className='mt-4 text-center p-4'>
        <a  onClick={handleFirstTimeClick}
        className='text-emerald-800 text-xl hover:text-green-400  '>Click here if this your first time?</a>
      
        {pending? <div className='flex'>
       <img  
        className="max-w-24 mx-auto max-w-24 min-w-20 min-h-20"src={loadingGif}/>
        </div>:null}
                
                <h5 onClick={()=>{
                    handleForgotPasswordDialog()
                 }} className='text-[1rem] pt-8 w-fit hover:text-green-400 mx-auto text-emerald-800'>Forgot Password?</h5>
              </div> */}
        </form>

                </div></div>
                
    </div>
    )

}