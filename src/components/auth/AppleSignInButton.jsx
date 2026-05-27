
import { IonImg, IonText } from '@ionic/react';
import applelogo from "../../images/logo/Applelogo.png"
import { SocialLogin } from '@capgo/capacitor-social-login';
import { useEffect } from 'react';
const CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID

function AppleSignInButton({onUserSignIn}) {

useEffect(() => {
  SocialLogin.initialize({
    apple: {
      clientId: CLIENT_ID,
    },
  }).then(() => {
    console.log('SocialLogin initialized successfully');
  }).catch((err) => {
    console.error('Error initializing SocialLogin:', err);
  });
}, [])
const handleAppleSignIn = async () => {
  try {
    const { result } = await SocialLogin.login({
      provider: 'apple',
      options: { scopes: ['email', 'name'] },
    });
 
    const idToken = result?.idToken 
      ?? result?.identityToken 
      ?? result?.accessToken
    


    if (!idToken) {
     
      return;
    }

    onUserSignIn({ idToken, email: result?.profile?.email ?? null });
  } catch (err) {
   
  }
};


   return <div onClick={handleAppleSignIn}  color="dark" 
className='bg-black btn flex flex-row rounded-full flex mx-auto h-[4rem] text-white w-[10rem] mt-8'>
     <IonImg src={applelogo} className='max-h-5  mb-2 max-w-5'/> <IonText class='text-small'>Sign in</IonText>
    </div>

}

export default AppleSignInButton;
