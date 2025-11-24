import React, { useLayoutEffect } from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonImg, IonText } from '@ionic/react';
import Enviroment from '../../core/Enviroment';
import applelogo from "../../images/logo/Applelogo.png"
import { SocialLogin } from '@capgo/capacitor-social-login';
function AppleSignInButton({onUserSignIn}) {
const CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID
const REDIRECT_URI=import.meta.env.VITE_REDIRECT_URI
  // useLayoutEffect(() => {
  //   SocialLogin.initialize({
  //     apple:{
  //       clientId:CLIENT_ID
  //     }
  //   }).catch(err => console.error('SocialLogin init error:', err));
  // }, [CLIENT_ID,REDIRECT_URI]);

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
onUserSignIn({idToken:result.identityToken,email:result.profile.email})
    // SignInWithApple.authorize(options)
    //   .then(result => {
    //     )

    //   },err=>{
     
    //     console.error('Apple sign-in error1:', err);
    //   })
    //   .catch(error => {
   
    //     console.error('Apple sign-in error:', error);
    //     // TODO: Handle error (show message to user, etc.)
    //   });
  };


   return <div onClick={handleAppleSignIn}  color="dark" 
className='bg-black btn flex flex-row rounded-full flex mx-auto h-[4rem] text-white w-[10rem] mt-8'>
     <IonImg src={applelogo} className='max-h-5 max-w-5'/> <IonText class='text-small'>Sign in</IonText>
    </div>

}

export default AppleSignInButton;
