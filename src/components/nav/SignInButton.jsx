import { useIonRouter } from "@ionic/react";


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
        text-md
      "
    >
      Sign in
    </button>
  );
}


export default SignInButton