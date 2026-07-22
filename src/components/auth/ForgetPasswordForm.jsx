
import { useState } from "react"
import authRepo from "../../data/authRepo"
import { useAlert } from "../../core/useAlert"


const ForgotPasswordForm = ({ close }) => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { showAlert } = useAlert

  const handleClick = () => {
    if (loading) return
    setLoading(true)
    authRepo.forgotPassword({ email: email.trim() })
      .then(data => {
        showAlert({ message: data.message, type: "success" })
        close?.()
      })
      .catch(err => {
        showAlert({ message: err.message || "Something went wrong", type: "error" })
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="p-8 lg:min-w-[30em]">
      <h2 className="text-emerald-700 text-lg font-semibold mb-6">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border-2 border-emerald-400 rounded-full px-4 py-2 text-emerald-800 bg-transparent outline-none mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-emerald-600 disabled:bg-emerald-400 text-white rounded-full py-3 transition-colors"
      >
        {loading ? "Sending..." : "Send Reset Email"}
      </button>
    </div>
  )
}

export default ForgotPasswordForm