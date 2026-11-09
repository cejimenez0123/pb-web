import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";
import styles from "../../styles/style";


function SignInButton({ mobile = false,onClick }) {
  const router = useIonRouter();

  return (
    <button
      type="button"
      onClick={() =>{
       onClick && onClick()
        router.push(Paths.login, 'forward')}
      }
          className={styles.navbar.mobileItem}
    >
    <h6 className="text-[1rem]">Sign in</h6> 
    </button>
  );
}


export default SignInButton