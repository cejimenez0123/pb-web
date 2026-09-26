import {
  IonImg,
  useIonRouter,
  IonContent,
} from "@ionic/react";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useDispatch } from "react-redux";

import {
  uploadProfilePicture,
} from "../../actions/ProfileActions";

import {
  acceptTerms,
  signUp,
} from "../../actions/UserActions";

import checkResult from "../../core/checkResult";
import Paths from "../../core/paths";
import Context from "../../context";
import "../../App.css";

import {
  Preferences,
} from "@capacitor/preferences";

import {
  Capacitor,
} from "@capacitor/core";

import {
  useAlert,
} from "../../core/useAlert";

import AlertType from "../../core/AlertType";
import authRepo from "../../data/authRepo";
import debounce from "../../core/debounce";

import EULATERMS from "./Agreement";

import {
  useDialog,
} from "../../domain/usecases/useDialog";

import CURRENT_TERMS_VERSION from "../../core/CURRENT_TERMS_VERSION";


const DEFAULT_PROFILE_IMAGE =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";


const SPRINT_SLOTS = [
  {
    id: "morning",
    label: "Morning",
    emoji: "🌅",
    time: "7:00 AM",
  },
  {
    id: "midday",
    label: "Midday",
    emoji: "☀️",
    time: "12:00 PM",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    emoji: "🌤",
    time: "3:00 PM",
  },
  {
    id: "evening",
    label: "Evening",
    emoji: "🌆",
    time: "7:00 PM",
  },
  {
    id: "night",
    label: "Night",
    emoji: "🌙",
    time: "10:00 PM",
  },
];


const inputClass =
  "w-full rounded-xl border border-[#dce8d9] bg-[#fffdf7] px-4 py-3 text-[15px] text-[#173b32] outline-none transition focus:border-[#21866b] focus:ring-2 focus:ring-[#21866b]/10 placeholder:text-[#8ca099]";


const sectionLabelClass =
  "text-[11px] font-bold uppercase tracking-[0.14em] text-[#21866b]";


/*
 * The JWT is verified by the backend.
 *
 * Here we only decode the payload so the approved
 * email can be displayed in the signup UI.
 */
function getTokenPayload(token) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    const json = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map(
          (char) =>
            "%" +
            ("00" +
              char.charCodeAt(0).toString(16)
            ).slice(-2)
        )
        .join("")
    );

    return JSON.parse(json);
  } catch (error) {
    console.error(
      "TOKEN DECODE ERROR:",
      error
    );

    return null;
  }
}


export default function SignUpContainer(props) {
  const [referralToken, setReferralTokenState] =
    useState(null);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [writingSprintSlots, setWritingSprintSlots] =
    useState([]);

  const [selectedImage, setSelectedImage] =
    useState(DEFAULT_PROFILE_IMAGE);

  const [selfStatement, setSelfStatement] =
    useState("");

  const [fileFind, setFile] =
    useState(null);

  const [pictureUrl, setPictureUrl] =
    useState(DEFAULT_PROFILE_IMAGE);

  const [frequency, setFrequency] =
    useState(1);

  const [isPrivate, setIsPrivate] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [agreedToTerms, setAgreedToTerms] =
    useState(false);

  const [showTerms, setShowTerms] =
    useState(false);


  const {
    showAlert,
    showPrompt,
  } = useAlert();

  const router = useIonRouter();

  const dispatch = useDispatch();

  const {
    openDialog,
    resetDialog,
  } = useDialog();


  /*
   * Get the approval token from the URL,
   * save it for signup, and read the approved
   * email for display.
   */
  useEffect(() => {
    const params =
      new URLSearchParams(
        router.routeInfo.search
      );

    const token =
      params.get("token");

    if (!token) {
      return;
    }

    Preferences.set({
      key: "token",
      value: token,
    });

    setReferralTokenState(token);

    const tokenPayload =
      getTokenPayload(token);

    if (tokenPayload?.email) {
      setEmail(
        String(tokenPayload.email)
          .trim()
          .toLowerCase()
      );
    }
  }, []);


  const toggleSlot = (slotId) => {
    setWritingSprintSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter(
            (slot) => slot !== slotId
          )
        : [...prev, slotId]
    );
  };


  const openTerms = () => {
    openDialog({
      title: "Terms & Conditions",
      height: 90,
      breakpoint: 1,

      text: () => <EULATERMS />,

      agree: async () => {
        await dispatch(
          acceptTerms({
            version:
              CURRENT_TERMS_VERSION,
          })
        );

        setAgreedToTerms(true);

        resetDialog();
      },

      agreeText: "I Agree",

      disagree: () =>
        resetDialog(),

      disagreeText: "Cancel",
    });
  };


  const handleProfilePicture = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showAlert({
        message:
          "Please upload a valid image file.",
        type: AlertType.error,
      });

      return;
    }

    if (
      pictureUrl?.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        pictureUrl
      );
    }

    if (
      Capacitor.isNativePlatform()
    ) {
      const newUrl =
        URL.createObjectURL(file);

      setFile(file);
      setPictureUrl(newUrl);
    } else {
      const reader =
        new FileReader();

      reader.onloadend = () => {
        setPictureUrl(
          reader.result
        );

        setFile(file);
      };

      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    return () => {
      if (
        pictureUrl?.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          pictureUrl
        );
      }
    };
  }, [pictureUrl]);


  const [usernameUnique, setUsernameUnique] =
    useState(true);


  const debouncedCheck = useRef(
    debounce((u) => {
      authRepo
        .checkUsername(u)
        .then((data) => {
          setUsernameUnique(
            data
              ? data.available
              : false
          );
        })
        .catch(() => {
          setUsernameUnique(false);
        });
    }, 300)
  ).current;

