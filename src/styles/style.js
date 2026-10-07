const styles = {
  text: {
    heading: "text-plumb-ink dark:text-plumb-darkText",
    body: "text-plumb-text dark:text-plumb-darkText",
    muted: "text-plumb-muted dark:text-plumb-darkMuted",
    subtle: "text-plumb-subtle dark:text-plumb-darkSubtle",
  },

  button: {
    base: [
      "inline-flex items-center justify-center",
      "rounded-full",
      "font-medium",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-plumb-focus",
      "focus-visible:ring-offset-2",
      "active:scale-[0.98]",
    ].join(" "),

    filter: [
      "rounded-full",
      "px-4 py-2",
      "text-xs uppercase tracking-widest",
      "font-medium",
      "transition-colors",
      "focus-visible:outline-none",
      "focus-visible:ring-2",
      "focus-visible:ring-plumb-focus",
      "focus-visible:ring-offset-2",
    ].join(" "),

    filterActive:
      "bg-plumb-mint text-white hover:bg-plumb-mintHover",

    filterInactive: [
      "border border-plumb-border",
      "text-plumb-muted",
      "dark:border-plumb-darkBorder",
      "dark:text-plumb-darkMuted",
      "hover:border-plumb-mint",
      "hover:text-plumb-ink",
      "dark:hover:text-plumb-darkText",
    ].join(" "),
  },

  input: [
    "w-full max-w-sm",
    "rounded-full",
    "border border-plumb-border",
    "bg-transparent",
    "px-4 py-2",
    "text-base",
    "text-plumb-ink",
    "placeholder:text-plumb-subtle",
    "dark:border-plumb-darkBorder",
    "dark:text-plumb-darkText",
    "dark:placeholder:text-plumb-darkSubtle",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-plumb-focus",
  ].join(" "),

//   event: {
//     card: [
//       "rounded-2xl",
//       "border border-plumb-border",
//       "bg-plumb-surface",
//       "p-4",
//       "transition-colors",
//       "dark:border-plumb-darkBorder",
//       "dark:bg-plumb-surface",
//     ].join(" "),

//     title:
//       "font-lora font-bold text-base text-plumb-ink dark:text-plumb-darkText",

//     metadata:
//       "font-open-sans font-medium text-xs text-plumb-muted dark:text-plumb-darkMuted",

//     tag: [
//       "rounded-full",
//       "bg-plumb-mint/15",
//       "px-2 py-0.5",
//       "text-xs font-medium",
//       "text-plumb-ink",
//       "dark:bg-plumb-mint/20",
//       "dark:text-plumb-darkText",
//     ].join(" "),
//   },
event: {
  card: [
    "rounded-3xl",
    "border border-plumb-border",
    "bg-plumb-surface",
    "p-5",
    "shadow-sm",
    "transition-all",
    "duration-200",
    "hover:-translate-y-0.5",
    "hover:shadow-md",
    "hover:border-plumb-mint",
    "dark:border-plumb-darkBorder",
    "dark:bg-plumb-dark-surface",
    "dark:hover:border-plumb-mintLight",
    "focus-within:ring-2",
    "focus-within:ring-plumb-focus",
    "focus-within:ring-offset-2",
    "dark:focus-within:ring-offset-plumb-dark-canvas",
  ].join(" "),

  title: [
    "font-lora",
    "font-bold",
    "text-base",
    "leading-snug",
    "text-plumb-ink",
    "dark:text-plumb-darkText",
  ].join(" "),

  metadata: [
    "font-open-sans",
    "font-medium",
    "text-xs",
    "text-plumb-muted",
    "dark:text-plumb-darkMuted",
  ].join(" "),

  tag: [
    "rounded-full",
    "bg-plumb-mint/10",
    "px-2.5",
    "py-1",
    "text-xs",
    "font-medium",
    "text-plumb-ink",
    "dark:bg-plumb-mint/15",
    "dark:text-plumb-darkText",
  ].join(" "),
}
}

export default styles