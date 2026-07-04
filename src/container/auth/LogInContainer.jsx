
import {useContext,useEffect,useState} from 'react'
import { useAlert } from '../../core/useAlert.jsx';
import AlertType from '../../core/AlertType.js';
import "../../App.css"
import { acceptTerms, logIn } from '../../actions/UserActions';
import {useDispatch} from 'react-redux';
import Paths from '../../core/paths';
import checkResult from '../../core/checkResult';
import ForgotPasswordForm from '../../components/auth/ForgetPasswordForm';
import Context from '../../context';
import { IonContent, useIonRouter } from '@ionic/react';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import GoogleLogin from '../../components/GoogleLogin';
import { Capacitor } from '@capacitor/core';
import { useDialog } from '../../domain/usecases/useDialog.jsx';
import EULATERMS from './Agreement.jsx';
import CURRENT_TERMS_VERSION from '../../core/CURRENT_TERMS_VERSION.jsx';

const WRAP           = "max-w-2xl mx-auto px-4";
const CARD           = "max-w-lg mx-auto px-4 py-6 rounded-lg text-emerald-800";
const FORM           = "space-y-6";
const FIELD          = "space-y-2";
const INPUT          = "w-[100%] rounded-full border border-1 border-soft px-4 py-2 text-emerald-800 bg-base-bg dark:text-emerald-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300";
const BUTTON_PRIMARY = "bg-soft rounded-full w-[100%] mx-auto py-3 mt-2 text-white text-lg";
const LINK           = "text-soft dark:text-cream hover:text-green-400 cursor-pointer";
const INPUT_WRAP     = "max-w-md mx-auto ";

export default function LogInContainer({ currentProfile }) {
  // const { setSeo } = useContext(Context);
  const { showAlert,closeAlert,showPrompt } = useAlert();
  const router = useIonRouter();

  // useEffect(() => {
  //   setSeo((prev) => ({ ...prev, title: "Plumbum (Log In) - Share Your Weirdness" }));
  // }, [setSeo]);

 // Option 1 — setTimeout (simplest)
const [signingIn, setSigningIn] = useState(false);

useEffect(() => {
  if (!currentProfile?.id || signingIn) return;
  setTimeout(() => {
    router.push(Paths.myProfile, "root");
  }, 0);
}, [currentProfile, router, signingIn]);

  return (
    <IonContent className="page-content" fullscreen>
      <div className="py-10">
        <LogInCard  setSigningIn={setSigningIn}  setLogInError={(msg) => showPrompt({ message: msg, type: AlertType.prompt, agree: () => closeAlert(), agreeText:"Understood"  })} />
      </div>
    </IonContent>
  );
}

function LogInCard({ setSigningIn, setLogInError }) {
  const dispatch = useDispatch();
  const router   = useIonRouter();
  const { showAlert ,closeAlert,showPrompt} = useAlert();
  const { openDialog,resetDialog, closeDialog, dialog } = useDialog();
  const isNative = Capacitor.isNativePlatform();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [pending, setPending]         = useState(false);


  const [showPassword, setShowPassword] = useState(false);
  //   showAlert({ message: err?.status === 401 ? "User Not Found. Apply Below" : err?.message || "Unknown error", type: AlertType.error });
  // };
// const handleAuthError = (err) => {
//   const message = err?.data?.message || err?.message || "Unknown error";
//   const isNoAccount = err?.status === 404;

//   if (isNoAccount) {
//     showPrompt({
//       message: "No account found. Have you applied to Plumbum?",
//       type: AlertType.prompt,
//       agree: () => {
//         closeAlert();
//         router.push(Paths.onboard);
//       },
//       agreeText: "Apply Now",
//     });
//   } else {
//     showAlert({ message, type: AlertType.error });
//   }
// };
const handleAuthError = (err) => {

  
  const message = err?.data?.message || err?.message || "Unknown error";
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
    showAlert({ message, type: AlertType.error });
  }
};


