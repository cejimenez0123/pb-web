
import React, { useContext, useEffect, useState } from "react";

import Context from "../../context";
import authRepo from "../../data/authRepo";
import { useDialog } from "../../domain/usecases/useDialog";

export default function ReferralForm({ onClose }) {
  const { setSuccess } = useContext(Context);
  const { closeDialog } = useDialog();

  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;

    const generateLink = async () => {
      try {
        const data = await authRepo.generateReferral();

        if (!active) return;

        if (!data?.referralLink) {
          throw new Error("Unable to generate your invitation.");
        }

        setReferralLink(data.referralLink);
      } catch (err) {
        if (active) {
          setError(err?.message || "Something went wrong.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    generateLink();

    return () => {
      active = false;
    };
  }, []);

  const handleClose = () => {
    onClose ? onClose() : closeDialog();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setSuccess("Your invitation link has been copied.");
    } catch {
      setError("Unable to copy your link.");
    }
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join Plumbum",
          text: "I'd love for you to join me on Plumbum. Find your people, share your work, and connect through creativity.",
          url: referralLink,
        });
      } else {
        await copyLink();
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        setError("Unable to share your invitation.");
      }
    }
  };

  const retry = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await authRepo.generateReferral();

      if (!data?.referralLink) {
        throw new Error("Unable to generate your invitation.");
      }

      setReferralLink(data.referralLink);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const sendInvite = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError("Please enter their name and email.");
      return;
    }

    setSending(true);
    setError("");

    try {
      await authRepo.referral({
        name: name.trim(),
        email: email.trim(),
      });

      setName("");
      setEmail("");
      setSuccess("Your invitation has been sent.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to send your invitation."
      );
    } finally {
      setSending(false);
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
      <div className="flex justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-plumb-mint">
            Grow the community
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Bring someone in.
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
            Know someone who would enjoy being part of Plumbum?
            Send them an invitation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="shrink-0 rounded-full p-2 hover:bg-plumb-surface dark:hover:bg-plumb-dark-surface"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="m18 6-12 12M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Email invitation */}
      <form onSubmit={sendInvite}>
        <div className="
          rounded-2xl p-4
          bg-plumb-surface dark:bg-plumb-dark-surface
          border border-plumb-borderStrong dark:border-plumb-darkBorderStrong
        ">
          <p className="text-sm font-semibold">
            Send a personal invitation
          </p>

          <p className="mt-2 text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted">
            Invite someone directly. We'll send them an email with a link to join.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="referral-name"
                className="block mb-2 text-sm font-medium"
              >
                Their name
              </label>

              <input
                id="referral-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter their name"
                autoComplete="name"
                required
                className="
                  w-[100%] rounded-xl px-4 py-3
                  bg-plumb-canvas dark:bg-plumb-dark-canvas
                  border border-plumb-borderStrong dark:border-plumb-darkBorderStrong
                  text-plumb-ink dark:text-plumb-darkText
                  placeholder:text-plumb-subtle
                  focus:outline-none focus:ring-2 focus:ring-plumb-mint
                "
              />
            </div>

            <div>
              <label
                htmlFor="referral-email"
                className="block mb-2 text-sm font-medium"
              >
                Their email
              </label>

              <input
                id="referral-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="
                  w-[100%] rounded-xl px-4 py-3
                  bg-plumb-canvas dark:bg-plumb-dark-canvas
                  border border-plumb-borderStrong dark:border-plumb-darkBorderStrong
                  text-plumb-ink dark:text-plumb-darkText
                  placeholder:text-plumb-subtle
                  focus:outline-none focus:ring-2 focus:ring-plumb-mint
                "
              />
            </div>

            <button
              type="submit"
              disabled={sending || !name.trim() || !email.trim()}
              className="
                min-h-12 w-[100%] rounded-full px-5 py-3
                bg-plumb-mint text-white
                text-sm font-semibold
                hover:bg-plumb-mintHover
                disabled:opacity-40
                transition-colors
              "
            >
              {sending ? "Sending invitation..." : "Send invitation"}
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-plumb-borderStrong dark:bg-plumb-darkBorderStrong" />
        <span className="text-xs text-plumb-subtle dark:text-plumb-darkSubtle">
          OR SHARE YOUR LINK
        </span>
        <div className="h-px flex-1 bg-plumb-borderStrong dark:bg-plumb-darkBorderStrong" />
      </div>

      {/* Referral link */}
      <div>
        <label className="block mb-2 text-sm font-medium">
          Your referral link
        </label>

        {loading ? (
          <p className="text-sm text-plumb-muted dark:text-plumb-darkMuted">
            Preparing your invitation...
          </p>
        ) : !referralLink ? (
          <div>
            <p className="text-sm text-plumb-muted dark:text-plumb-darkMuted">
              Unable to prepare your referral link.
            </p>

            <button
              type="button"
              onClick={retry}
              className="mt-3 text-sm font-semibold text-plumb-mint"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="
            flex items-center gap-2 rounded-xl p-2
            bg-plumb-surface dark:bg-plumb-dark-surface
            border border-plumb-borderStrong dark:border-plumb-darkBorderStrong
          ">
            <input
              value={referralLink}
              readOnly
              aria-label="Referral link"
              onFocus={(e) => e.target.select()}
              className="
                min-w-0 flex-1 bg-transparent px-2
                text-sm outline-none
                text-plumb-ink dark:text-plumb-darkText
              "
            />

            <button
              type="button"
              onClick={copyLink}
              aria-label="Copy referral link"
              className="
                rounded-lg p-3
                bg-plumb-mint/10 text-plumb-mint
                hover:bg-plumb-mint/20
              "
            >
              Copy
            </button>
          </div>
        )}
      </div>

      {/* Share actions */}
      <div className="mt-4 flex flex-col gap-3">
        <button
          type="button"
          onClick={shareLink}
          disabled={!referralLink || loading}
          className="
            min-h-12 w-[100%] rounded-full px-5 py-3
            bg-plumb-mint text-white
            text-sm font-semibold
            hover:bg-plumb-mintHover
            disabled:opacity-40
            transition-colors
          "
        >
          Share invitation
        </button>

        <button
          type="button"
          onClick={copyLink}
          disabled={!referralLink || loading}
          className="
            min-h-11 rounded-full px-5 py-2
            text-sm font-medium
            text-plumb-ink dark:text-plumb-darkText
            hover:bg-plumb-surface dark:hover:bg-plumb-dark-surface
            disabled:opacity-40
          "
        >
          Copy link instead
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-plumb-subtle dark:text-plumb-darkSubtle">
        Good connections grow when they're shared.
      </p>
    </div>
  );
}
