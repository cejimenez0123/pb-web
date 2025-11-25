
import { IonImg, IonText } from '@ionic/react';
import applelogo from "../../images/logo/Applelogo.png"
import { SocialLogin } from '@capgo/capacitor-social-login';
function AppleSignInButton({onUserSignIn}) {
const CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID
const REDIRECT_URI=import.meta.env.VITE_REDIRECT_URI

  const handleAppleSignIn = async () => {
  await SocialLogin.initialize({
      apple:{
        clientId:CLIENT_ID
      }
    })
    const {result }= await SocialLogin.login({
  provider: 'apple',
  options: {
    scopes: ['email', 'name'],
  },
});
console.log(result)
onUserSignIn({idToken:result.idToken,email:result.profile.email})
    
  };


   return <div onClick={handleAppleSignIn}  color="dark" 
className='bg-black btn flex flex-row rounded-full flex mx-auto h-[4rem] text-white w-[10rem] mt-8'>
     <IonImg src={applelogo} className='max-h-5 max-w-5'/> <IonText class='text-small'>Sign in</IonText>
    </div>

}

export default AppleSignInButton;