const promptTermsAcceptance = (onAccepted) => {
  openDialog({
    title: "Updated Terms & Conditions",
    height: 90,
    breakpoint: 1,
    text: () => <EULATERMS />,
    agree: async () => {
      await dispatch(acceptTerms({ version: CURRENT_TERMS_VERSION }));
      resetDialog();
      onAccepted();
    },
    agreeText: "I Agree",
    disagree: () => {
      resetDialog();
      dispatch(logOut());
    },
    disagreeText: "Decline",
  });
};
  const handleLogIn = () => {
    if (email.length > 3 && password.length) {
      setPending(true);
      dispatch(logIn({ email: email.toLowerCase(), password, isNative })).then((res) => {
        checkResult(
          res,
          (payload) => {
                console.log("Login handle:",payload);
            if (payload?.profile?.id) {
                 if (!payload?.termsCurrent) {
            promptTermsAcceptance(() => router.push(Paths.home, "forward"));
          } else {
            router.push(Paths.home, "forward");
          }
          
            } else {
              showAlert({ message: "Error with Profile", type: AlertType.error });
            }
          },
          (err) => {
            console.log("Login error:", err);
            handleAuthError(err);
            setPending(false);
          }
        );
      });
    } else {
      setPending(false);
      showAlert({ message: "Values can't be empty", type: AlertType.error });
    }
  };
  const dispatchLogin = ({ email, googleId, idToken, provider }) => {
  if (!idToken && !googleId) {
    showAlert({ message: "Login failed: missing credentials", type: AlertType.error });
    return;
  }
  setSigningIn(true);
  setPending(true);
  dispatch(logIn({
    email: email || null,
    uId: googleId || null,
    idToken: idToken || null,
    provider,
    isNative,
  })).then((res) => {
    checkResult(
      res,
      (payload) => {
        if (payload?.profile?.id) {
          console.log("Login successful:", payload);
            if (!payload?.termsCurrent) {

            promptTermsAcceptance(() => router.push(Paths.home, "forward"));
          } else {
            router.push(Paths.home, "forward");
          }
        } else {
          showPrompt({ message: "No profile found. Check email or apply", type: AlertType.prompt, agree: () => closeAlert(), agreeText: "Understood" });
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
      isOpen:      true,
      title:       null,
      agree:       null,
      agreeText:   null,
      disagreeText: "Close",
      breakpoint:  1,
      text:        <ForgotPasswordForm />,
      onClose:     closeDialog,
    });
  };

  return (
    <div className={WRAP}>
      <div className={CARD}>
        <div className="mx-auto">
          <div className={FORM}>
            <h1 className="text-emerald-800 mont-medium mx-auto text-center pb-4">Log In</h1>

            <div className={FIELD}>
              <label>Email</label>
              <div className={INPUT_WRAP}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="example@email.com"
                  className={INPUT}
                />
              </div>
            </div>

            <div className={FIELD}>
              <label>Password</label>
              <div className={INPUT_WRAP}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onInput={(e) => setPassword(e.target.value)}
                  placeholder="*****"
                  className={INPUT}
                />
              </div>
              <div className="text-right text-xs pr-2">
                <span onClick={() => setShowPassword(!showPassword)} className={LINK}>
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <button type="button" onClick={handleLogIn} className={BUTTON_PRIMARY}>
              {pending ? "Logging in..." : "Log In"}
            </button>

            <span className="flex flex-col mt-4 justify-center">
              <div className="w-fit mx-auto">
                <AppleSignInButton
                  onUserSignIn={({ idToken, email }) =>     dispatchLogin({ email, googleId: null, idToken, provider: 'apple' })}
                />
              </div>
              <GoogleLogin
                onUserSignIn={({ email, name, googleId, idToken }) =>   dispatchLogin({ email, googleId, idToken, provider: 'google' })}
              />
            </span>

            <div className="text-center space-y-3">
              <p onClick={() => router.push(Paths.onboard)} className={LINK}>
                First time here?
              </p>
              <p onClick={handleForgotPasswordDialog} className={`${LINK} text-sm`}>
                Forgot Password?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}