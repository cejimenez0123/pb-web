
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
      <div className="min-h-full flex items-start justify-center px-6 py-12 md:py-20">
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

          <p className="text-xs uppercase tracking-[0.14em] text-soft">
            Welcome back
          </p>

          <h1 className="mont-medium text-4xl md:text-5xl text-emerald-800 tracking-tight">
            Log in
          </h1>

          <p className="text-sm md:text-base text-emerald-800/65 leading-relaxed max-w-sm mx-auto">
            Return to your writing, your people, and the work
            you’re making.
          </p>
        </header>

        {/* Login form */}
       <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogIn();
  }}>


          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-sm text-emerald-800"
            >
              Email
            </label>

            <input
              id="login-email"
              type="text"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value.toLowerCase())
              }
              placeholder="example@email.com"
              className="
                w-[100%]
                bg-base-bg
                border
                border-emerald-800/20
                rounded-xl
                px-4
                py-3
                text-emerald-800
                placeholder:text-emerald-800/35
                focus:outline-none
                focus:border-soft
                focus:ring-1
                focus:ring-soft/40
                text-base
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="block text-sm text-emerald-800"
            >
              Password
            </label>

            <div
              className="
                relative
                flex
                items-center
                 bg-transparent
                border
                border-emerald-800/20
                rounded-xl
                focus-within:border-soft
                focus-within:ring-1
                focus-within:ring-soft/40
                transition
              "
            >
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onInput={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full
                 
                  border-0
                  rounded-xl
                  px-4
                  py-3
                  pr-16
                bg-transparent
                  text-emerald-800
                  placeholder:text-emerald-800/35
                  focus:outline-none
                  text-base
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-3
           
                  text-xs
                  text-soft
                  hover:text-emerald-700
                  transition-colors
                  px-2
                  py-1
                "
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
            className="
              w-full
              py-3
              mt-2
              rounded-full
              bg-emerald-800
              text-white
              text-base
              border
              border-soft
              transition-all
              duration-200
              hover:bg-emerald-700
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {pending ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-emerald-800/15" />

          <span className="text-xs text-emerald-800/45">
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
        <div className="pt-1 text-center space-y-3">
          <button
            type="button"
            onClick={() => router.push(Paths.onboard)}
            className="
              block
              mx-auto
              text-sm
              text-soft
              hover:text-emerald-700
              transition-colors
            "
          >
            First time here?
          </button>

          <button
            type="button"
            onClick={handleForgotPasswordDialog}
            className="
              block
              mx-auto
              text-xs
              text-emerald-800/55
              hover:text-emerald-800
              transition-colors
            "
          >
            Forgot password?
          </button>
        </div>

      </div>
    </main>
  );
}

