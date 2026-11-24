

import { useState, useEffect, useRef, useContext } from "react";
import { useDispatch } from "react-redux";
import { uploadProfilePicture } from "../../actions/ProfileActions";
import { useReferral } from "../../actions/UserActions";
import Paths from "../../core/paths";
import Enviroment from "../../core/Enviroment";
import "../../App.css";
import Context from "../../context";
import authRepo from "../../data/authRepo";
import { debounce } from "lodash";
import { Preferences } from "@capacitor/preferences";
import { IonContent, useIonRouter } from "@ionic/react";
import ErrorBoundary from "../../ErrorBoundary";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
];

const ACCEPTED_IMAGE_EXTENSIONS = /\.(jpe?g|png|heic|heif)$/i;

export default function UseReferralContainer() {
  const router = useIonRouter();
  const dispatch = useDispatch();
  const { setError } = useContext(Context);

  const params = new URLSearchParams(router.routeInfo?.search);
  const [token] = useState(params.get("token"));

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selfStatement, setSelfStatement] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [isPrivate, setIsPrivate] = useState(false);

  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    Enviroment.blankProfile
  );

  const [usernameUnique, setUsernameUnique] = useState(true);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrlRef = useRef(null);

  const canSubmit =
    email.trim().length > 0 &&
    username.trim().length >= 4 &&
    password.length >= 6 &&
    password === confirmPassword &&
    usernameUnique &&
    !checkingUsername &&
    !isSubmitting;

  // Store the referral token for the initial authenticated request.
  useEffect(() => {
    if (token) {
      Preferences.set({ key: "token", value: token });
    }
  }, [token]);

  // Debounced username availability check.
  const debouncedCheck = useRef(
    debounce(async (value) => {
      try {
        const data = await authRepo.checkUsername(value);
        setUsernameUnique(Boolean(data?.available));
      } catch (error) {
        setUsernameUnique(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    const value = username.trim().toLowerCase();

    if (value.length < 4) {
      debouncedCheck.cancel();
      setUsernameUnique(false);
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    setUsernameUnique(false);
    debouncedCheck(value);

    return () => debouncedCheck.cancel();
  }, [username, debouncedCheck]);

  // Revoke the local preview URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      debouncedCheck.cancel();
    };
  }, [debouncedCheck]);

  const handleProfilePicture = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const validType = ALLOWED_IMAGE_TYPES.includes(selectedFile.type);
    const validExtension = ACCEPTED_IMAGE_EXTENSIONS.test(
      selectedFile.name || ""
    );

    if (!validType && !validExtension) {
      setError("Please choose a JPEG, PNG, HEIC, or HEIF image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Your profile picture must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(selectedFile);

    previewUrlRef.current = previewUrl;
    setFile(selectedFile);
    setSelectedImage(previewUrl);
  };

  const handleUseReferral = async () => {
    if (!token) {
      throw new Error("Invalid referral link.");
    }

    // The referral token authenticates the initial signup request.
    await Preferences.set({
      key: "token",
      value: token,
    });

    const payload = await dispatch(
      useReferral({
        email: email.trim().toLowerCase(),
        token,
        password,
        username: username.trim().toLowerCase(),
        frequency,
        selfStatement,
        isPrivate,
      })
    ).unwrap();

    if (!payload?.profile || !payload?.token) {
      throw new Error(
        "Signup did not return a profile and authentication token."
      );
    }

    // The new token authenticates the MongoDB Photo upload.
    await Preferences.set({
      key: "token",
      value: payload.token,
    });

    await Preferences.set({
      key: "firstTime",
      value: "true",
    });

    return payload;
  };

  const completeSignUp = async (event) => {
    event?.preventDefault();

    if (isSubmitting) return;

    if (!email.trim() || !username.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (username.trim().length < 4) {
      setError("Username must be at least 4 characters.");
      return;
    }

    if (!usernameUnique || checkingUsername) {
      setError("Please choose an available username.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid referral link.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the account and profile first.
      await handleUseReferral();

      // 2. Upload the picture after the new auth token is saved.
      if (file) {
        try {
          await dispatch(
            uploadProfilePicture({ file })
          ).unwrap();
        } catch (photoError) {
          console.error("Profile picture upload failed:", photoError);

          setError(
            "Your account was created, but your profile picture could not be uploaded. You can add it from your profile."
          );
        }
      }

      // 3. Continue into the newly created profile.
      router.push(Paths.myProfile);
    } catch (error) {
      console.error("Referral signup failed:", error);

      setError(
        error?.message ||
        "Unable to complete signup. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <IonContent
        fullscreen
        scrollY={true}
        className="bg-plumb-canvas text-plumb-ink dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink"
      >
        <div className="min-h-full px-4 py-12 sm:py-16">
          <div className="mx-auto w-[100%] max-w-lg">

            {/* Header */}
            <header className="mb-8 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-plumb-mint">
                Welcome to Plumbum
              </p>

              <h1 className="font-serif text-3xl font-semibold tracking-tight text-plumb-ink dark:text-plumb-dark-ink sm:text-4xl">
                Find your place.
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-plumb-muted dark:text-plumb-dark-muted">
                Create your account and start connecting through the things you make and share.
              </p>
            </header>

            <form onSubmit={completeSignUp} className="space-y-5">

              {/* Identity */}
              <FormSection
                title="Your identity"
                description="How people will find you."
              >
                <FormField
                  label="Email"
                  type="email"
                  value={email}
                  placeholder="you@example.com"
                  autoComplete="email"
                  onChange={(value) =>
                    setEmail(value.replace(/\s/g, ""))
                  }
                />

                <FormField
                  label="Username"
                  value={username}
                  placeholder="yourname"
                  autoComplete="username"
                  onChange={setUsername}
                />

                {username.length > 0 && username.length < 4 && (
                  <Hint error>
                    Username must be at least 4 characters.
                  </Hint>
                )}

                {username.length >= 4 && checkingUsername && (
                  <Hint>Checking username availability...</Hint>
                )}

                {username.length >= 4 &&
                  !checkingUsername &&
                  usernameUnique && (
                    <Hint>Username available</Hint>
                  )}

                {username.length >= 4 &&
                  !checkingUsername &&
                  !usernameUnique && (
                    <Hint error>
                      Username is unavailable. Try another.
                    </Hint>
                  )}
              </FormSection>

              {/* Security */}
              <FormSection
                title="Your account"
                description="Choose a password to keep your account secure."
              >
                <PasswordField
                  label="Password"
                  value={password}
                  onChange={setPassword}
                />

                {password.length > 0 && password.length < 6 && (
                  <Hint error>
                    Use at least 6 characters.
                  </Hint>
                )}

                <PasswordField
                  label="Confirm password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />

                {confirmPassword.length > 0 &&
                  password !== confirmPassword && (
                    <Hint error>Passwords do not match.</Hint>
                  )}

                {confirmPassword.length > 0 &&
                  password === confirmPassword &&
                  password.length >= 6 && (
                    <Hint>Passwords match</Hint>
                  )}
              </FormSection>

              {/* Profile */}
              <FormSection
                title="Your profile"
                description="A little introduction to you."
              >
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Profile preview"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = Enviroment.blankProfile;
                      }}
                      className="h-24 w-24 rounded-full border-2 border-plumb-border bg-plumb-paper object-cover shadow-sm dark:border-plumb-dark-border dark:bg-plumb-dark-surface"
                    />

                    {file && (
                      <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-plumb-surface bg-plumb-mint px-2 py-1 text-[10px] font-semibold text-white dark:border-plumb-dark-surface">
                        Selected
                      </span>
                    )}
                  </div>

                  <label className="w-full cursor-pointer">
                    <div className="rounded-2xl border border-dashed border-plumb-border bg-plumb-paper px-4 py-4 text-center transition hover:border-plumb-mint hover:bg-plumb-surface dark:border-plumb-dark-border dark:bg-plumb-dark-surface dark:hover:border-plumb-mint">
                      <p className="text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink">
                        {file ? "Choose a different photo" : "Add a profile photo"}
                      </p>

                      <p className="mt-1 text-xs text-plumb-muted dark:text-plumb-dark-muted">
                        JPEG, PNG, HEIC or HEIF · Maximum 5 MB
                      </p>
                    </div>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
                      className="sr-only"
                      onChange={handleProfilePicture}
                    />
                  </label>
                </div>

                <div className="pt-2">
                  <label className="mb-2 block text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink">
                    About you
                  </label>

                  <textarea
                    placeholder="What are you about?"
                    value={selfStatement}
                    onChange={(event) =>
                      setSelfStatement(event.target.value)
                    }
                    rows={4}
                    className="w-[100%] resize-none rounded-2xl border border-plumb-border bg-plumb-paper px-4 py-3 text-sm text-plumb-ink outline-none transition placeholder:text-plumb-subtle focus:border-plumb-mint focus:ring-2 focus:ring-plumb-focus dark:border-plumb-dark-border dark:bg-plumb-dark-surface dark:text-plumb-dark-ink dark:placeholder:text-plumb-dark-subtle"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl bg-plumb-paper p-4 dark:bg-plumb-dark-surface">
                  <div>
                    <p className="text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink">
                      Private account
                    </p>
                    <p className="mt-1 text-xs text-plumb-muted dark:text-plumb-dark-muted">
                      Your profile will be hidden from search.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(event) =>
                      setIsPrivate(event.target.checked)
                    }
                    className="toggle toggle-success"
                    aria-label="Private account"
                  />
                </div>
              </FormSection>

              {/* Email preferences */}
              <FormSection
                title="Email preferences"
                description="How often would you like to hear from us?"
              >
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Daily", value: 1 },
                    { label: "Weekly", value: 7 },
                    { label: "Monthly", value: 30 },
                    { label: "Unsubscribe", value: 0 },
                  ].map((option) => {
                    const active = frequency === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFrequency(option.value)}
                        aria-pressed={active}
                        className={[
                          "rounded-xl border px-4 py-3 text-sm font-medium transition",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus",
                          active
                            ? "border-plumb-mint bg-plumb-mint text-white"
                            : "border-plumb-border bg-plumb-paper text-plumb-ink hover:border-plumb-mint dark:border-plumb-dark-border dark:bg-plumb-dark-surface dark:text-plumb-dark-ink",
                        ].join(" ")}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </FormSection>

              {/* Submit */}
              <div className="space-y-3 pb-12 pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={[
                    "w-[100%] rounded-full px-6 py-4 text-sm font-semibold transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
                    canSubmit
                      ? "bg-plumb-mint text-white shadow-sm hover:opacity-90 active:scale-[0.99]"
                      : "cursor-not-allowed bg-plumb-border text-plumb-subtle dark:bg-plumb-dark-border dark:text-plumb-dark-subtle",
                  ].join(" ")}
                >
                  {isSubmitting
                    ? "Creating your account..."
                    : "Complete sign up"}
                </button>

                <p className="text-center text-xs text-plumb-muted dark:text-plumb-dark-muted">
                  You can update your profile and preferences anytime.
                </p>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </ErrorBoundary>
  );
}

