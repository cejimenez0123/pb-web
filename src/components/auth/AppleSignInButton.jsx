
import { IonImg, IonText } from '@ionic/react';
import applelogo from "../../images/logo/Applelogo.png";
import { SocialLogin } from '@capgo/capacitor-social-login';

function AppleSignInButton({ onUserSignIn }) {

  const handleAppleSignIn = async () => {
    try {
      const { result } = await SocialLogin.login({
        provider: 'apple',
        options: { scopes: ['email', 'name'] },
      });

      const idToken = result?.idToken
        ?? result?.identityToken
        ?? result?.accessToken;

      if (!idToken) return;

      onUserSignIn({ idToken, email: result?.profile?.email ?? null });
    } catch (err) {
      console.error('Apple Sign In error:', err);
    }
  };

  return (
    <div
      onClick={handleAppleSignIn}
      className='bg-black btn flex flex-row rounded-full flex mx-auto h-[3rem] text-white  mt-8'
    >
      <img src={applelogo} className='max-h-5 my-auto max-w-5' />
      <h6 class='text-[.85rem] my-auto '>Sign in with Apple</h6>
    </div>
  );
}

export default AppleSignInButton;