useEffect(() => {
  const params = new URLSearchParams(router.routeInfo.search);
  const token = params.get("token");

  console.log("SIGNUP TOKEN:", token);

  if (!token) {
    console.log("NO TOKEN FOUND");
    return;
  }

  const tokenPayload = getTokenPayload(token);

  console.log("TOKEN PAYLOAD:", tokenPayload);
  console.log("TOKEN EMAIL:", tokenPayload?.email);

  if (tokenPayload?.email) {
    setEmail(
      String(tokenPayload.email)
        .trim()
        .toLowerCase()
    );
  } else {
    console.log("TOKEN DOES NOT CONTAIN EMAIL");
  }

  Preferences.set({
    key: "token",
    value: token,
  });

  setReferralTokenState(token);
}, []);
  useEffect(() => {
    if (
      username.trim().length >= 4
    ) {
      debouncedCheck(
        username.trim()
      );
    } else {
      setUsernameUnique(true);
    }
  }, [username]);


  const completeSignUp = async () => {
    if (loading) {
      return;
    }

    if (
      username.trim().length < 4
    ) {
      showAlert({
        message:
          "Choose a username with at least 4 characters.",
        type: AlertType.error,
      });

      return;
    }

    if (!usernameUnique) {
      showAlert({
        message:
          "That username is already taken. Try another one.",
        type: AlertType.error,
      });

      return;
    }

    if (!password) {
      showAlert({
        message:
          "Please create a password.",
        type: AlertType.error,
      });

      return;
    }

    if (
      password !== confirmPassword
    ) {
      showAlert({
        message:
          "Your passwords don't match.",
        type: AlertType.error,
      });

      return;
    }

    if (!agreedToTerms) {
      showAlert({
        message:
          "Please review and accept the Terms & Conditions before continuing.",
        type: AlertType.error,
      });

      return;
    }

    try {
      setLoading(true);

      const {
        value: identityToken,
      } = await Preferences.get({
        key: "idToken",
      });

      const {
        value: googleId,
      } = await Preferences.get({
        key: "googleId",
      });

      const {
        value: storedToken,
      } = await Preferences.get({
        key: "token",
      });


      const pictureParams =
        fileFind
          ? {
              file: fileFind,
            }
          : {
              profilePicture:
                selectedImage,
            };


      const params = {
        authToken:
          identityToken,

        referralToken:
          referralToken ??
          storedToken,

        username:
          username.trim() ||
          null,

        password,

        googleId,

        writingSprintSlots,

        frequency,

        selfStatement,

        privacy:
          isPrivate,

        termsVersion:
          CURRENT_TERMS_VERSION,

        termsAcceptedAt:
          new Date().toISOString(),

        ...pictureParams,
      };


      if (fileFind) {
        const uploadRes =
          await dispatch(
            uploadProfilePicture({
              file: fileFind,
            })
          );

        await checkResult(
          uploadRes,

          async (
            uploadPayload
          ) => {
            params.profilePicture =
              uploadPayload.fileName;

            await submitSignup(
              params
            );
          },

          (err) => {
            showAlert({
              message:
                err?.message ||
                "We couldn't upload your photo. Please try again.",

              type:
                AlertType.error,
            });
          }
        );

        return;
      }


      await submitSignup(params);
    } catch (err) {
      console.error(
        "SIGN UP ERROR:",
        err
      );

      showAlert({
        message:
          err?.status === 409
            ? "That username is already taken. Try another one."
            : err?.message ||
              "We couldn't finish setting up your account. Please try again.",

        type:
          AlertType.error,
      });
    } finally {
      setLoading(false);
    }
  };


  const submitSignup = async (
    params
  ) => {
    try {
      const res =
        await dispatch(
          signUp(params)
        );

      await checkResult(
        res,

        async (payload) => {
          await Preferences.set({
            key: "firstTime",

            value: String(
              payload.firstTime ||
                false
            ),
          });


          if (!payload.profile) {
            showAlert({
              message:
                payload?.error
                  ?.status === 409
                  ? "That username is already taken. Try another one."
                  : payload?.error
                      ?.message ||
                    "We couldn't finish setting up your account. Please try again.",

              type:
                AlertType.error,
            });

            return;
          }


          if (
            !Capacitor.isNativePlatform()
          ) {
            showPrompt({
              message:
                "You're in. Now go to the app and make some space for your writing.",

              agree: () => {
                router.push(
                  Paths.login
                );
              },

              agreeText:
                "Let's go",
            });

            return;
          }


          showPrompt({
            message:
              "You're in. Open Plumbum and make some space for your writing.",

            agree: () => {
              router.push(
                Paths.login
              );
            },

            agreeText:
              "Open Plumbum",

            disagreeText:
              "Stay here",
          });
        },

        (err) => {
          showAlert({
            message:
              err?.status === 409
                ? "That username is already taken. Try another one."
                : err?.message ||
                  "We couldn't finish setting up your account. Please try again.",

            type:
              AlertType.error,
          });
        }
      );
    } catch (err) {
      console.error(
        "SIGN UP REQUEST ERROR:",
        err
      );

      showAlert({
        message:
          err?.status === 409
            ? "That username is already taken. Try another one."
            : err?.message ||
              "We couldn't finish setting up your account. Please try again.",

        type:
          AlertType.error,
      });
    }
  };


  return (
    <IonContent
      color="light"
      fullscreen
      className="page-content"
      style={{
        "--padding-top":
          "0px",

        "--padding-bottom":
          "env(safe-area-inset-bottom)",
      }}
    >
      <IOSFormTemplate
        email={email}

        writingSprintSlots={
          writingSprintSlots
        }

        toggleSlot={
          toggleSlot
        }

        username={
          username
        }

        setUsername={
          setUsername
        }

        password={
          password
        }

        setPassword={
          setPassword
        }

        isPrivate={
          isPrivate
        }

        setIsPrivate={
          setIsPrivate
        }

        onSubmit={
          completeSignUp
        }

        loading={
          loading
        }

        agreedToTerms={
          agreedToTerms
        }

        openTerms={
          openTerms
        }

        showTerms={
          showTerms
        }

        setShowTerms={
          setShowTerms
        }

        setConfirmPassword={
          setConfirmPassword
        }

        confirmPassword={
          confirmPassword
        }

        pictureUrl={
          pictureUrl
        }

        handleProfilePicture={
          handleProfilePicture
        }

        usernameUnique={
          usernameUnique
        }

        showPassword={
          showPassword
        }

        setShowPassword={
          setShowPassword
        }
      />
    </IonContent>
  );
}


