
import { useState } from "react";
import authRepo from "../../data/authRepo";
import Paths from "../../core/paths";
import { IonContent, useIonRouter } from "@ionic/react";

function ResetPasswordContainer() {
  const router = useIonRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const query = new URLSearchParams(router.routeInfo.search);
  const token = query.get("token");

  const mismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const isPasswordValid = password.length >= 7;
  const canSubmit =
    !!token &&
    isPasswordValid &&
    password === confirmPassword &&
    !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 7 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords don't match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const data = await authRepo.resetPassword({
        password,
        token,
      });

      if (data?.error) {
        throw new Error(
          data.error.message || "Unable to reset your password."
        );
      }

      router.push(Paths.login);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please request a new password reset link."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonContent fullscreen className="ion-padding">
      <div className="flex min-h-full items-center justify-center bg-plumb-canvas px-3 py-12 text-plumb-ink dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-plumb-border bg-plumb-paper p-6 shadow-sm sm:p-9 dark:border-plumb-dark-border dark:bg-plumb-dark-surface">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-plumb-mint/10 text-plumb-mint">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <path d="M12 15v3" />
                </svg>
              </div>

              <p className="mb-2 text-sm font-medium tracking-wide text-plumb-mint">
                ACCOUNT RECOVERY
              </p>

              <h1 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-plumb-ink dark:text-plumb-dark-ink">
                Create a new password.
              </h1>

              <p className="text-sm leading-relaxed text-plumb-muted dark:text-plumb-dark-muted">
                You're almost back in. Choose a new password for your
                Plumbum account.
              </p>
            </div>

            {/* Missing token */}
            {!token ? (
              <div className="space-y-5">
                <div
                  role="alert"
                  className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-plumb-ink dark:text-plumb-dark-ink"
                >
                  This password reset link is missing or invalid. Please
                  request a new one.
                </div>

                <button
                  type="button"
                  onClick={() => router.push(Paths.login)}
                  className="w-full rounded-full bg-plumb-mint px-6 py-3.5 font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2"
                >
                  Return to login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-relaxed text-red-700 dark:text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* New password */}
                <div className="space-y-2">
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink"
                  >
                    New password
                  </label>

                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your new password"
                    required
                    minLength={7}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-plumb-border bg-plumb-surface px-4 py-3.5 text-base text-plumb-ink outline-none transition placeholder:text-plumb-subtle focus:border-plumb-mint focus:ring-2 focus:ring-plumb-focus/30 disabled:opacity-60 dark:border-plumb-dark-border dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink dark:placeholder:text-plumb-dark-subtle"
                  />

                  <p className="text-xs text-plumb-subtle dark:text-plumb-dark-subtle">
                    Use at least 7 characters.
                  </p>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-plumb-ink dark:text-plumb-dark-ink"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password again"
                    required
                    minLength={7}
                    disabled={isSubmitting}
                    aria-invalid={!!mismatch}
                    className="w-full rounded-xl border border-plumb-border bg-plumb-surface px-4 py-3.5 text-base text-plumb-ink outline-none transition placeholder:text-plumb-subtle focus:border-plumb-mint focus:ring-2 focus:ring-plumb-focus/30 disabled:opacity-60 dark:border-plumb-dark-border dark:bg-plumb-dark-canvas dark:text-plumb-dark-ink dark:placeholder:text-plumb-dark-subtle"
                  />

                  {mismatch && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Your passwords don't match.
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-plumb-mint px-6 py-3.5 font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating password...
                    </span>
                  ) : (
                    "Update password"
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 border-t border-plumb-border pt-5 dark:border-plumb-dark-border">
              <p className="text-center text-xs leading-relaxed text-plumb-subtle dark:text-plumb-dark-subtle">
                Need help? Contact{" "}
                <a
                  href="mailto:plumbumapp@gmail.com"
                  className="font-medium text-plumb-mint underline-offset-4 hover:underline"
                >
                  Plumbum support
                </a>
                .
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-plumb-subtle dark:text-plumb-dark-subtle">
            Find a room. Meet people. Keep the connection going.
          </p>
        </div>
      </div>
    </IonContent>
  );
}

export default ResetPasswordContainer;
