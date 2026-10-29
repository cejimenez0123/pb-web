import { Preferences } from "@capacitor/preferences";
import { IonContent } from "@ionic/react";
import "../App.css";
import { useState, useEffect, useRef } from "react";
import authRepo from "../data/authRepo";
import ThankYou from "./auth/ThankYou";
import logo from "../images/logo/icon.png";
import { useSelector } from "react-redux";
import { useIonRouter } from "@ionic/react";
import Paths from "../core/paths";
import styles from "../styles/style";

/* =========================================================
   ONBOARDING STYLES
   Reuse the shared Plumbum design system.
   Presentation only — no business logic changes.
   ========================================================= */

const onboardingStyles = {
  page: "flex min-h-full flex-col px-5 pt-5 pb-10 sm:px-6",

  heading: [
    styles.text.display,
    "text-[1.8rem] sm:text-3xl",
    "leading-tight",
  ].join(" "),

  eyebrow: [
    "mb-2 font-open-sans text-xs font-semibold",
    "uppercase tracking-[0.18em]",
    styles.text.muted,
  ].join(" "),

  helper: [
    "mt-2 font-open-sans text-sm leading-relaxed",
    styles.text.muted,
  ].join(" "),

  question: [
    "block font-open-sans text-[0.95rem] font-semibold leading-snug",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  field: [
    styles.input,
    "block !w-[100%] max-w-none ",
    "min-h-12 px-4 py-3.5",
    "text-base leading-relaxed",
    "border-plumb-borderStrong dark:border-plumb-darkBorderStrong",
    "bg-plumb-paper text-plumb-ink",
    "placeholder:text-plumb-muted",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
    "dark:placeholder:text-plumb-darkMuted",
    "focus-visible:ring-2 focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-paper",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),

  textarea: [
    "rounded-2xl",
    "resize-y",
    "min-h-28",
  ].join(" "),

  sectionCard: [
    "rounded-2xl border p-5",
    "border-plumb-borderStrong bg-plumb-paper",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
  ].join(" "),

  option: [
    "inline-flex min-h-11 max-w-full items-center gap-2",
    "rounded-full border px-3.5 py-2.5",
    "text-left text-sm font-medium leading-snug",
    "transition-colors duration-150",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-plumb-text dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
    "hover:border-plumb-mintHover hover:bg-plumb-surface",
    "dark:hover:border-plumb-mintLight dark:hover:bg-plumb-dark-canvas",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-paper",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none",
  ].join(" "),

  optionSelected: [
    "border-plumb-ink bg-plumb-surface font-semibold",
    "text-plumb-ink ring-1 ring-plumb-ink",
    "dark:border-plumb-mintLight dark:bg-plumb-dark-canvas",
    "dark:text-plumb-darkText dark:ring-plumb-mintLight",
  ].join(" "),

  singleOption: [
    "flex w-full min-h-12 items-center justify-between gap-3",
    "rounded-2xl border px-4 py-3",
    "text-left text-sm font-medium",
    "transition-colors duration-150",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-plumb-text dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
    "hover:border-plumb-mintHover hover:bg-plumb-surface",
    "dark:hover:border-plumb-mintLight",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-paper",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
    "motion-reduce:transition-none",
  ].join(" "),

  singleOptionSelected: [
    "border-plumb-ink bg-plumb-surface font-semibold",
    "text-plumb-ink ring-1 ring-plumb-ink",
    "dark:border-plumb-mintLight dark:bg-plumb-dark-canvas",
    "dark:text-plumb-darkText dark:ring-plumb-mintLight",
  ].join(" "),

  selectedIndicator: [
    "flex h-5 w-5 shrink-0 items-center justify-center",
    "rounded-full border-2 text-xs font-bold",
    "border-current",
  ].join(" "),

  unselectedIndicator: [
    "h-5 w-5 shrink-0 rounded-full border-2",
    "border-current opacity-60",
  ].join(" "),

  error: [
    "mt-5 rounded-2xl border px-4 py-3",
    "border-red-700 bg-red-50 text-red-900",
    "dark:border-red-300 dark:bg-red-950 dark:text-red-100",
    "text-sm leading-relaxed",
  ].join(" "),

  progressTrack: [
    "h-2 overflow-hidden rounded-full",
    "border border-plumb-borderStrong bg-plumb-paper",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
  ].join(" "),

  progressFill: [
    "h-full rounded-full",
    "bg-plumb-mintHover dark:bg-plumb-mintLight",
    "transition-[width] duration-300 ease-out",
    "motion-reduce:transition-none",
  ].join(" "),

  primaryButton: [
    styles.button.base,
    styles.button.primary,
    styles.button.large,
    "min-h-12 w-full px-5",
  ].join(" "),

  secondaryButton: [
    styles.button.base,
    styles.button.cancel,
    styles.button.large,
    "min-h-12 w-full px-5",
  ].join(" "),

  linkButton: [
    "min-h-11 rounded-full px-3 py-2",
    "font-open-sans text-sm font-semibold underline",
    "underline-offset-4",
    "text-plumb-ink hover:text-plumb-mintHover",
    "dark:text-plumb-darkText dark:hover:text-plumb-mintLight",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),
};

/* =========================================================
   OPTIONS
   ========================================================= */

const WRITING_BARRIERS = [
  "Time",
  "Energy",
  "Motivation",
  "Finding a place to write",
  "Knowing what to write",
  "Finishing what I start",
  "Getting feedback",
  "Finding people to write with",
  "Confidence",
  "Other",
  "Nothing in particular",
];

const SHARING_REASONS = [
  "I want feedback",
  "I want to start a conversation",
  "I want to connect with other people",
  "I want accountability",
  "I'm proud of the work",
  "I want to know whether it's ready",
  "I want to hear how someone else experiences it",
  "I want to publish or promote it",
  "Someone invited or encouraged me to share",
  "I feel comfortable sharing it",
  "There's an opportunity to share",
  "It depends on what I need",
  "Other",
  "I don't usually share my writing",
];

const SHARING_WAYS = [
  "One person I trust",
  "A small group",
  "A workshop or writing group",
  "An event, reading, or open mic",
  "An online community",
  "Social media",
  "Publicly / through publication",
  "Other",
  "I don't usually share my writing",
];

const SHARING_OUTCOMES = [
  "Someone responded",
  "I received useful feedback",
  "It led to a conversation",
  "I felt exposed or vulnerable",
  "Nothing really happened",
  "I wanted more interaction",
  "I realized I wanted to keep the work private",
  "Sharing led me somewhere else",
  "Other",
];

const COMMUNITY_OPTIONS = [
  "I like being around people often",
  "I like participating sometimes, but need plenty of space",
  "I prefer smaller or quieter interactions",
  "I mostly want to create on my own, but still want access to community",
  "I like being part of things without always participating",
  "It depends on what I need that day",
  "I'm not sure yet",
];

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function StepTransition({ step, children }) {
  return (
    <div
      key={step}
      className="motion-safe:animate-[fadeSlide_0.32s_ease-out]"
    >
      {children}

      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-safe\\:animate-\\[fadeSlide_0\\.32s_ease-out\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function Progress({ step }) {
  const total = 4;
  const percentage = Math.round((step / total) * 100);

  return (
    <div className="px-5 pt-4 pb-2 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span
          className={[
            "text-xs font-semibold uppercase tracking-wide",
            "text-plumb-ink dark:text-plumb-darkText",
          ].join(" ")}
        >
          Step {String(step).padStart(2, "0")} of{" "}
          {String(total).padStart(2, "0")}
        </span>

        <span className={styles.text.metadata}>
          {percentage}% complete
        </span>
      </div>

      <div
        className={onboardingStyles.progressTrack}
        role="progressbar"
        aria-label="Application progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={`Step ${step} of ${total}`}
      >
        <div
          className={onboardingStyles.progressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function OptionChips({
  options,
  selected = [],
  onToggle,
  disabled = false,
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(option)}
            aria-pressed={active}
            className={[
              onboardingStyles.option,
              active ? onboardingStyles.optionSelected : "",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className={
                active
                  ? onboardingStyles.selectedIndicator
                  : onboardingStyles.unselectedIndicator
              }
            >
              {active ? "✓" : ""}
            </span>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}

function Question({ label, helper, children, id }) {
  return (
    <div className="w-full">
      <label
        className={onboardingStyles.question}
        htmlFor={id}
      >
        {label}
      </label>

      {helper && (
        <p className={onboardingStyles.helper}>
          {helper}
        </p>
      )}

      <div className="mt-2">{children}</div>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  loading = false,
}) {
  return (
    <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
      {onBack && (
        <button
          type="button"
          className={onboardingStyles.secondaryButton}
          onClick={onBack}
          disabled={loading}
        >
          Back
        </button>
      )}

      <button
        type="button"
        className={onboardingStyles.primaryButton}
        onClick={onNext}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Submitting..." : nextLabel}
      </button>
    </div>
  );
}

function OtherInput({ selected, value, onChange, placeholder }) {
  if (!selected.includes("Other")) return null;

  return (
    <div className="mt-3">
      <input
        className={onboardingStyles.field}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Tell us more..."}
        autoFocus
      />
    </div>
  );
}

/* =========================================================
   INTRO
   ========================================================= */

function Why({ setActiveTab, onLogin }) {
  return (
    <StepTransition step="intro">
      <div className="mx-auto max-w-xl px-5 pt-12 pb-10 sm:pt-16">
        <div className="mb-8 flex justify-center">
          <img
            src={logo}
            className="h-24 w-24 rounded-[2rem]"
            alt="Plumbum"
          />
        </div>

        <div className="text-center">
          <p className={[onboardingStyles.eyebrow, "mb-3"].join(" ")}>
            Welcome to Plumbum
          </p>

          <h1 className="font-serif text-[2.4rem] font-bold leading-[1.05] tracking-tight text-plumb-ink dark:text-plumb-darkText">
            Make space for your writing.
          </h1>

          <p className="mx-auto mt-5 max-w-lg font-open-sans text-base leading-relaxed text-plumb-text dark:text-plumb-darkText">
            Plumbum is a community for writers to write, share, get feedback,
            and find their people — without having to be everywhere all the
            time.
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          <div className={onboardingStyles.sectionCard}>
            <div className="mb-2 text-2xl" aria-hidden="true">
              ✍🏽
            </div>
            <h2 className="font-serif text-lg font-semibold text-plumb-ink dark:text-plumb-darkText">
              Write without proving you're a writer.
            </h2>
            <p className="mt-1.5 font-open-sans text-sm leading-relaxed text-plumb-text dark:text-plumb-darkText">
              Bring the thing you're working on, the thing you keep putting
              off, or the thing you haven't started yet.
            </p>
          </div>

          <div className={onboardingStyles.sectionCard}>
            <div className="mb-2 text-2xl" aria-hidden="true">
              🌱
            </div>
            <h2 className="font-serif text-lg font-semibold text-plumb-ink dark:text-plumb-darkText">
              Share when it makes sense.
            </h2>
            <p className="mt-1.5 font-open-sans text-sm leading-relaxed text-plumb-text dark:text-plumb-darkText">
              Community doesn't have to mean constant participation. Find
              people, feedback, and creative momentum at your own pace.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button
            className={onboardingStyles.primaryButton}
            type="button"
            onClick={() => setActiveTab("tab1")}
          >
            Join Plumbum
          </button>

          <button
            type="button"
            className={onboardingStyles.linkButton}
            onClick={onLogin}
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 1 — ABOUT YOU
   ========================================================= */

function Step1({
  formData,
  updateFormData,
  setActiveTab,
  error,
  setError,
}) {
  const [local, setLocal] = useState(formData);

  const next = () => {
    if (!local.fullName?.trim()) {
      setError("Tell us what name you'd like us to use.");
      return;
    }

    if (!local.email?.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(local.email.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    updateFormData(local);
    setActiveTab("tab2");
  };

  return (
    <StepTransition step="tab1">
      <div className={onboardingStyles.page}>
        <div className="mb-7">
          <p className={onboardingStyles.eyebrow}>About you</p>
          <h1 className={onboardingStyles.heading}>
            Let's start with the basics.
          </h1>
          <p className={onboardingStyles.helper}>
            Nothing to prove here.
          </p>
        </div>

        <div className="space-y-5">
          <Question label="What name do you want us to use?" id="fullName">
            <input
              id="fullName"
              className={onboardingStyles.field}
              type="text"
              value={local.fullName || ""}
              onChange={(e) =>
                setLocal({ ...local, fullName: e.target.value })
              }
              placeholder="Your name"
              autoComplete="name"
            />
          </Question>

          <Question label="What's your email?" id="email">
            <input
              id="email"
              className={onboardingStyles.field}
              type="email"
              value={local.email || ""}
              onChange={(e) =>
                setLocal({ ...local, email: e.target.value })
              }
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Question>

          <Question label="Instagram" helper="Optional" id="igHandle">
            <input
              id="igHandle"
              className={onboardingStyles.field}
              type="text"
              value={local.igHandle || ""}
              onChange={(e) =>
                setLocal({ ...local, igHandle: e.target.value })
              }
              placeholder="@handle"
              autoComplete="off"
            />
          </Question>
        </div>

        {error && (
          <div className={onboardingStyles.error} role="alert">
            {error}
          </div>
        )}

        <NavButtons
          onBack={() => setActiveTab("tab0")}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 2 — YOUR WRITING
   ========================================================= */

function Step2({ formData, updateFormData, setActiveTab }) {
  const [local, setLocal] = useState({
    writingNow: formData.writingNow || "",
    writingBarriers: formData.writingBarriers || [],
    writingBarriersOther: formData.writingBarriersOther || "",
  });

  const toggleBarrier = (option) => {
    setLocal((prev) => {
      const current = prev.writingBarriers || [];

      return {
        ...prev,
        writingBarriers: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const next = () => {
    updateFormData(local);
    setActiveTab("tab3");
  };

  return (
    <StepTransition step="tab2">
      <div className={onboardingStyles.page}>
        <div className="mb-7">
          <p className={onboardingStyles.eyebrow}>Your writing</p>
          <h1 className={onboardingStyles.heading}>
            What's on the page?
          </h1>
          <p className={onboardingStyles.helper}>
            Wherever you are with it is fine.
          </p>
        </div>

        <div className="space-y-7">
          <Question label="What are you writing these days?" id="writingNow">
            <textarea
              id="writingNow"
              className={[onboardingStyles.field, onboardingStyles.textarea].join(" ")}
              rows={4}
              value={local.writingNow}
              onChange={(e) =>
                setLocal({ ...local, writingNow: e.target.value })
              }
              placeholder="A novel, poems, essays, a screenplay, something you haven't named yet..."
            />
          </Question>

          <Question label="What's been getting in the way of writing lately?">
            <OptionChips
              options={WRITING_BARRIERS}
              selected={local.writingBarriers}
              onToggle={toggleBarrier}
            />

            <OtherInput
              selected={local.writingBarriers}
              value={local.writingBarriersOther}
              onChange={(value) =>
                setLocal({ ...local, writingBarriersOther: value })
              }
              placeholder="What else has been getting in the way?"
            />
          </Question>
        </div>

        <NavButtons
          onBack={() => {
            updateFormData(local);
            setActiveTab("tab1");
          }}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 3 — SHARING & COMMUNITY
   ========================================================= */

function Step3({ formData, updateFormData, setActiveTab }) {
  const [local, setLocal] = useState({
    sharingReasons: formData.sharingReasons || [],
    sharingReasonsOther: formData.sharingReasonsOther || "",
    sharingWays: formData.sharingWays || [],
    sharingWaysOther: formData.sharingWaysOther || "",
    sharingOutcomes: formData.sharingOutcomes || [],
    sharingOutcomesOther: formData.sharingOutcomesOther || "",
    sharingStory: formData.sharingStory || "",
  });

  const toggle = (field, option) => {
    setLocal((prev) => {
      const current = prev[field] || [];

      return {
        ...prev,
        [field]: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  };

  const next = () => {
    updateFormData(local);
    setActiveTab("tab4");
  };

  return (
    <StepTransition step="tab3">
      <div className={onboardingStyles.page}>
        <div className="mb-7">
          <p className={onboardingStyles.eyebrow}>
            Sharing & community
          </p>
          <h1 className={onboardingStyles.heading}>
            Share on your terms.
          </h1>
          <p className={onboardingStyles.helper}>
            There's no right amount of participation.
          </p>
        </div>

        <div className="space-y-8">
          <Question
            label="What makes you decide to share something you've written?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_REASONS}
              selected={local.sharingReasons}
              onToggle={(option) => toggle("sharingReasons", option)}
            />

            <OtherInput
              selected={local.sharingReasons}
              value={local.sharingReasonsOther}
              onChange={(value) =>
                setLocal({ ...local, sharingReasonsOther: value })
              }
              placeholder="What else makes you want to share?"
            />
          </Question>

          <Question
            label="How do you like to share your writing and participate in creative community?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_WAYS}
              selected={local.sharingWays}
              onToggle={(option) => toggle("sharingWays", option)}
            />

            <OtherInput
              selected={local.sharingWays}
              value={local.sharingWaysOther}
              onChange={(value) =>
                setLocal({ ...local, sharingWaysOther: value })
              }
              placeholder="How else do you like to participate?"
            />
          </Question>

          <Question
            label="What happened after you shared it?"
            helper="Select all that apply."
          >
            <OptionChips
              options={SHARING_OUTCOMES}
              selected={local.sharingOutcomes}
              onToggle={(option) => toggle("sharingOutcomes", option)}
            />

            <OtherInput
              selected={local.sharingOutcomes}
              value={local.sharingOutcomesOther}
              onChange={(value) =>
                setLocal({ ...local, sharingOutcomesOther: value })
              }
              placeholder="What else happened?"
            />
          </Question>

          <Question
            label="Tell us about a time you shared something you wrote. What made you decide to share it, and what happened afterward?"
            id="sharingStory"
          >
            <textarea
              id="sharingStory"
              className={[onboardingStyles.field, onboardingStyles.textarea].join(" ")}
              rows={5}
              value={local.sharingStory}
              onChange={(e) =>
                setLocal({ ...local, sharingStory: e.target.value })
              }
              placeholder="Whatever comes to mind..."
            />
          </Question>
        </div>

        <NavButtons
          onBack={() => {
            updateFormData(local);
            setActiveTab("tab2");
          }}
          onNext={next}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   STEP 4 — PLUMBUM
   ========================================================= */

function Step4({
  formData,
  onClickApply,
  setActiveTab,
  loading,
  error,
}) {
  const [local, setLocal] = useState({
    plumbumHope: formData.plumbumHope || "",
    howFindOut: formData.howFindOut || "",
  });

  const submit = () => {
    onClickApply({
      ...formData,
      ...local,
    });
  };

  return (
    <StepTransition step="tab4">
      <div className={onboardingStyles.page}>
        <div className="mb-7">
          <p className={onboardingStyles.eyebrow}>Plumbum</p>
          <h1 className={onboardingStyles.heading}>
            What are you looking for?
          </h1>
          <p className={onboardingStyles.helper}>
            Tell us what would make this community useful to you.
          </p>
        </div>

        <div className="space-y-6">
          <Question
            label="What are you hoping to find in Plumbum?"
            id="plumbumHope"
          >
            <textarea
              id="plumbumHope"
              className={[onboardingStyles.field, onboardingStyles.textarea].join(" ")}
              rows={5}
              value={local.plumbumHope}
              onChange={(e) =>
                setLocal({ ...local, plumbumHope: e.target.value })
              }
              placeholder="People, feedback, a reason to keep writing, somewhere to share..."
            />
          </Question>

          <Question label="How did you find Plumbum?">
            <div className="mt-1 space-y-2">
              {[
                "A friend",
                "Instagram",
                "A Plumbum event",
                "Another writing/creative event",
                "A workshop",
                "Online",
                "Someone told me about it",
                "Other",
              ].map((option) => {
                const active = local.howFindOut === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setLocal({ ...local, howFindOut: option })
                    }
                    aria-pressed={active}
                    className={[
                      onboardingStyles.singleOption,
                      active
                        ? onboardingStyles.singleOptionSelected
                        : "",
                    ].join(" ")}
                  >
                    <span>{option}</span>
                    <span
                      aria-hidden="true"
                      className={
                        active
                          ? onboardingStyles.selectedIndicator
                          : onboardingStyles.unselectedIndicator
                      }
                    >
                      {active ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </Question>
        </div>

        {error && (
          <div className={onboardingStyles.error} role="alert">
            {error}
          </div>
        )}

        <NavButtons
          onBack={() => setActiveTab("tab3")}
          onNext={submit}
          nextLabel="Apply to Plumbum"
          loading={loading}
        />
      </div>
    </StepTransition>
  );
}

/* =========================================================
   MAIN
   ========================================================= */

export default function OnboardingContainer() {
  const router = useIonRouter();

  const currentProfile = useSelector(
    (s) => s.users.currentProfile
  );

  const contentRef = useRef(null);

  const [activeTab, setActiveTab] = useState("tab0");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    igHandle: "",

    writingNow: "",
    writingBarriers: [],
    writingBarriersOther: "",

    sharingReasons: [],
    sharingReasonsOther: "",

    sharingWays: [],
    sharingWaysOther: "",

    sharingOutcomes: [],
    sharingOutcomesOther: "",

    sharingStory: "",

    plumbumHope: "",
    howFindOut: "",

    /* Legacy fields */
    whyApply: "",
    communityNeeds: "",
    writingOutcome: "",
    events: [],
    selectedEvents: [],
    otherEvent: "",
    eventPain: "",
  });

  useEffect(() => {
    if (currentProfile?.id) {
      router.push(Paths.home, "root");
    }
  }, [currentProfile, router]);

  useEffect(() => {
    contentRef.current?.scrollToTop(0);
  }, [activeTab]);

  const updateFormData = (data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const onClickApply = async (overrideForm = formData) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...overrideForm,

        whyApply:
          overrideForm.writingNow ||
          overrideForm.whyApply ||
          "",

        communityNeeds:
          overrideForm.plumbumHope ||
          overrideForm.communityNeeds ||
          "",

        writingOutcome:
          Array.isArray(overrideForm.sharingOutcomes)
            ? overrideForm.sharingOutcomes.join(", ")
            : overrideForm.writingOutcome || "",

        selectedEvents: overrideForm.selectedEvents || [],
        events: overrideForm.events || [],
      };

      const data = await authRepo.apply({
        ...payload,
        email: payload.email?.trim().toLowerCase(),
      });

      await Preferences.set({
        key: "hasSeenOnboarding",
        value: "true",
      });

      setUser(data?.user ?? data);
    } catch (err) {
      console.error("APPLICATION SUBMISSION ERROR:", err);

      if (
        err?.status === 409 ||
        err?.code === "APPLICATION_ALREADY_EXISTS"
      ) {
        setError(
          "We already have an application from this email."
        );
        return;
      }

      if (err?.message) {
        setError(err.message);
        return;
      }

      setError(
        "We couldn't submit your application right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <IonContent
        className="page-content"
        style={{ "--padding-bottom": "10rem" }}
        fullscreen
      >
        <ThankYou user={user} />
      </IonContent>
    );
  }

  return (
    <IonContent
      ref={contentRef}
      className="page-content"
      style={{ "--padding-bottom": "10rem" }}
      fullscreen
    >
      <div className="min-h-full w-[100%] max-w-xl mx-auto bg-plumb-surface dark:bg-plumb-dark-canvas">
        {activeTab !== "tab0" && (
          <Progress
            step={Number(activeTab.replace("tab", ""))}
          />
        )}

        {activeTab === "tab0" && (
          <Why
            setActiveTab={setActiveTab}
            onLogin={() => router.push(Paths.login)}
          />
        )}

        {activeTab === "tab1" && (
          <Step1
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
            error={error}
            setError={setError}
          />
        )}

        {activeTab === "tab2" && (
          <Step2
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tab3" && (
          <Step3
            formData={formData}
            updateFormData={updateFormData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "tab4" && (
          <Step4
            formData={formData}
            onClickApply={onClickApply}
            setActiveTab={setActiveTab}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </IonContent>
  );
}

