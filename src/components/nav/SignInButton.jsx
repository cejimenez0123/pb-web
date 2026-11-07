import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import styles from "../../styles/style";


function SignInButton({ mobile = false }) {
  const router = useIonRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(Paths.login, 'forward')
      }
          className={styles.navbar.mobileItem}
    >
      Sign in
    </button>
  );
}


export default SignInButton