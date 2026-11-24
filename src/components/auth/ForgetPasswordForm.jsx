
// import { useState } from "react"
// import authRepo from "../../data/authRepo"
// import { useAlert } from "../../core/useAlert"


// const ForgotPasswordForm = ({ close }) => {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const { showAlert } = useAlert

//   const handleClick = () => {
//     if (loading) return
//     setLoading(true)
//     authRepo.forgotPassword({ email: email.trim() })
//       .then(data => {
//         showAlert({ message: data.message, type: "success" })
//         close?.()
//       })
//       .catch(err => {
//         showAlert({ message: err.message || "Something went wrong", type: "error" })
//       })
//       .finally(() => setLoading(false))
//   }

//   return (
//     <div className="p-8 lg:min-w-[30em]">
//       <h2 className="text-emerald-700 text-lg font-semibold mb-6">Reset Password</h2>
//       <input
//         type="email"
//         placeholder="Enter your email"
//         className="w-full border-2 border-emerald-400 rounded-full px-4 py-2 text-emerald-800 bg-transparent outline-none mb-4"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <button
//         onClick={handleClick}
//         disabled={loading}
//         className="w-full bg-emerald-600 disabled:bg-emerald-400 text-white rounded-full py-3 transition-colors"
//       >
//         {loading ? "Sending..." : "Send Reset Email"}
//       </button>
//     </div>
//   )
// }

// export default ForgotPasswordForm


import { useState } from "react";
import authRepo from "../../data/authRepo";
import { useAlert } from "../../core/useAlert";

const ForgotPasswordForm = ({ close }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleClick = async (e) => {
    e.preventDefault();

    if (loading || !email.trim()) return;

    setLoading(true);

    try {
      const data = await authRepo.forgotPassword({
        email: email.trim(),
      });

      showAlert({
        message: data.message,
        type: "success",
      });

      close?.();
    } catch (err) {
      showAlert({
        message: err?.response?.data?.message || err.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        w-[100%] md:min-w-[28em]
        rounded-3xl p-5 sm:p-7
        text-plumb-ink dark:text-plumb-darkText
      "
    >
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-plumb-mint">
          Account access
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Reset your password.
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
          It happens. Enter the email associated with your account
          and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleClick}>
        <div className="mb-5">
          <label
            htmlFor="forgot-password-email"
            className="block mb-2 text-sm font-medium"
          >
            Email address
          </label>

          <input
            id="forgot-password-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-[100%] rounded-xl px-4 py-3
              bg-plumb-surface dark:bg-plumb-dark-surface
              border border-plumb-borderStrong dark:border-plumb-darkBorderStrong
              text-plumb-ink dark:text-plumb-darkText
              placeholder:text-plumb-subtle
              outline-none
              focus:ring-2 focus:ring-plumb-mint
              focus:border-plumb-mint
              transition-colors
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="
            min-h-12 w-[100%] rounded-full px-5 py-3
            bg-plumb-mint text-white
            text-sm font-semibold
            hover:bg-plumb-mintHover
            disabled:opacity-40
            transition-colors
          "
        >
          {loading ? "Sending reset link..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-plumb-subtle dark:text-plumb-darkSubtle">
        Remembered your password? You can close this window and sign in.
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
