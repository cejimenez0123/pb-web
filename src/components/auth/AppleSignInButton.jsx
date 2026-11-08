

import applelogo from "../../images/logo/Applelogo.png";
import { SocialLogin } from '@capgo/capacitor-social-login';

import styles from '../../styles/style';

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
      className={[styles.button.base.slice(1,styles.button.base.length),"bg-plumb-ink w-[180px]  py-2 rounded-full text-plumb-surface"].join(" ")}
      // className='bg-plumb-ink btn flex flex-row rounded-full flex mx-auto text-white  mt-8'
    >
      <div className="flex flex-row mx-aut my-auto">
      <img src={applelogo} className='max-h-5 my-auto mr-2 max-w-5' />
      <h6 className='text-sm my-auto '>Sign in with Apple</h6>
      </div>
    </div>
  );
}

export default AppleSignInButton;