function FormSection({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-plumb-border bg-plumb-surface p-5 shadow-sm dark:border-plumb-dark-border dark:bg-plumb-dark-surface sm:p-6">
      <div className="mb-5">
        <h2 className="font-serif text-lg font-semibold text-plumb-ink dark:text-plumb-dark-ink">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-plumb-muted dark:text-plumb-dark-muted">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="w-[100%] rounded-2xl border border-plumb-border bg-plumb-paper px-4 py-3 text-sm text-plumb-ink outline-none transition placeholder:text-plumb-subtle focus:border-plumb-mint focus:ring-2 focus:ring-plumb-focus dark:border-plumb-dark-border dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink dark:placeholder:text-plumb-dark-subtle"
      />
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          autoComplete={
            label === "Password" ? "new-password" : "new-password"
          }
          placeholder="At least 6 characters"
          onChange={(event) => onChange(event.target.value)}
          className="w-[100%] rounded-2xl border border-plumb-border bg-plumb-paper px-4 py-3 pr-16 text-sm text-plumb-ink outline-none transition placeholder:text-plumb-subtle focus:border-plumb-mint focus:ring-2 focus:ring-plumb-focus dark:border-plumb-dark-border dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink dark:placeholder:text-plumb-dark-subtle"
        />

        <button
          type="button"
          onClick={() => setShow((previous) => !previous)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-plumb-mint"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

function Hint({ children, error = false }) {
  return (
    <p
      className={[
        "text-xs",
        error
          ? "text-red-600 dark:text-red-400"
          : "text-plumb-mint",
      ].join(" ")}
      role={error ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