function IOSFormTemplate({
  email,

  writingSprintSlots,

  toggleSlot,

  confirmPassword,

  setConfirmPassword,

  username,

  setUsername,

  password,

  setPassword,

  isPrivate,

  setIsPrivate,

  onSubmit,

  loading,

  agreedToTerms,

  openTerms,

  pictureUrl,

  handleProfilePicture,

  usernameUnique,

  showPassword,

  setShowPassword,
}) {
  return (
    <div className="min-h-screen bg-[#f5f1df] text-[#173b32]">

      <div
        className="
          mx-auto
          max-w-xl
          px-5
          pb-12
          pt-8
          sm:px-6
        "
      >

        {/* HEADER */}

        <header className="mb-8">

          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >

            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-[#cfe1d5]
                bg-[#fffdf7]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[#21866b]
              "
            >
              <span className="mr-1.5">
                ✦
              </span>

              You're invited
            </div>


            <div
              className="
                text-xs
                font-medium
                text-[#7b928b]
              "
            >
              Plumbum
            </div>

          </div>


          <h1
            className="
              max-w-lg
              text-4xl
              font-semibold
              leading-[1.05]
              tracking-[-0.04em]
              text-[#173b32]
              sm:text-5xl
            "
          >
            Make yourself
            <br />
            at home.
          </h1>


          <p
            className="
              mt-5
              max-w-md
              text-base
              leading-7
              text-[#4b6961]
            "
          >
            Your application made it
            through. Now give your little
            corner of Plumbum a name, a
            face, and a rhythm that works
            for you.
          </p>

        </header>


        {/* YOUR CORNER */}

        <section
          className="
            mb-5
            rounded-[24px]
            border
            border-[#dce8d9]
            bg-[#fffdf7]
            p-5
            shadow-[0_8px_30px_rgba(23,59,50,0.04)]
            sm:p-6
          "
        >

          <div className="mb-5">

            <p
              className={
                sectionLabelClass
              }
            >
              Your corner
            </p>


            <h2
              className="
                mt-1.5
                text-xl
                font-semibold
                tracking-[-0.02em]
                text-[#173b32]
              "
            >
              Start with a name.
            </h2>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-[#6a827b]
              "
            >
              This is how people will find
              you around Plumbum.
            </p>

          </div>


          {/* APPROVED EMAIL */}

          <div className="mb-5">

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#36574f]
              "
            >
              Email
            </label>


            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-[#dce8d9]
                bg-[#f3f7ef]
                px-4
                py-3
              "
            >

              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#fffdf7]
                  text-[#21866b]
                "
              >
                @
              </span>


              <div
                className="
                  min-w-0
                "
              >

                <p
                  className="
                    truncate
                    text-[15px]
                    text-[#36574f]
                  "
                >
                  {email ||
                    "Loading..."}
                </p>


                <p
                  className="
                    mt-0.5
                    text-xs
                    leading-5
                    text-[#7b928b]
                  "
                >
                  This is the email your
                  invitation was sent to.
                </p>

              </div>

            </div>

          </div>


          {/* USERNAME */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#36574f]
              "
            >
              Username
            </label>


            <div className="relative">

              <span
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#8ca099]
                "
              >
                @
              </span>


              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s/g, "")
                  )
                }
                placeholder="yourname"
                autoCapitalize="none"
                autoCorrect="off"
                className={`${inputClass} pl-8`}
              />

            </div>


            {username.length >= 4 &&
              !usernameUnique && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-[#b64b45]
                  "
                >
                  That username is
                  already taken.
                </p>
              )}


            {username.length >= 4 &&
              usernameUnique && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-[#21866b]
                  "
                >
                  ✓ That one is available.
                </p>
              )}

          </div>


          {/* PROFILE IMAGE */}

          <div
            className="
              mt-6
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-[#e2ebe0]
              bg-[#f8f7ec]
              p-4
            "
          >

            <div
              className="
                max-h-16
                max-w-16
                shrink-0
                overflow-hidden
                rounded-2xl
                bg-[#dce8d9]
              "
            >

              <img
                src={pictureUrl}
                alt="Profile preview"
                className="
                  h-full
                  w-full
                  object-cover
                "
              />

            </div>


            <div className="min-w-0 flex-1">

              <p
                className="
                  text-sm
                  font-semibold
                  text-[#36574f]
                "
              >
                Add a photo
              </p>


              <p
                className="
                  mt-0.5
                  text-xs
                  leading-5
                  text-[#7b928b]
                "
              >
                Optional. A face, a drawing,
                something that feels like you.
              </p>


              <label
                className="
                  mt-2
                  inline-flex
                  cursor-pointer
                  items-center
                  rounded-lg
                  border
                  border-[#bcd8cc]
                  bg-[#fffdf7]
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[#21866b]
                  transition
                  hover:border-[#21866b]
                  hover:bg-[#f3f7ef]
                "
              >
                Choose photo

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    handleProfilePicture
                  }
                />

              </label>

            </div>

          </div>

        </section>


        {/* YOUR RHYTHM */}

        <section
          className="
            mb-5
            rounded-[24px]
            border
            border-[#dce8d9]
            bg-[#fffdf7]
            p-5
            shadow-[0_8px_30px_rgba(23,59,50,0.04)]
            sm:p-6
          "
        >

          <div className="mb-5">

            <p
              className={
                sectionLabelClass
              }
            >
              Your rhythm
            </p>


            <h2
              className="
                mt-1.5
                text-xl
                font-semibold
                tracking-[-0.02em]
                text-[#173b32]
              "
            >
              When do you like to write?
            </h2>


            <p
              className="
                mt-1
                max-w-md
                text-sm
                leading-6
                text-[#6a827b]
              "
            >
              Pick the windows that sound
              good. These are invitations,
              not homework.
            </p>

          </div>


          <div className="space-y-2">

            {SPRINT_SLOTS.map(
              (slot) => {
                const selected =
                  writingSprintSlots.includes(
                    slot.id
                  );

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() =>
                      toggleSlot(
                        slot.id
                      )
                    }
                    className={`
                      group
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      px-4
                      py-3.5
                      text-left
                      transition-all
                      ${
                        selected
                          ? "border-[#21866b] bg-[#eef7f0]"
                          : "border-[#e2ebe0] bg-[#fffdf7] hover:border-[#bcd8cc] hover:bg-[#fafaf2]"
                      }
                    `}
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >

                      <span
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#f3f0df]
                          text-base
                        "
                      >
                        {slot.emoji}
                      </span>


                      <div>

                        <p
                          className={`
                            text-sm
                            font-semibold
                            ${
                              selected
                                ? "text-[#21866b]"
                                : "text-[#36574f]"
                            }
                          `}
                        >
                          {slot.label}
                        </p>


                        <p
                          className="
                            mt-0.5
                            text-xs
                            text-[#8ca099]
                          "
                        >
                          {slot.time}
                        </p>

                      </div>

                    </div>


                    <span
                      className={`
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        transition-all
                        ${
                          selected
                            ? "border-[#21866b] bg-[#21866b]"
                            : "border-[#cbd9d2] bg-[#fffdf7]"
                        }
                      `}
                    >

                      {selected && (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="
                            h-3.5
                            w-3.5
                            text-white
                          "
                        >
                          <path
                            d="M5 12.5l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}

                    </span>

                  </button>
                );
              }
            )}

          </div>


          <p
            className="
              mt-4
              text-xs
              leading-5
              text-[#8ca099]
            "
          >
            You can change these later.
            Your creative life doesn't need
            to fit a schedule.
          </p>

        </section>


        {/* YOUR KEY */}

        <section
          className="
            mb-5
            rounded-[24px]
            border
            border-[#dce8d9]
            bg-[#fffdf7]
            p-5
            shadow-[0_8px_30px_rgba(23,59,50,0.04)]
            sm:p-6
          "
        >

          <div className="mb-5">

            <p
              className={
                sectionLabelClass
              }
            >
              Your key
            </p>


            <h2
              className="
                mt-1.5
                text-xl
                font-semibold
                tracking-[-0.02em]
                text-[#173b32]
              "
            >
              Make a password.
            </h2>


            <p
              className="
                mt-1
                text-sm
                leading-6
                text-[#6a827b]
              "
            >
              Something you'll remember.
              That's all we need here.
            </p>

          </div>


          {/* PASSWORD */}

          <div>

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#36574f]
              "
            >
              Password
            </label>


            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Create a password"
                className={`${inputClass} pr-16`}
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  px-2
                  py-1
                  text-xs
                  font-semibold
                  text-[#21866b]
                  hover:bg-[#f3f7ef]
                "
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* CONFIRM PASSWORD */}

          <div className="mt-4">

            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-[#36574f]
              "
            >
              Confirm password
            </label>


            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Type it again"
                className={`
                  ${inputClass}
                  pr-16
                  ${
                    confirmPassword.length >
                      0 &&
                    confirmPassword !==
                      password
                      ? "border-[#c96a63] focus:border-[#c96a63] focus:ring-[#c96a63]/10"
                      : ""
                  }
                `}
              />


              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rounded-lg
                  px-2
                  py-1
                  text-xs
                  font-semibold
                  text-[#21866b]
                  hover:bg-[#f3f7ef]
                "
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>


            {confirmPassword.length >
              0 &&
              confirmPassword !==
                password && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-[#b64b45]
                  "
                >
                  These don't match yet.
                </p>
              )}


            {confirmPassword.length >
              0 &&
              confirmPassword ===
                password && (
                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-[#21866b]
                  "
                >
                  ✓ You're good.
                </p>
              )}

          </div>

        </section>


        {/* VISIBILITY */}

        <section
          className="
            mb-5
            rounded-[24px]
            border
            border-[#dce8d9]
            bg-[#fffdf7]
            p-5
            shadow-[0_8px_30px_rgba(23,59,50,0.04)]
            sm:p-6
          "
        >

          <div
            className="
              flex
              items-start
              justify-between
              gap-5
            "
          >

            <div>

              <p
                className={
                  sectionLabelClass
                }
              >
                Your visibility
              </p>


              <h2
                className="
                  mt-1.5
                  text-lg
                  font-semibold
                  text-[#173b32]
                "
              >
                Keep your profile private
              </h2>


              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-[#6a827b]
                "
              >
                Your profile won't appear in
                search or public listings.
              </p>

            </div>


            <button
              type="button"
              role="switch"
              aria-checked={
                isPrivate
              }
              onClick={() =>
                setIsPrivate(
                  !isPrivate
                )
              }
              className={`
                relative
                mt-1
                h-7
                w-12
                shrink-0
                rounded-full
                transition
                ${
                  isPrivate
                    ? "bg-[#21866b]"
                    : "bg-[#cbd9d2]"
                }
              `}
            >

              <span
                className={`
                  absolute
                  top-1
                  h-5
                  w-5
                  rounded-full
                  bg-white
                  shadow-sm
                  transition-transform
                  ${
                    isPrivate
                      ? "translate-x-6"
                      : "translate-x-1"
                  }
                `}
              />

            </button>

          </div>

        </section>


        {/* TERMS */}

        <section
          className="
            mb-6
            rounded-2xl
            border
            border-[#dce8d9]
            bg-[#f3f7ef]
            p-4
          "
        >

          <button
            type="button"
            onClick={openTerms}
            className="
              flex
              w-full
              items-start
              gap-3
              text-left
            "
          >

            <span
              className={`
                mt-0.5
                flex
                h-5
                w-5
                shrink-0
                items-center
                justify-center
                rounded-md
                border
                transition
                ${
                  agreedToTerms
                    ? "border-[#21866b] bg-[#21866b]"
                    : "border-[#abc7ba] bg-[#fffdf7]"
                }
              `}
            >

              {agreedToTerms && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="
                    h-3
                    w-3
                    text-white
                  "
                >
                  <path
                    d="M5 12.5l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

            </span>


            <span>

              <span
                className="
                  block
                  text-sm
                  font-medium
                  text-[#36574f]
                "
              >
                {agreedToTerms
                  ? "Terms accepted"
                  : "Review the Terms & Conditions"}
              </span>


              <span
                className="
                  mt-1
                  block
                  text-xs
                  leading-5
                  text-[#6a827b]
                "
              >
                {agreedToTerms
                  ? "You're all set."
                  : "Take a look before you step inside."}
              </span>

            </span>

          </button>

        </section>


        {/* SUBMIT */}

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[#21866b]
            px-5
            py-4
            text-base
            font-semibold
            text-white
            shadow-[0_8px_20px_rgba(33,134,107,0.18)]
            transition-all
            hover:bg-[#1c765e]
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >

          {loading ? (
            <>

              <span
                className="
                  h-4
                  w-4
                  animate-spin
                  rounded-full
                  border-2
                  border-white/40
                  border-t-white
                "
              />

              Setting up your space...

            </>
          ) : (
            <>

              I'm ready

              <span
                className="
                  text-lg
                  leading-none
                "
              >
                →
              </span>

            </>
          )}

        </button>


        <p
          className="
            mx-auto
            mt-4
            max-w-sm
            text-center
            text-xs
            leading-5
            text-[#8ca099]
          "
        >
          You don't have to do everything
          here forever. You can change your
          settings once you're inside.
        </p>

      </div>

    </div>
  );
}