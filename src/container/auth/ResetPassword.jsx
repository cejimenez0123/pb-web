

import { useState } from "react";
import authRepo from "../../data/authRepo";
import Paths from "../../core/paths";
import { IonContent, useIonRouter } from "@ionic/react";

function ResetPasswordContainer() {
  const router = useIonRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const query = new URLSearchParams(router.routeInfo.search);

  const handleSubmit = () => {
    if (password !== confirmPassword) return;

    if (password.length <= 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const token = query.get("token");
    authRepo.resetPassword({ password, token }).then((data) => {
      if (data.profile) {
        router.push(Paths.login);
      } else if (data.error) {
        setError(data.error.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    });
  };

  const mismatch = confirmPassword && password !== confirmPassword;

  return (
    <IonContent fullscreen className="ion-padding">
      {error && (
        <div className="fixed top-4 left-4 right-4 md:left-[20%] md:right-[20%] z-50">
          <div role="alert" className="alert alert-warning animate-fade-out">
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-full py-16 px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl lora-medium text-emerald-800 mb-8">
            Reset password
          </h1>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2 border-2 border-emerald-700 rounded-full px-4 py-1">
              <span className="text-sm text-emerald-800 whitespace-nowrap">
                New password
              </span>
              <input
                type="password"
                className="input bg-transparent flex-1 min-w-0"
                value={password}
                onChange={(e) => setPassword(e.target.value.trim())}
                placeholder="••••••••"
              />
            </label>

            <label className="flex items-center gap-2 border-2 border-emerald-700 rounded-full px-4 py-1">
              <span className="text-sm text-emerald-800 whitespace-nowrap">
                Confirm
              </span>
              <input
                type="password"
                className="input bg-transparent flex-1 min-w-0"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.trim())}
                placeholder="••••••••"
              />
            </label>

            {mismatch && (
              <p className="text-orange-500 open-sans-medium text-sm px-2">
                Passwords don't match.
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={!!mismatch || !password}
              className="mt-4 bg-emerald-800 text-white rounded-full py-3 px-6 open-sans-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset password
            </button>
          </div>
        </div>
      </div>
    </IonContent>
  );
}

export default ResetPasswordContainer;