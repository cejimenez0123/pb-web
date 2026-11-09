import { SocialLogin } from "@capgo/capacitor-social-login";
import { useIonRouter } from "@ionic/react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Paths from "../../core/paths";
import styles from "../../styles/style";
import { signOutAction } from "../../actions/UserActions";
import { Capacitor } from "@capacitor/core";

export default function SignOutButton({ mobile = false,onClick }) {
  const dispatch = useDispatch();
  const router = useIonRouter();

  const currentProfile = useSelector(
    (state) => state.users.currentProfile
  );

  const handleSignOut = async () => {
    try {
        onClick && onClick()
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
    className={styles.navbar.mobileNativeItem}   

    >
      <h6 className="text-[1rem]"> Sign out</h6>
    </button>
  );
}