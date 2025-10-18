import React from 'react';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { IonImg, IonText } from '@ionic/react';
import Enviroment from '../../core/Enviroment';
import applelogo from "../../images/logo/Applelogo.png"
function AppleSignInButton({onUserSignIn}) {
console.log("APPLE SIGN IN BUTTON RENDERED",import.meta.env.VITE_REDIRECT_URI)
  const options = {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID, 
    redirectURI: import.meta.env.VITE_REDIRECT_URI, 
    scopes: 'email name',
    state: '12345',
    nonce: 'nonce',
  };

  const handleAppleSignIn = () => {
    SignInWithApple.authorize(options)
      .then(result => {
        onUserSignIn({idToken:result.response.identityToken,email:result.response.email})

      },err=>{
     
        console.error('Apple sign-in error1:', err);
      })
      .catch(error => {
   
        console.error('Apple sign-in error:', error);
        // TODO: Handle error (show message to user, etc.)
      });
  };


   return <div onClick={handleAppleSignIn}  color="dark" 
className='bg-black btn flex flex-row rounded-full flex h-[4rem] text-white w-[10rem] mt-8'>
     <IonImg src={applelogo} className='max-h-5 max-w-5'/> <IonText class='text-small'>Sign in</IonText>
    </div>

}

export default AppleSignInButton;
