
import { useContext, useEffect, useState } from "react";
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
      <div className="min-h-full flex items-start justify-center px-6 pt-16 pb-30 md:py-20">
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
    <main className="w-full max-w-md mx-auto text-emerald-800">
      <div className="space-y-9">

        {/* Header */}
        <header className="space-y-3 text-center">

          {/* <p lassName={styles.text.display}>
            Welcome back
          </p> */}

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
       <div className="mt-6 space-y-2">
            <label
              htmlFor="login-email"
      className={styles.text.body}
            >
              Email
            </label>
  <div
    className="
      relative flex w-full min-w-0 items-center
      rounded-xl border border-plumb-borderStrong
      bg-paper transition-colors
      focus-within:border-plumb-focus
      focus-within:ring-2 focus-within:ring-plumb-focus/30
      dark:border-plumb-darkBorderStrong
      dark:bg-plumb-dark-surface
    "
  >
            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.toLowerCase())
              }
              placeholder="example@email.com"
             className={`${styles.input} w-[100%]  min-w-0 flex-1 w-full rounded-xl max-w-none`}
     
            />
            </div>
          </div>
{/* Password */}
<div className="mt-6 space-y-2">
  <label
    htmlFor="login-password"
    className={styles.text.body}
  >
    Password
  </label>

  <div
    className="
      relative flex w-full min-w-0 items-center
      rounded-xl border border-plumb-borderStrong
      bg-paper transition-colors
      focus-within:border-plumb-focus
      focus-within:ring-2 focus-within:ring-plumb-focus/30
      dark:border-plumb-darkBorderStrong
      dark:bg-plumb-dark-surface
    "
  >
    <input
      id="login-password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      autoComplete="current-password"
      className="
        min-w-0 flex-1 w-full
        border-0 bg-transparent
        rounded-xl py-3 pl-4 pr-20
        text-plumb-ink placeholder:text-plumb-muted
        dark:text-plumb-darkText dark:placeholder:text-plumb-darkMuted
        focus:outline-none focus:ring-0
      "
    />

    <button
      type="button"
      onClick={() => setShowPassword((visible) => !visible)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className={`
      
        ${styles.button.ghost}
        px-3 py-2 text-sm
      `}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>


          {/* Primary action */}
          <button
            type="button"
            onClick={handleLogIn}
            disabled={pending}
              className={`
                mt-4
    ${styles.button.base}
    ${styles.button.primary}
    ${styles.button.large}
    w-[100%]
  `}

   
          >
            {pending ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-emerald-800/15" />

          <span 
          className={styles.text.display}
          // className="text-xs text-emerald-800/45"
          >
            or
          </span>

          <div className="h-px flex-1 bg-emerald-800/15" />
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
          <button
            type="button"
            onClick={() => router.push(Paths.onboard)}
              className={`
    ${styles.button.base}
    ${styles.button.ghost}
    ${styles.button.medium}
   w-72
    mx-auto
  `}
      
          >
            First time here?
          </button>

          <button
            type="button"
            onClick={handleForgotPasswordDialog}
            className={styles.button.primary+" w-72 mx-auto"}
      
          >
            Forgot password?
          </button>
        </div>

      </div>
    </main>
  );
}

