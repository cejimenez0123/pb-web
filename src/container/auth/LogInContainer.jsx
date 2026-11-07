
import {  useEffect, useState } from "react";
import { useAlert } from "../../core/useAlert.jsx";
import AlertType from "../../core/AlertType.js";
import "../../App.css";
import {  logIn } from "../../actions/UserActions";
import { useDispatch } from "react-redux";
import Paths from "../../core/paths";
import checkResult from "../../core/checkResult";
import ForgotPasswordForm from "../../components/auth/ForgetPasswordForm";
import { IonContent, useIonRouter } from "@ionic/react";
import AppleSignInButton from "../../components/auth/AppleSignInButton";
import GoogleLogin from "../../components/GoogleLogin";
import { Capacitor } from "@capacitor/core";
import { useDialog } from "../../domain/usecases/useDialog.jsx";

import useTermsAcceptance from "../../core/useTermsAcceptance.jsx";
import styles from "../../styles/style.js";

export default function LogInContainer({ currentProfile }) {
  const { showAlert, closeAlert, showPrompt } = useAlert();
  const router = useIonRouter();

  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!currentProfile?.id || signingIn) return;

    setTimeout(() => {
      router.push(Paths.myProfile, "root");
    }, 0);
  }, [currentProfile, router, signingIn]);

  return (
    <IonContent className="page-content" fullscreen>
      <div className={styles.pageShell.base+" px-4"}>
        
        <LogInCard
          setSigningIn={setSigningIn}
          setLogInError={(msg) =>
            showPrompt({
              message: msg,
              type: AlertType.prompt,
              agree: () => closeAlert(),
              agreeText: "Understood",
            })
          }
        />
      </div>
    </IonContent>
  );
}

function LogInCard({ setSigningIn, setLogInError }) {
  const dispatch = useDispatch();
  const router = useIonRouter();
const promptTermsAcceptance = useTermsAcceptance();
  const { showAlert, closeAlert, showPrompt } = useAlert();

  const {
    openDialog,
    resetDialog,
    closeDialog,
    dialog,
  } = useDialog();

  const isNative = Capacitor.isNativePlatform();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthError = (err) => {
    const message =
      err?.data?.message || err?.message || "Unknown error";

    const isNoAccount = err?.status === 404;

    if (isNoAccount) {
      showPrompt({
        message: "No account found. Have you applied to Plumbum?",
        type: AlertType.prompt,
        agree: () => {
          closeAlert();
          router.push(Paths.onboard);
        },
        agreeText: "Apply Now",
      });
    } else {
      showAlert({
        message,
        type: AlertType.error,
      });
    }
  };
 const handleLogIn = () => {
    if (email.length > 3 && password.length) {
      setPending(true);

      dispatch(
        logIn({
          email: email.toLowerCase(),
          password,
          isNative,
        })
      ).then((res) => {
        checkResult(
          res,
          (payload) => {
            if (payload?.profile?.id) {
              if (!payload?.termsCurrent) {
                promptTermsAcceptance(() =>
                  router.push(Paths.home, "forward")
                );
              } else {
                router.push(Paths.home, "forward");
              }
            } else {
              showAlert({
                message: "Error with Profile",
                type: AlertType.error,
              });
            }
          },
          (err) => {
            handleAuthError(err);
            setPending(false);
          }
        );
      });
    } else {
      setPending(false);

      showAlert({
        message: "Values can't be empty",
        type: AlertType.error,
      });
    }
  };

  const dispatchLogin = ({
    email,
    googleId,
    idToken,
    provider,
  }) => {
    if (!idToken && !googleId) {
      showAlert({
        message: "Login failed: missing credentials",
        type: AlertType.error,
      });

      return;
    }

    setSigningIn(true);
    setPending(true);

    dispatch(
      logIn({
        email: email || null,
        uId: googleId || null,
        idToken: idToken || null,
        provider,
        isNative,
      })
    ).then((res) => {
      checkResult(
        res,
        (payload) => {
          if (payload?.profile?.id) {
            if (!payload?.termsCurrent) {
              promptTermsAcceptance(() =>
                router.push(Paths.home, "forward")
              );
            } else {
              router.push(Paths.home, "forward");
            }
          } else {
            showPrompt({
              message:
                "No profile found. Check email or apply",
              type: AlertType.prompt,
              agree: () => closeAlert(),
              agreeText: "Understood",
            });
          }

          setPending(false);
          setSigningIn(false);
        },
        (err) => {
          handleAuthError(err);
          setPending(false);
          setSigningIn(false);
        }
      );
    });
  };

  const handleForgotPasswordDialog = () => {
    openDialog({
      ...dialog,
      isOpen: true,
      title: null,
      agree: null,
      agreeText: null,
      disagreeText: "Close",
      breakpoint: 1,
      text: <ForgotPasswordForm />,
      onClose: closeDialog,
    });
  };

  return (
    // <main className="w-full max-w-md mx-auto text-emerald-800">
      <div className={styles.pageShell.body+" "+styles.pageShell.padded}>

        {/* Header */}
        <header className="space-y-3 text-center">

      

        <h1 className={styles.text.display}>
  Log in
</h1>

<p className={styles.text.body}>
  Return to your writing, your people, and the work you’re making.
</p>
        </header>

        {/* Login form */}
       <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogIn();
  }}>


          {/* Email */}
       <div className={styles.login.fields}>
    

            <div className={styles.login.field}>
  <label
    htmlFor="login-email"
    className={`${styles.text.body} mb-2 block font-medium`}
  >
    Email
  </label>

  <div
    className="
      flex w-full min-w-0 items-center gap-2
      rounded-full min-h-12 border border-plumb-borderStrong
      bg-plumb-canvas px-4
      transition-all duration-200
      focus-within:border-plumb-mint
      focus-within:ring-2 focus-within:ring-plumb-mint/20
      dark:border-plumb-darkBorderStrong
      dark:bg-plumb-dark-surface
      dark:focus-within:border-plumb-mintLight
      dark:focus-within:ring-plumb-mintLight/20
     
    "
  >
    <input
      id="login-email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="example@email.com"
      autoComplete="email"
      required
      disabled={pending}
      className="
        h-14 w-full min-w-0 flex-1
        border-0 bg-plumb-canvas dark:bg-transparent px-
     text-plumb-ink dark:text-plumb-darkText
        placeholder:text-plumb-subtle
        outline-none ring-0
        focus:border-0 focus:outline-none focus:ring-0
        disabled:cursor-not-allowed disabled:opacity-60
        dark:text-plumb-darkText
        dark:placeholder:text-plumb-darkSubtle
      "
    />
  </div>
