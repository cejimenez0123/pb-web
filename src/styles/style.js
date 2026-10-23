

const styles = {

navbar: {
  desktop: [
    "w-full h-36",
    "flex items-center",
    "bg-plumb-mintHover dark:bg-plumb-dark-surface",
  "border-b border-plumb-mint dark:border-plumb-darkBorder",
    "border-b border-plumb-mint",
  ].join(" "),
menuButton: [
  "flex items-center justify-center",
  "w-11 h-11",
  "shrink-0",
  "rounded-full bg-transparent",
  "dark:text-plumb-darkText",
  "transition-colors duration-150",
  "hover:bg-white/10 dark:hover:bg-plumb-mint/15",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-plumb-focus",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-plumb-mintHover",
  "dark:focus-visible:ring-offset-plumb-dark-surface",
].join(" "),




  mobileBrowser: [
    "relative  ",
    "flex flex-row  my-auto",
     "bg-plumb-mintHover dark:bg-plumb-dark-surface",
  "border-b border-plumb-mint dark:border-plumb-darkBorder",
    "z-50",
  ].join(" "),
 menuBrowserIconLine: [
    "block min-w-5 max-w-12 my-auto rounded-full h-[1px]",
    "bg-white"

  ].join(" "),
  mobileBrowserMenu: [
    " gap-1 flex flex-col",
    "bg-plumb-mintHover dark:bg-plumb-dark-surface",
    // border-b border-plumb-mint dark:border-plumb-darkBorder 
  "min-h-8 ",
   
    "z-40",
  ].join(" "),

  inner: [
    "w-full",
    "flex items-center justify-between",
    "px-[6.5%]",
  ].join(" "),

  mobileInner: [
    "w-full",
    "flex items-center justify-between",
    "px-4 py-3",
  ].join(" "),

  wordmark: [
  
    "font-serif",
    "font-semibold",
    "leading-none",
    "tracking-[-0.025em]",
    "text-white bg-transparent",
    "transition-opacity",
    "hover:opacity-80",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-mintHover",
  ].join(" "),

  desktopNav: [
    "bg-plumb",
    "absolute",
    "left-1/2",
    "-translate-x-1/2",
    "flex items-center",
    "gap-[42px]",
  ].join(" "),

  desktopItem: [
    "text-[1.2em]",
    "leading-none",
    "tracking-[-0.02em]",
    "text-plumb-mintLight",
    "transition-colors duration-150",
    "hover:text-white",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-mintHover",
  ].join(" "),

  desktopItemActive: [
    "text-white",
    "font-medium",
  ].join(" "),

  utility: [
    "flex items-center",
    "gap-5",
  ].join(" "),

  utilityButton: [
    "text-plumb-mintLight",
    "hover:text-white",
    "transition-colors",
    "whitespace-nowrap",
    "tracking-[-0.02em]",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-mintHover",
  ].join(" "),


  menuIcon: [
    "flex flex-col",
    "items-center justify-center",
    "gap-[5px]",
  ].join(" "),

  menuIconLine: [
    "block w-5 h-[10px]",
    "bg-white",
  ].join(" "),

  mobileItem: [

    "flex items-center",

    "text-base",
    "leading-none",
    "text-left",
    "tracking-[-0.02em]",
    "text-plumb-mintLight bg-transparent",
    "transition-colors duration-150",
    "hover:bg-white/10",
    "hover:text-white",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-inset",
    "focus-visible:ring-plumb-focus",
  ].join(" "),

  mobileItemActive: [
    "text-white",
    "font-medium",
  ].join(" "),

  mobileNative: [
    "fixed",
    "left-0 right-0",
    "z-50",
    "min-h-14",
    "bg-plumb-mintHover",
    "border-t border-plumb-mint",
    "flex items-center justify-around",
    "pb-[env(safe-area-inset-bottom)]",
  ].join(" "),

  mobileNativeItem: [
    "flex flex-1",
    "min-w-0 min-h-14",
    "items-center justify-center",
    "px-1 py-3",
    "text-sm sm:text-base",
    "leading-none",
    "tracking-[-0.02em]",
    "text-plumb-mintLight",
    "transition-colors duration-150",
    "hover:text-white",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-inset",
    "focus-visible:ring-plumb-focus",
  ].join(" "),

  mobileNativeItemActive: [
    "text-white",
    "font-medium",
  ].join(" "),
},
  importWork: {
    section: [
      "mt-16 max-w-3xl",
    ].join(" "),

    intro: [
      "mb-5",
    ].join(" "),

    label: [
      "mb-3 font-open-sans text-xs font-medium",
      "uppercase tracking-widest",
      "text-plumb-muted dark:text-plumb-darkMuted",
    ].join(" "),

    description: [
      "mt-2 max-w-xl font-lora text-base leading-relaxed",
      "text-plumb-text dark:text-plumb-darkText",
    ].join(" "),

    grid: [
      "grid grid-cols-1 gap-4 sm:grid-cols-2",
    ].join(" "),

    card: [
      "group min-h-[150px] rounded-2xl border p-6 text-left",
      "border-plumb-borderStrong bg-plumb-paper",
      "transition-all duration-200",
      "hover:-translate-y-0.5 hover:border-plumb-mintHover",
      "hover:bg-plumb-surface",
      "dark:border-plumb-darkBorderStrong",
      "dark:bg-plumb-dark-surface",
      "dark:hover:border-plumb-mintLight",
      "dark:hover:bg-plumb-dark-canvas",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
      "focus-visible:ring-offset-plumb-paper",
      "dark:focus-visible:ring-offset-plumb-dark-canvas",
      "motion-reduce:transform-none motion-reduce:transition-none",
    ].join(" "),

    cardDragging: [
      "border-plumb-mintHover bg-plumb-surface",
      "dark:border-plumb-mintLight dark:bg-plumb-dark-canvas",
    ].join(" "),

    cardTitle: [
      "font-serif text-xl font-semibold",
      "text-plumb-ink dark:text-plumb-darkText",
    ].join(" "),

    cardDescription: [
      "mt-2 max-w-sm font-open-sans text-sm leading-relaxed",
      "text-plumb-muted dark:text-plumb-darkMuted",
    ].join(" "),

    cardAction: [
      "text-sm font-medium",
      "text-plumb-mintHover dark:text-plumb-mintLight",
      "group-hover:underline underline-offset-4",
    ].join(" "),

    error: [
      "mt-3 font-open-sans text-sm",
      "text-red-700 dark:text-red-300",
    ].join(" "),
  },

  about: {
    
  page: [
    "h-[100vh] overflow-scroll ",
    "bg-plumb-surface dark:bg-plumb-dark-canvas",
  ].join(" "),

  inner: [
    "mx-auto w-[100%]",
    "bg-transparent dark:bg-plumb-dark-canvas",
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
    // "className="pb-20 ""
    "mx-auto min-h-screen",
    "bg-paper text-plumb-ink",
    "dark:bg-plumb-dark-canvas dark:text-plumb-darkText",
    "pb-28 md:pb-0 pt-10",
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