

const styles = {
  about: {
    
  page: [
    "h-[100vh] overflow-scroll ",
    "bg-plumb-surface dark:bg-plumb-dark-canvas",
  ].join(" "),

  inner: [
    "mx-auto w-[100%]",
    "bg-plumb-paper dark:bg-plumb-dark-canvas",
    "px-8 py-12 lg:px-24",
  ].join(" "),

  eyebrow: [
    "mb-4 font-open-sans text-xs font-medium",
    "uppercase tracking-widest",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  welcome: [
    "mb-6 py-12 font-serif font-bold",
    "text-4xl sm:text-5xl leading-tight",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  intro: [
    "mb-12 max-w-xl",
    "font-open-sans text-base leading-relaxed",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  link: [
    "font-semibold underline decoration-1 underline-offset-4",
    "text-plumb-mintHover dark:text-plumb-mintLight",
    "hover:text-plumb-ink dark:hover:text-plumb-darkText",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),

  start: [
    "flex-row flex flex-wrap pb-12",
  ].join(" "),

  section: [
    "border-t border-plumb-borderStrong",
    "pt-6 dark:border-plumb-darkBorderStrong",
  ].join(" "),

  sectionLabel: [
    "mb-3 font-open-sans text-xs font-medium",
    "uppercase tracking-widest",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  sectionTitle: [
    "mb-3 font-serif font-bold",
    "text-2xl sm:text-3xl",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  sectionBody: [
    "mb-6 max-w-xl font-open-sans text-sm leading-relaxed",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  features: [
    "grid sm:grid-cols-2",
    "gap-x-10 gap-y-8 pb-12",
  ].join(" "),

  featureTitle: [
    "mb-2 font-serif text-lg font-bold",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  featureBody: [
    "font-open-sans text-sm leading-relaxed",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  cta: [
    "rounded-2xl border border-plumb-borderStrong p-8",
    "dark:border-plumb-darkBorderStrong",
  ].join(" "),

  ctaTitle: [
    "mb-2 font-serif text-xl font-bold",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  ctaBody: [
    "mb-6 max-w-md font-open-sans text-sm leading-relaxed",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),
},
content: {
  surface: [
    "mx-auto min-h-screen",
    "bg-paper text-plumb-ink",
    "dark:bg-plumb-dark-canvas dark:text-plumb-darkText",
    "pb-28 pt-10",
  ].join(" "),

  text: {
    super: [
      "mt-4 max-w-3xl font-serif font-bold",
      "text-[2.9rem] sm:text-[4.5rem] lg:text-[5rem]",
      "leading-[1] tracking-tight",
      "text-plumb-ink dark:text-plumb-darkText",
    ].join(" "),

    body: [
      "mt-4 max-w-2xl font-serif",
      "text-lg sm:text-xl leading-relaxed",
      "text-plumb-text dark:text-plumb-darkText",
    ].join(" "),
  },
},

page: {
  content: [
    "ql-editor prose prose-sm max-w-none",
    "bg-paper text-plumb-text",
    "dark:bg-plumb-dark-canvas dark:text-plumb-darkText",
    "font-lora text-base sm:text-lg",
    "leading-[1.8]",
    "px-4 sm:px-8",
    "py-5 sm:py-7",
    "prose-headings:text-plumb-ink",
    "dark:prose-headings:text-plumb-darkText",
    "prose-p:text-plumb-text",
    "dark:prose-p:text-plumb-darkText",
    "prose-a:text-plumb-mintHover",
    "dark:prose-a:text-plumb-mintLight",
  ].join(" "),

  contentContainer: [
    "relative annotation-container",
    "px-3 sm:px-5",
    "py-4 sm:py-6",
    "border border-dashed",
    "border-plumb-borderStrong",
    "dark:border-plumb-darkBorderStrong",
  ].join(" "),

  list: [
    "mx-auto max-w-2xl",
    "bg-paper dark:bg-plumb-dark-surface",
  ].join(" "),
},
text: {
  display: [
    "font-serif font-semibold",
    "text-3xl sm:text-4xl",
    "leading-tight tracking-tight",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  title: [
    "font-serif font-semibold",
    "text-2xl sm:text-3xl",
    "leading-tight",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  heading: [
    "font-serif font-semibold",
    "text-xl sm:text-2xl",
    "leading-snug",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  section: [
    "font-lora font-semibold text-lg",
    "leading-snug",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  subheading: [
    "font-open-sans font-semibold text-base",
    "leading-snug",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  body: [
    "font-open-sans text-base",
    "leading-relaxed",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  readable: [
    "font-lora text-base sm:text-lg",
    "leading-[1.8]",
    "px-3 py-4 sm:px-5 sm:py-6",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  muted: [
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  subtle: [
    "text-plumb-subtle dark:text-plumb-darkSubtle",
  ].join(" "),

  metadata: [
    "font-open-sans text-sm font-medium",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),
},
tabs: {
  list: {
container: [
"divide-y",
"divide-plumb-border",
"dark:divide-plumb-darkBorder",
"border-y",
"border-plumb-border",
"dark:border-plumb-darkBorder",
].join(" "),

  },
  text: {
    heading: [
      "font-serif text-3xl font-semibold",
      "text-plumb-ink dark:text-plumb-darkText",
    ].join(" "),

    body: [
      "py-8 font-serif",
      "text-plumb-text dark:text-plumb-darkText",
    ].join(" "),

    muted: [
      "font-serif",
      "text-plumb-muted dark:text-plumb-darkMuted",
    ].join(" "),

    subtle: [
      "font-serif",
      "text-plumb-subtle dark:text-plumb-darkSubtle",
    ].join(" "),
  },


  // Keep your existing container, wrapper, tab,
  // active, and inactive definitions.
},

scrollDown: {
  button: [
    "fixed",
    "right-4 sm:right-6",
    "bottom-[calc(4.5rem+env(safe-area-inset-bottom))] sm:bottom-20",
    "z-[60]",
    "rounded-full px-4 py-2",
    "font-semibold shadow-lg transition-colors duration-300",
    "bg-plumb-ink text-plumb-paper",
    "hover:bg-plumb-mintHover",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
    "dark:hover:bg-plumb-dark-surface",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
  ].join(" "),
},

  button: {
//   base: [
//     "inline-flex items-center justify-center",
//     "rounded-full font-medium",
//     "transition-all duration-200 ease-out",
//     "transform-gpu",
//     "hover:-translate-y-0.5",
//     "active:translate-y-0 active:scale-[0.96]",
//     "focus-visible:outline-none",
//     "focus-visible:ring-2",
//     "focus-visible:ring-plumb-focus",
//     "focus-visible:ring-offset-2",
//     "focus-visible:ring-offset-paper",
//     "dark:focus-visible:ring-offset-plumb-dark-canvas",
//     "disabled:pointer-events-none disabled:opacity-50",
//     "disabled:transform-none",
//     "motion-reduce:transform-none",
//     "motion-reduce:transition-none",
//   ].join(" "),
// },
base: [
"inline-flex items-center justify-center",
"rounded-full",
"font-medium",
"transition-all duration-200 ease-out",
"transform-gpu",
"hover:-translate-y-0.5",
"active:translate-y-0",
"active:scale-[0.96]",
"focus-visible:outline-none",
"focus-visible:ring-2",
"focus-visible:ring-plumb-focus",
"focus-visible:ring-offset-2",
"focus-visible:ring-offset-plumb-paper",
"dark:focus-visible:ring-offset-plumb-dark-canvas",
"disabled:pointer-events-none",
"disabled:opacity-50",
"disabled:transform-none",
"motion-reduce:transform-none",
"motion-reduce:transition-none",
].join(" "),
primary: [
    "rounded-full",
  "text-base",
  "bg-plumb-mintHover text-white",
  "shadow-sm",
  "hover:bg-plumb-mint",
  "hover:shadow-md",
  "active:shadow-sm",
].join(" "),

filterActive: [
  "bg-plumb-mintHover text-white",
  "hover:bg-plumb-mint",
].join(" "),

  
secondary: [
  "rounded-full",
"text-base",
"bg-plumb-button-secondary-bg",
"text-white",
"shadow-sm",
"hover:bg-plumb-button-secondary-hover",
"hover:shadow-md",
"active:shadow-sm",
].join(" "),

  accent: [
     "text-base",
        "rounded-full",
    "bg-plumb-button-accent-bg",
    "text-plumb-button-accent-text",
    "hover:bg-plumb-button-accent-hover",
  ].join(" "),

  danger: [
     "text-base",
        "rounded-full",
    "bg-plumb-button-danger-bg",
    "text-white",
    "hover:bg-plumb-button-danger-hover",
  ].join(" "),

  agree: [
     "text-base",
        "rounded-full",
        "bg-plumb-button-primary-hover",
        "font-bold",
      
    "text-white",
    "hover:bg-plumb-mintHover",
  ].join(" "),

  cancel: [
     "text-base",
        "rounded-full",
    "border border-plumb-border",
    "bg-transparent",
    "text-plumb-muted",
    "hover:border-plumb-mint",
    "hover:text-plumb-ink",
    "dark:border-plumb-darkBorder",
    "dark:text-plumb-darkMuted",
    "dark:hover:border-plumb-mintLight",
    "dark:hover:text-plumb-darkText",
  ].join(" "),
ghost: [
"text-base",
"bg-transparent",
"text-plumb-muted",
"hover:bg-plumb-mint/10",
"hover:text-plumb-ink",
"dark:text-plumb-darkMuted",
"dark:hover:bg-plumb-mint/15",
"dark:hover:text-plumb-darkText",
"active:bg-plumb-mint/20",
"dark:active:bg-plumb-mint/25",
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

  filterActive: [
    "bg-plumb-mint",
    "text-white",
    "hover:bg-plumb-mintHover",
  ].join(" "),

  filterInactive: [
    "border border-plumb-border",
    "bg-transparent",
    "text-plumb-muted",
    "dark:border-plumb-darkBorder",
    "dark:text-plumb-darkMuted",
    "hover:border-plumb-mint",
    "hover:text-plumb-ink",
    "dark:hover:text-plumb-darkText",
  ].join(" "),

  small: [
    "min-h-9",
    "px-3",
    "text-xs",
  ].join(" "),

  medium: [
    "min-h-11",
    "px-5",
    "text-sm",
  ].join(" "),

  large: [
    "min-h-12",
    "px-6",
    "text-base",
  ].join(" "),
// },
   },

input: [
  "w-[100%] max-w-sm",
  "rounded-full",
  "border border-plumb-borderStrong",
  "bg-paper text-plumb-ink",
  "px-4 py-3",
  "placeholder:text-plumb-muted",
  "dark:border-plumb-darkBorderStrong",
  "dark:bg-plumb-dark-surface",
  "dark:text-plumb-darkText",
  "dark:placeholder:text-plumb-darkMuted",
  "focus:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-plumb-focus",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-paper",
  "dark:focus-visible:ring-offset-plumb-dark-canvas",
].join(" "),

  // input: [
  //   "w-[100%] rounded-full border border-base-content/15 bg-plumb-surface  px-5 py-4 text-base-content outline-none transition placeholder:text-base-content/45 focus:border-soft focus:ring-2 focus:ring-soft/20 dark:border-white/15 dark:bg-base-bgDark",

  //   " max-w-sm",
  //   "rounded-full",
  //   "border border-plumb-border",
  //   "bg-transparent",
  //   "px-4 py-2",
  //   "text-base",
  //   "text-plumb-ink",
  //   "placeholder:text-plumb-subtle",
  //   "dark:border-plumb-darkBorder",
  //   "dark:text-plumb-darkText",
  //   "dark:placeholder:text-plumb-darkSubtle",
  //   "focus:outline-none",
  //   "focus:ring-2",
  //   "focus:ring-plumb-focus",
  // ].join(" "),


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
    "border border-plumb-borderStrong",
"dark:border-plumb-darkBorderStrong",
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
    "text-plumb-ink dark:text-plumb-darkText",
    "leading-snug",
    // "text-plumb-ink",
    // "dark:text-plumb-darkText",
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