</div>

        
          </div>
         
<div className={styles.login.field}>
  <label
    htmlFor="login-password"
    className={`${styles.text.body} mb-2 block font-medium`}
  >
    Password
  </label>

  <div
    className="
      flex w-full min-w-0 items-center gap-2
      rounded-full min-h-12 border border-plumb-borderStrong
     bg-plumb-canvas px-4
      transition-all duration-200
      focus-within:border-plumb-mint
      focus-within:ring-2 focus-within:ring-plumb-mint/20
      dark:border-plumb-darkBorderStrong
      dark:bg-plumb-dark-surface
      dark:focus-within:border-plumb-mintLight
      dark:focus-within:ring-plumb-mintLight/20
     
    "
  >
    <input
      id="login-password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Your password"
      autoComplete="current-password"
      required
      disabled={pending}
      className="
        h-14 w-full min-w-0 flex-1
        border-0 bg-transparent pl-1 pr-2
        text-base text-plumb-ink
        placeholder:text-plumb-subtle
        outline-none ring-0
        focus:border-0 focus:outline-none focus:ring-0
        disabled:cursor-not-allowed disabled:opacity-60
        dark:text-plumb-darkText
        dark:placeholder:text-plumb-darkSubtle
      "
    />

    <button
      type="button"
      onClick={() => setShowPassword((value) => !value)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      disabled={pending}
      className="
        shrink-0 rounded-full px-3 py-2
        text-sm font-semibold
        text-plumb-muted
        transition-colors
        hover:bg-plumb-mint/10 hover:text-plumb-mintHover
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-plumb-focus
        disabled:cursor-not-allowed disabled:opacity-50
        dark:text-plumb-darkMuted
        dark:hover:bg-plumb-mint/15
        dark:hover:text-plumb-mintLight
        dark:focus-visible:ring-plumb-mintLight
      "
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>
<div className="text-center p-8">

          {/* Primary action */}
          <div
  type="submit"
  disabled={pending}
  className={"dark:border dark:border-2 bg-plumb-mint dark:bg-transparent dark:border-plumb-mintLight min-w-[90%] hover:ring-offset-1 hover:ring-1 rounded-full "+styles.button.base}
 
>
 <p className=" text-plumb-darkText dark:text-plumb-mintLight text-l py-3">{pending ? "Logging in..." : "Log In"}</p> 
</div>

</div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          {/* <div className="h-px flex-1 " /> */}

            <h5 className={"mx-auto text-plumb-mint dark:text-plumb-mintLight"}>
            or
            </h5>
     

          {/* <div className="h-px flex-1 " /> */}
        </div>

        {/* Social login */}
        <div className="space-y-3">
          <div className="w-full flex justify-center">
            <AppleSignInButton
              onUserSignIn={({ idToken, email }) =>
                dispatchLogin({
                  email,
                  googleId: null,
                  idToken,
                  provider: "apple",
                })
              }
            />
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onUserSignIn={({
                email,
                name,
                googleId,
                idToken,
              }) =>
                dispatchLogin({
                  email,
                  googleId,
                  idToken,
                  provider: "google",
                })
              }
            />
          </div>
        </div>

        {/* Secondary actions */}
        <div className="pt-1 text-cente flex flex-col space-y-3">
          <div
            type="button"
            onClick={() => router.push(Paths.onboard)}

         className={"my-4"+" text-center border-plumb-surface border border-1 rounded-full py-3 hover:bg-plumb-mint/30 font-bold text-plumb-ink dark:text-plumb-darkText font-open-sans"}
          >
            First time here?
          </div>

          <div
            type="button"
            onClick={handleForgotPasswordDialog}
            className={styles.button.base+" border border-1 border-button-secondary-bg "+styles.button.secondary}
         
    
      
          >
            Forgot password?
          </div>
        </div>

      </div>
    // </main>
  );
}

