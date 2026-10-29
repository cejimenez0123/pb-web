

const styles = {
profile: {
  page: [
    "mx-auto  ",
    "px-4 sm:px-5",
    "pt-safe pb-24",
    "bg-plumb-surface dark:bg-plumb-dark-canvas",
    " text-plumb-text",
    " dark:text-plumb-darkText",
  ].join(" "),

  content: "space-y-8 sm:space-y-10 max-w-2xl mx-auto",

  header: "space-y-5 py-6 sm:space-y-6 sm:py-8",

  identity: [
    "flex min-w-0 flex-col gap-3",
    "sm:flex-row sm:items-center sm:gap-4",
  ].join(" "),

  username: [
    "break-words text-sm font-medium",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  sectionLabel: [
    "text-xs font-semibold uppercase tracking-wider",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  body: [
    "break-words text-sm leading-relaxed sm:text-base",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  muted: "text-plumb-muted dark:text-plumb-darkMuted",

  pill: [
    "inline-flex max-w-full items-center",
    "rounded-full border px-3 py-1",
    "border-plumb-border bg-plumb-paper",
    "text-xs text-plumb-text",
    "transition-colors hover:border-plumb-mintHover",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "dark:border-plumb-darkBorder dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText dark:hover:border-plumb-mintLight",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),

  stats: "flex flex-wrap items-center gap-x-8 gap-y-4",

  stat: "flex min-w-[4rem] flex-col items-center text-center",

  statValue: "font-semibold text-plumb-ink dark:text-plumb-darkText",

  statLabel: "text-xs text-plumb-muted dark:text-plumb-darkMuted",

  searchRow: [
    "flex flex-col gap-3 py-5",
    "sm:flex-row sm:items-center",
  ].join(" "),

  search: [
    "min-w-0 w-[100%] flex-1 rounded-full border px-4 py-2.5",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-sm text-plumb-text placeholder:text-plumb-muted",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText dark:placeholder:text-plumb-darkMuted",
  ].join(" "),

  actions: "flex min-w-0 items-center gap-3",

  menuButton: [
    "inline-flex h-10 w-10 shrink-0 items-center justify-center",
    "rounded-full transition-colors",
    "hover:bg-plumb-border/50 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-plumb-focus",
    "dark:hover:bg-plumb-dark-surface",
  ].join(" "),

  menu: [
    "dropdown-content z-20 mt-2 w-44 rounded-2xl border p-2 shadow-lg",
    "border-plumb-border bg-plumb-paper text-plumb-text",
    "dark:border-plumb-darkBorder dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText",
  ].join(" "),

  menuItem: [
    "w-full rounded-xl px-3 py-2.5 text-left text-sm",
    "transition-colors hover:bg-plumb-border/40",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "dark:hover:bg-plumb-dark-canvas",
  ].join(" "),

  menuItemDanger: "text-red-600 dark:text-red-400",

  tabWrapper: "mx-auto w-[100%] max-w-lg px-0 pb-4 sm:px-4",

  tabContent: "min-h-[24rem] space-y-8 sm:min-h-[40rem] sm:space-y-10",

  section: "space-y-4",

  listItem: [
    "w-[100%] min-w-0 rounded-2xl border px-4 py-3",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-sm text-plumb-text shadow-sm",
    "transition-colors hover:border-plumb-mintHover",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText dark:hover:border-plumb-mintLight",
  ].join(" "),

  empty: "py-10 text-center text-sm text-plumb-muted dark:text-plumb-darkMuted",

  status: [
    "rounded-xl border px-4 py-3 text-sm",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-plumb-text dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
  ].join(" "),

  skeleton: "animate-pulse space-y-8 px-0 py-6 sm:px-2 sm:py-8",

  skeletonBlock: "rounded-xl bg-plumb-border dark:bg-plumb-dark-surface",

  skeletonCircle: "h-14 w-14 rounded-full bg-plumb-border dark:bg-plumb-dark-surface",

  skeletonLine: "h-3 rounded-full bg-plumb-border dark:bg-plumb-dark-surface",

  skeletonCard: "h-24 w-[100%] rounded-2xl bg-plumb-border dark:bg-plumb-dark-surface",

  loadingLayer: [
    "absolute inset-0 z-10 px-4",
    "transition-opacity duration-300",
  ].join(" "),

  realContent: "relative transition-opacity duration-300",

  pageTitle: "text-lg font-semibold text-plumb-ink dark:text-plumb-darkText",
},
collection: {
  page: [
    "  pb-20 overflow-y-auto ",
    "bg-plumb-surface text-plumb-ink",
    "dark:bg-plumb-dark-canvas dark:text-plumb-darkText",
  ].join(" "),

  section: [
    "border-plumb-borderStrong",
    "dark:border-plumb-darkBorderStrong",
  ].join(" "),

  card: [
    "rounded-2xl border p-5",
    "border-plumb-borderStrong bg-plumb-paper",
    "transition-all duration-200",
    "hover:-translate-y-0.5 hover:border-plumb-mintHover",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface",
    "dark:hover:border-plumb-mintLight",
  ].join(" "),

  heading: [
    "font-serif text-2xl sm:text-3xl",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  body: [
    "font-open-sans text-base leading-relaxed",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  muted: [
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  empty: [
    "rounded-2xl border border-dashed p-8 text-center",
    "border-plumb-borderStrong",
    "dark:border-plumb-darkBorderStrong",
  ].join(" "),

  skeleton: [
    "animate-pulse rounded-2xl",
    "bg-plumb-border dark:bg-plumb-dark-surface",
    "motion-reduce:animate-none",
  ].join(" "),
},

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
    " overflow-auto min-h-[100vh] ",
    "bg-plumb-surface px-8 py-12 dark:bg-plumb-dark-canvas",
  ].join(" "),

  inner: [
    "mx-auto h-full overflow-auto w-[100%]",
   "bg-plumb-surface dark:bg-plumb-dark-canvas",
    " lg:px-24",
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
       "bg-plumb-surface dark:bg-plumb-dark-canvas",
    "pt-6 dark:border-plumb-darkBorderStrong",
  ].join(" "),

  sectionLabel: [
    "mb-3 font-open-sans text-xs font-medium",
    "uppercase tracking-widest",
       "bg-plumb-surface dark:bg-plumb-dark-canvas",
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
"text-center",
"divide-plumb-border",
"dark:divide-plumb-darkBorder",
"border-y",
"border-plumb-border",
"dark:border-plumb-darkBorder",
].join(" "),

  },
  text: {
    heading: [
      "font-serif text-3xl mx-auto w-fit font-semibold",
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
    "text-plumb-dark dark:text-plumb-darkText",
    "leading-snug",
    "flex flex-row items-center "
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
,dashboardItem: {
  card: [
    "w-[100%] overflow-hidden rounded-2xl",
    "border border-plumb-borderStrong",
    "bg-plumb-surface dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface",
    "transition-colors duration-200",
    "motion-reduce:transition-none",
  ].join(" "),

  header: [
    "flex items-center justify-between gap-3",
    "px-4 pt-4 sm:px-5 sm:pt-5",
  ].join(" "),

  authorButton: [
    "flex min-w-0 items-center gap-3 rounded-lg text-left",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
  ].join(" "),

  authorName: [
    "truncate font-open-sans text-sm font-medium",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  metadata: [
    "mt-0.5 font-open-sans text-xs",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  title: [
    "font-serif text-lg font-semibold leading-snug",
    "text-plumb-ink dark:text-plumb-darkText",
    "transition-colors duration-150",
    "group-hover:text-plumb-mintHover",
    "dark:group-hover:text-plumb-mintLight",
  ].join(" "),

  titleButton: [
    "block w-fit max-w-full rounded-md text-left",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
  ].join(" "),

  content: [
    "px-4 pb-4 pt-4 sm:px-5 sm:pb-5",
  ].join(" "),

  excerpt: [
    "mt-3 font-lora text-base leading-[1.8]",
    "text-plumb-text dark:text-plumb-darkText",
    "[&_p]:mb-3 [&_p:last-child]:mb-0",
    "[&_a]:underline [&_a]:underline-offset-2",
    "[&_a]:text-plumb-mintHover",
    "dark:[&_a]:text-plumb-mintLight",
  ].join(" "),

  continue: [
    "mt-3 inline-flex min-h-10 items-center gap-1.5",
    "rounded-full px-3 py-2",
    "font-open-sans text-sm font-medium",
    "text-plumb-mintHover dark:text-plumb-mintLight",
    "transition-colors duration-150",
    "hover:bg-plumb-mint/10 dark:hover:bg-plumb-mint/15",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
    "motion-reduce:transition-none",
  ].join(" "),

  actions: [
    "flex flex-wrap items-center gap-1",
    "border-t border-plumb-borderStrong",
    "px-3 py-2 dark:border-plumb-darkBorderStrong",
  ].join(" "),

  action: [
    "inline-flex min-h-10 items-center justify-center",
    "rounded-full px-3 py-2",
    "font-open-sans text-sm",
    "text-plumb-muted dark:text-plumb-darkMuted",
    "transition-colors duration-150",
    "hover:bg-plumb-mint/10 hover:text-plumb-ink",
    "dark:hover:bg-plumb-mint/15 dark:hover:text-plumb-darkText",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "motion-reduce:transition-none",
  ].join(" "),

  actionActive: [
    "font-medium text-plumb-mintHover",
    "dark:text-plumb-mintLight",
  ].join(" "),

  bookmark: [
    "flex h-10 w-10 shrink-0 items-center justify-center",
    "rounded-full transition-colors duration-150",
    "hover:bg-plumb-mint/10 dark:hover:bg-plumb-mint/15",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "motion-reduce:transition-none",
  ].join(" "),

  privateCard: [
    "rounded-xl border border-plumb-borderStrong",
    "bg-plumb-paper p-4",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-canvas",
  ].join(" "),

  privateTitle: [
    "font-serif text-lg font-semibold",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  privateBody: [
    "mt-1 font-open-sans text-sm leading-relaxed",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  skeleton: [
    "h-48 w-[100%] animate-pulse rounded-2xl",
    "border border-plumb-borderStrong bg-plumb-mint/5",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
    "motion-reduce:animate-none",
  ].join(" "),

  permissionButton: [
    "mt-4 inline-flex min-h-10 items-center justify-center",
    "rounded-full bg-plumb-mintHover px-4 py-2",
    "font-open-sans text-sm font-medium text-white",
    "transition-colors duration-150 hover:bg-plumb-mint",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-paper",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
    "disabled:cursor-default disabled:opacity-60",
    "motion-reduce:transition-none",
  ].join(" "),
},
}

export default styles