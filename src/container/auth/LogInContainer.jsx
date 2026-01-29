import {useContext,useEffect,useState} from 'react'
import "../../App.css"
import { logIn, setDialog} from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import loadingGif from "../../images/loading.gif"
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import DeviceCheck from '../../components/DeviceCheck';
import { IonContent,  IonInput, IonText, useIonRouter } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import { useSelector } from 'react-redux';
import GoogleLogin from '../../components/GoogleLogin';
import ErrorBoundary from "../../ErrorBoundary.jsx"
import { Capacitor } from '@capacitor/core';
import { useDialog } from '../../domain/usecases/useDialog.jsx';
export default function LogInContainer() {
    const {setError,seo,setSeo}=useContext(Context)
    const currentProfile = useSelector(state=>state.users.currentProfile)
    const router = useIonRouter()

    useEffect(()=>{
        let soo = seo
        soo.title = "Plumbum (Log In) - Share Your Weirdness"
        setSeo(soo)
       
   },[])
   useEffect(()=>{
 
    const checkAuth= async()=>{
       const token = (await Preferences.get({key:"token"})).value
       token&& currentProfile &&currentProfile.id&&router.push(Paths.myProfile)

    }
    checkAuth()
 
   },[currentProfile])

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
    const {openDialog,closeDialog}=useDialog()
  
    const dialog = useSelector(state=>state.users.dialog)
     
    
       
    const handleFirstTimeClick=()=>{
  
 router.push(Paths.onboard)
    
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

                   
                    navigate(Paths.myProfile)
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
        
    //  dispatch(setDialog({isOpen:false}))
    dia.onClose=()=>{
        dispatch(setDialog({isOpen:false}))
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
    <div  className=' flex md:mt-8  mx-auto sm:max-w-[50em]  lg:mt-36 mb-16 rounded-lg   text-emerald-800 p-4 '><div className='   '>
        
        <div  className='mx-auto'>
            <form className=' sm:max-w-[40em] overflow-auto pt-4'>
        <h1 className='text-emerald-800 mont-medium mx-auto text-center pb-4'> Log In</h1>
        <div className='w-[90vw] text-center sm:w-[40em] '>
  <div className='text-left'>
  <IonInput type="text" 
    value={email} 
         className=' bg-transparent text-emerald-800 mx-auto'
         labelPlacement='stacked'
         label='Email'
         style={{"--ion-max-width":"50em"}}
         onIonInput={(e) => setEmail(e.target.value)}
        placeholder='example@email.com' />
    </div>
</div>   


  <IonInput type={showPassword?"text":`password`}
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
            className='bg-green-600  rounded-full btn w-[100%] mx-4 mx-auto sm:w-[40em] mx-auto hover:bg-green-400  font-bold py-3 px-12 mt-4 '
               onClick={handleLogIn}
                
                variant="contained" ><IonText className='  text-white text-xl text-center '>Log In</IonText></div>
                
        <span className='flex flex-col mt-4 justify-center '> 
        <div className='w-fit mx-auto'>
        <AppleSignInButton
        onUserSignIn={({idToken,email})=>{
            dispatchLogin({email,idToken,isNative})
        }}
        />
        </div>
         <GoogleLogin
     
     
            

    
     />
     </span>
        <div className='mt-4 text-center p-4'>
        <a  onClick={handleFirstTimeClick}
        className='text-emerald-800 text-xl hover:text-green-400  '>Click here if this your first time?</a>
      
        {pending? <div className='flex'>
       <img  
        className="max-w-24 mx-auto max-w-24 min-w-20 min-h-20"src={loadingGif}/>
        </div>:null}
                
                <h5 onClick={()=>{
                    handleForgotPasswordDialog()
                 }} className='text-[1rem] pt-8 w-fit hover:text-green-400 mx-auto text-emerald-800'>Forgot Password?</h5>
              </div>
        </form>

                </div></div>
                
    </div>
    )

}