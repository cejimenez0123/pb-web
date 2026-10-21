import { SocialLogin } from "@capgo/capacitor-social-login";
import { useIonRouter } from "@ionic/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Paths from "../../core/paths";
import styles from "../../styles/style";

export default function SignOutButton({ mobile = false }) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const handleSignOut = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await SocialLogin.logout({
          provider: 'google',
        });
      }
    } catch (error) {
      console.error(
        'Social login logout failed:',
        error
      );
    }

    dispatch(
      signOutAction({
        profile: currentProfile,
      })
    ).then(() => {
      router.push(Paths.login, 'root');
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
          className={styles.navbar.mobileItem}

    >
      Sign out
    </button>
  );
}