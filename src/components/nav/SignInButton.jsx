import { useIonRouter } from "@ionic/react";
import Paths from "../../core/paths";


function SignInButton({ mobile = false }) {
  const router = useIonRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(Paths.login, 'forward')
      }
      className="
        text-text-secondary
        hover:text-text-primary
        transition-colors
        whitespace-nowrap
        tracking-[-0.02em]
           text-[1.2em]
        bg-transparent
        
      "
    >
      Sign in
    </button>
  );
}


export default SignInButton