const shared = {
    bodyWidth:"max-w-3xl",
  // Page foundations
  page: {
    canvas: `
      min-h-[100dvh]
      bg-plumb-canvas text-plumb-ink
      dark:bg-plumb-dark-canvas dark:text-plumb-darkText
    `,
    surface: `
      bg-plumb-surface text-plumb-ink
      dark:bg-plumb-dark-canvas dark:text-plumb-darkText
    `,
  },

  // Layout
  layout: {
    centered: "mx-auto w-full",
    readingWidth: "max-w-3xl",
    pagePadding: "px-4 sm:px-6",
  },

  // Typography
  text: {
    eyebrow: `
      text-xs font-semibold uppercase tracking-widest
      text-plumb-muted dark:text-plumb-darkMuted
    `,
    heading: `
      font-serif font-medium tracking-tight
      text-plumb-ink dark:text-plumb-darkText
    `,
    body: `
      text-sm leading-6
      text-plumb-muted dark:text-plumb-darkMuted
    `,
    subtle: `
      text-xs
      text-plumb-subtle dark:text-plumb-darkSubtle
    `,
  },

  // Surfaces
  surface: {
    border: `
      border border-plumb-borderStrong
      dark:border-plumb-darkBorderStrong
    `,
    card: `
      rounded-2xl border
      border-plumb-borderStrong
      bg-plumb-paper
      dark:border-plumb-darkBorderStrong
      dark:bg-plumb-dark-surface
    `,
    elevated: `
      rounded-2xl border
      border-plumb-border
      bg-plumb-elevated
      dark:border-plumb-darkBorder
      dark:bg-plumb-dark-elevated
    `,
    empty: `
      rounded-2xl border border-dashed
      border-plumb-borderStrong
      dark:border-plumb-darkBorderStrong
    `,
  },

  // Interaction
  interaction: {
    focus: `
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-plumb-focus
      focus-visible:ring-offset-2
      dark:focus-visible:ring-plumb-mintLight
      dark:focus-visible:ring-offset-plumb-dark-canvas
    `,
    transition: "transition-colors duration-150",
    reducedMotion: "motion-reduce:transition-none",
  },
};

const styles = {
    input:{
     search:{

  searchLabel: `
pr-2
  pl-4
    my-auto block
    bg-plumb-canvas
    dark:bg-transparent
    text-xs font-medium
    text-plumb-muted
    dark:text-plumb-darkMuted
  `,
      searchWrap: [`
    w-[100%] flex flex-row rounded-full `,
    `border border-1
    border-plumb-mintLight`,
  `  dark:bg-transparent   bg-plumb-canvas
`,`
   shadow-sm text-sm text-plumb-ink dark:text-plumb-darkSurface
    placeholder:text-plumb-subtle`,`
    outline-none
 `,`
    transition-colors
    focus:border-plumb-mint

    dark:border-plumb-darkBorder
    dark:text-plumb-darkText
    dark:placeholder:text-plumb-darkSubtle
    dark:focus:border-plumb-mintLight
  
  
  `].join(" "),
  
      input: `
   rounded-full
my-auto
bg-plumb-canvas
dark:bg-transparent
 
  py-2 px-2 
    text-sm text-plumb-ink
    placeholder:text-plumb-subtle
    outline-none
    transition-colors
    focus:border-plumb-mint
 
   
    dark:text-plumb-darkText
    dark:placeholder:text-plumb-darkSubtle
    dark:focus:border-plumb-mintLight


  `,},
               base: [
    "px-6 py-3 bg-plumb-canvas shadow-sm dark:bg-transparent",
    " text-plumb-ink dark:text-plumb-darkText ",
    "placeholder:text-plumb-muted",
    "focus:outline-none focus:ring-0",
    "dark:placeholder:text-plumb-darkMuted",
  ].join(" "),
  text:" w-[100%] rounded-full",
  textarea:"rounded-2xl border border-1 border-plumb-mint w-[100%]",
  primary:["border-1  border border-plumb-mint"].join(" ")
   
    },

    pageShell: {
      row:{
        outer:["w-[100%] flex flex-row justify-between px-6 py-3",
          " border border-1 rounded-full py-3 "].join(" "),
       },
        elevated: `
      rounded-2xl border
      border-plumb-border
      bg-plumb-elevated
      dark:border-plumb-darkBorder
      dark:bg-plumb-dark-elevated
    `,

          elevated: " p-3 "+shared.surface.elevated,

      head:"max-w-3xl mx-auto mt-8 px-1 pb-2 w-[100%]",
      headInner:"px-4",
body:"max-w-3xl mx-auto px-2  w-[100%]",
    content:[" max-w-3xl  flex"].join(" "),
   section:["mx-auto max-w-page space-y-4 mt-4 mb-8"].join(" "),
  
      list: [
    "mx-auto max-w-2xl",
    "bg-paper dark:bg-plumb-dark-surface",
  ].join(" "),

    header: `
    flex flex-col px-4 text-left  
 
  `,
base: [
  "relative  font-open-sans" ,
  "flex flex-col",
   "pt-20 pb-30",
  "w-[100%]",
  "min-w-[100%] min-h-[100%]",
  "overflow-hidden",
  "bg-plumb-surface  text-plumb-ink",
  "dark:bg-plumb-dark-canvas dark:text-plumb-darkText",
].join(" "),
  // Use when the page itself should scroll
  scroll: [
  
    "overflow-y-auto"
  ].join(" "),

  
  padded: [
    "px-4 sm:px-6 lg:px-8",
    "pt-8 pb-24",
  ].join(" "),

  // Safe-area-aware layout for native pages
  native: [
    "pt-[env(safe-area-inset-top,0px)]",
    "pb-[calc(6rem+env(safe-area-inset-bottom,0px))]",
  ].join(" "),

  // Centered content container
  inner: [
    "mx-auto w-[100%] bg-plumb-surface  dark:bg-plumb-dark-surface sm:px-10 md:px-16 lg:px-20",
  ].join(" "),

  // Narrower reading/content container
  reading: [
    "mx-auto w-[100%] max-w-3xl",
  ].join(" "),
},

hash: {
  thread: `
    flex flex-col gap-3
    min-w-0 w-full
  `,
    //  group
    //     w-[100%]
    //     text-left
    //     transition-all
    //     duration-200
    //     focus:outline-none
    //     focus:ring-2
    //     focus:ring-soft/40
    //     focus:ring-offset-2
    //     focus:ring-offset-cream
    //     dark:focus:ring-offset-base-bgDark

  card: `
    relative flex flex-col gap-4
    rounded-2xl  p-4 sm:p-5
  border
border-1 border-plumb-darkSurface/10
  
    shadow-sm
    transition-all
     duration-200

   
  focus:ring-2
    focus:ring-soft/40
    focus:ring-offset-2
      focus:ring-offset-cream
     dark:focus:ring-offset-base-bgDark
    dark:shadow-none
  `,

  header: `
    flex min-w-0 items-center justify-between gap-3
  `,

  body: `
    min-w-0 break-words dark:text-plumb-darkText whitespace-pre-wrap
    text-left text-sm leading-relaxed sm:text-base
    text-plumb-ink

  `,

  anchor: `
    block w-full min-w-0
    rounded-r-lg border-l-2 border-plumb-mint/60
    bg-plumb-mint/5 px-3 py-2
    text-left text-xs italic leading-relaxed
    text-plumb-muted
    transition-colors hover:text-plumb-mint
    dark:bg-plumb-mint/10
    dark:text-darkMuted
    dark:hover:text-mintLight
  `,

  nestedReplies: `
    ml-2 min-w-0
    border-l-2 border-plumb-mint/20
    pl-3 sm:ml-3 sm:pl-4
    dark:border-darkMuted/25
  `,

  actions: `
    flex flex-wrap items-center gap-2 sm:gap-3
    pt-1 text-sm
  `,

  action: `
    inline-flex min-h-9 items-center justify-center gap-2
    rounded-full border border-transparent
    px-3 py-1.5
    text-sm font-medium
    text-plumb-muted
    transition-colors
    hover:bg-plumb-mint/10 hover:text-plumb-ink
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-plumb-mint
    dark:text-darkMuted
    dark:hover:bg-plumb-mint/10
    dark:hover:text-darkText
  `,

  helpful: `
    inline-flex min-h-9 dark:bg-transparent dark:text-plumb-blueSea items-center justify-center
    rounded-full border border-plumb-mint/25
    bg-plumb-mint/10 px-3 py-1.5
    text-sm font-medium text-plumb-mint
    transition-colors
    hover:bg-plumb-mint/20
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-plumb-mint
    dark:border-current
    dark:text-mintLight
    dark:hover:bg-plumb-mint/15
  `,

  dropdown: `
    dropdown-content z-30
    w-52 rounded-xl border p-2 shadow-lg
    border-plumb-mint/20
    bg-plumb-surface text-plumb-text
    dark:border-darkMuted/25
    dark:bg-plumb-dark-surface
    dark:text-darkText
  `,

  dropdownItem: `
    w-full rounded-lg px-3 py-2.5
    text-left text-sm
    text-plumb-text
    transition-colors
    hover:bg-plumb-mint/10
    dark:text-darkText
    dark:hover:bg-plumb-mint/15
  `,

  viewReplies: `
    inline-flex min-h-10 items-center justify-center gap-2
    self-start rounded-full
    border border-plumb-mint/25
    bg-plumb-mint/5 px-4 py-2
    text-sm font-medium text-plumb-mint
    transition-colors
    hover:bg-plumb-mint/15
    focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-plumb-mint
    dark:border-current
    dark:text-mintLight
    dark:hover:bg-plumb-mint/15
  `,

  conversationContext: `
    flex min-w-0 flex-col gap-3
    rounded-xl border p-4
    border-plumb-mint/25
    bg-plumb-mint/5
    dark:border-plumb-mint/30
    dark:bg-plumb-mint/10
  `,

  conversationLabel: `
    text-xs font-semibold uppercase tracking-wider
    text-plumb-muted
    dark:text-darkMuted
  `,

  deleted: `
    overflow-hidden opacity-0 max-h-0
    p-0 my-0
  `,

  visible: `
    max-h-[1000px] opacity-100
  `,
},

  login: {
  page: "flex min-h-full w-full justify-center px-5 pt-12 pb-24 sm:px-6 sm:pt-16",

  card: "mx-auto w-full max-w-md",

  layout: "space-y-8",

  header: "space-y-3 text-center",

  fields: "space-y-5 flex flex-col",

  field: "space-y-2 my-2",

  inputWrap: [
    "flex w-full items-center rounded-xl border",
    "border-plumb-borderStrong bg-plumb-elevated",
    "focus-within:border-plumb-mint",
    "focus-within:ring-2 focus-within:ring-plumb-focus/30",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-elevated",
  ].join(" "),

  input: [
    "w-[100%] rounded-full border-0 bg-plumb-canvas dark:bg-transparent",
    "px-4  py-3 text-plumb-ink",
    "placeholder:text-plumb-muted",
    "focus:outline-none focus:ring-0",
    "dark:text-plumb-darkText",
    "dark:placeholder:text-plumb-darkMuted",
  ].join(" "),

  divider: "flex items-center gap-4",

  dividerLine: [
    "h-px flex-1 bg-plumb-border",
    "dark:bg-plumb-darkBorder",
  ].join(" "),

  dividerText: "text-plumb-muted dark:text-plumb-darkMuted",

  social: "space-y-3",

  socialButton: "flex w-full justify-center",

  actions: "space-y-3 pt-2",
},

  communities: {
  item: [
    "p-4  rounded-xl",
    "bg-plumb-surface dark:bg-plumb-dark-surface",
    "text-left",
   
    "border border-plumb-subtle/20 dark:border-white/10",
    "active:scale-[0.98]",
    "transition duration-200",
    "cursor-pointer",
  ].join(" "),

  title: [
    "text-sm font-medium",
    "text-plumb-ink dark:text-plumb-darkText",
    "break-words",
  ].join(" "),

  purpose: [
    "text-sm mt-1",
    "text-plumb-muted dark:text-plumb-darkMuted",
    "break-words",
  ].join(" "),
},

  button: {

base: [
  "btn",
"inline-flex items-center justify-center",
" text-base",
"font-medium border-2 font-open-sans",
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
  "dark:border-plumb-mintLight dark:border dark:border-2   dark:text-plumb-mintLight",
    "rounded-full font-semiBold rounded-full  ",
  
  "bg-plumb-mint dark:bg-transparent dark:border-plumb-button-primary-bg ",
  "dark:text-plumb-button-primary-bg text-plumb-darkText",
  "shadow-sm",
  "hover:bg-plumb-mint/60 hover:border-plumb-mintLight hover:border-3",
  "hover:shadow-md",
  "active:shadow-sm",
].join(" "),

danger:[" border-plumb-button-danger-bg  text-white border  border-1 border bg-red-500 dark:bg-transparent dark:text-white font-open-sans rounded-full  ",].join(" "),

  
secondary: [
  "py-2 px-6 ",
  "border border-2 border-plumb-button-secondary-bg rounded-full",
"rounded-full",
"bg-plumb-button-secondary-bg text-plumb-surface dark:text-plumb-button-secondary-bg"
,
"text-surface",
"shadow-sm",
"dark:bg-transparent   ",
"hover:bg-plumb-button-secondary-hover/60 hover:border-3",
"hover:shadow-md",
"active:shadow-sm",
].join(" "),

  accent: [

    "border border-1 text-plumb-surface bg-plumb-accent-blue border-plumb-accent-blue ",
    " dark:bg-transparent dark:text-plumb-accent-blue",
     "text-lg ",
        "rounded-full",
    "hover:bg-plumb-button-accent-hover",
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
utility: [
  "inline-flex items-center justify-center",
  "min-h-9 px-3",
  "rounded-full",
  "text-[1.1rem] font-medium",
  "text-plumb-muted",
  "bg-transparent",
  "transition-colors duration-150",
  "hover:bg-plumb-mint/10",
  "hover:text-plumb-ink",
  "active:bg-plumb-mint/20",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-plumb-focus",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-plumb-paper",
  "dark:focus-visible:ring-offset-plumb-dark-canvas",
  "dark:text-plumb-darkMuted",
  "dark:hover:bg-plumb-mint/15",
  "dark:hover:text-plumb-darkText",
  "dark:active:bg-plumb-mint/25",
  "motion-reduce:transition-none",
].join(" "),
iconUtility: [
  "inline-flex  shrink-0 items-center justify-center",
  "rounded-full",
  "bg-transparent",
  "dark:text-plumb-darkText",
  "text-plumb-blueSea border-plumb-blueSea border-1 border ",
 
  "transition-colors duration-150",
  "hover:bg-plumb-mint/10",
  "hover:text-plumb-mintHover",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-plumb-focus",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-plumb-paper",
  "dark:focus-visible:ring-offset-plumb-dark-canvas",
  "dark:text-plumb-darkMuted",
  "dark:hover:bg-plumb-mint/15",
  "dark:hover:text-plumb-mintLight",
  "motion-reduce:transition-none",
].join(" "),

utilityActive: [
  "text-plumb-mintHover",
  "hover:bg-plumb-mint/10",
  "dark:text-plumb-mintLight",
  "dark:hover:bg-plumb-mint/20",
].join(" "),

   },


addToCollection: {
  
  content: shared.page.canvas,

  wrap: `
    ${shared.layout.centered}
    max-w-[50em]
g}
    pb-24 pt-8
  `,

  eyebrow: `
    ${shared.text.eyebrow}
    text-plumb-mint dark:text-plumb-mintLight
  `,

  heading: `
    ${shared.text.heading}
    mt-2 text-3xl sm:text-4xl
  `,

  body: `
    ${shared.text.body}
    mt-2 max-w-xl
  `,

  card: shared.surface.elevated,

  itemCard: "p-5",

  section: "mb-8",

  empty: `
    ${shared.surface.empty}
    bg-plumb-surface px-6 py-10 text-center
    ${shared.text.body}
    dark:bg-plumb-dark-surface
  `,

  backButton: `
    ${shared.surface.elevated}
    ${shared.interaction.focus}
    ${shared.interaction.transition}
    rounded-full px-4 py-2
    text-sm font-medium
    text-plumb-muted dark:text-plumb-darkMuted
    hover:border-plumb-blueSea hover:text-plumb-blueSea
    dark:hover:border-plumb-softBlue
    dark:hover:text-plumb-softBlue
  `,
},


// addedPill: `
//   border border-plumb-blueSea/40
//   bg-plumb-blueSea/10 text-plumb-blueSea
//   hover:border-plumb-coral
//   hover:bg-plumb-coral/10
//   hover:text-plumb-coral
//   dark:border-plumb-softBlue/40
//   dark:bg-plumb-softBlue/10
//   dark:text-plumb-softBlue
//   dark:hover:border-plumb-coralLight
//   dark:hover:bg-plumb-coralLight/10
//   dark:hover:text-plumb-coralLight
// `,

// skeleton: `
//   h-16 w-full rounded-full
//   bg-plumb-surface motion-safe:animate-pulse
//   dark:bg-plumb-dark-surface
// `,
// },

  annotation: {
  toolbar: [
    "relative z-50 flex items-center gap-1",
    "rounded-xl border border-plumb-borderStrong",
    "bg-transparent dark:bg-transparent",
    "px-2 py-1.5",
    "text-plumb-ink dark:text-plumb-darkText",
    "shadow-lg",
  ].join(" "),

  toolbarAction: [
    "inline-flex items-center gap-1.5",
    "rounded-lg px-2 py-1.5",
    "text-xs font-medium",
    "text-plumb-ink dark:text-plumb-darkText",
    "bg-transparent",
    "transition-colors",
    "hover:bg-plumb-mint/10 hover:text-plumb-mintHover",
    "dark:hover:bg-plumb-mint/15 dark:hover:text-plumb-mintLight",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "motion-reduce:transition-none",
  ].join(" "),

  toolbarClose: [
    "inline-flex items-center justify-center",
    "h-7 w-7 rounded-lg",
    "bg-transparent",
    "text-plumb-muted dark:text-plumb-darkMuted",
    "transition-colors",
    "hover:bg-plumb-mint/10 hover:text-plumb-ink",
    "dark:hover:bg-plumb-mint/15 dark:hover:text-plumb-darkText",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "motion-reduce:transition-none",
  ].join(" "),

  toggle: [
    "inline-flex items-center gap-1.5",
    "rounded-full border border-transparent",
    "bg-transparent px-3 py-1.5",
    "text-xs font-medium",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "motion-reduce:transition-none",
  ].join(" "),

  toggleActive: [
    "text-plumb-mintHover",
    "hover:bg-plumb-mint/10",
    "dark:text-plumb-mintLight",
    "dark:hover:bg-plumb-mint/15",
  ].join(" "),

  toggleInactive: [
    "text-plumb-muted",
    "hover:bg-plumb-mint/10 hover:text-plumb-ink",
    "dark:text-plumb-darkMuted",
    "dark:hover:bg-plumb-mint/15 dark:hover:text-plumb-darkText",
  ].join(" "),
},
  sectionHeader: {
  container: [
    "mb-4",
    "border-b",
    "border-border-default",
    "pb-3",
  ].join(" "),

  layout: [
    "flex",
    "items-end",
    "justify-between",
    "gap-4",
  ].join(" "),

  content: "min-w-0",

  eyebrow: [
    "mb-1",
    "text-xs",
    "font-medium",
    "uppercase",
    "tracking-[0.12em]",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  title: [
    "font-serif",
    "text-2xl",
    "font-semibold",
    "leading-tight",
    "text-plumb-ink",
    "dark:text-plumb-darkText",
    "sm:text-3xl",
  ].join(" "),

  description: [
    "mt-1",
    "max-w-xl",
    "text-sm",
    "leading-relaxed",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  action: [
    "min-h-11",
    "shrink-0",
    "rounded-full",
    "px-2 dark:px-3 dark:py-3",
    "text-sm",
    "font-medium",
    "dark:border dark:text-plumb-mintLight dark:border-plumb-mintLight dark:border-1",
    "text-plumb-mint",
    "transition-colors",
    "hover:text-plumb-mintHover",
    "dark:hover:text-mintLight",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-mint",
    "focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),
},
  search: {
  page: [
    "min-h-full",
    "bg-plumb-surface",
    "dark:bg-plumb-dark-canvas",
    "text-plumb-text",
    "dark:text-plumb-darkText",
  ].join(" "),

  inner: [
    "mx-auto",
    "w-[100%]",
    "max-w-3xl",
    "px-4",
    "pb-28",
    "pt-6",
    "sm:px-6",
    "sm:pt-10",
    "lg:px-8",
    "lg:pb-16",
  ].join(" "),

  header: [
    "pb-5",
    "sm:pb-7",
  ].join(" "),

  title: [
    "mb-5",
    "font-serif",
    "text-3xl",
    "leading-tight",
    "text-plumb-ink",
    "dark:text-plumb-darkText",
    "sm:text-4xl",
  ].join(" "),

  searchWrap: [
    "w-[100%]",
    "overflow-hidden",
    "rounded-2xl",
 
    "bg-plumb-surface",
    "dark:bg-transparent",
    // "dark:bg-plumb-dark-surface",
    "transition-colors",
    "focus-within:border-plumb-mint",
    "focus-within:ring-2",
    "focus-within:ring-plumb-mint/20",
  ].join(" "),
searchbar: [

  "bg-plumb-elevated text-plumb-ink",
  "placeholder:text-plumb-muted",
  "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
  "dark:placeholder:text-plumb-darkMuted",
  "border border-plumb-borderStrong",
  "dark:border-plumb-darkBorderStrong",
  "focus-within:border-plumb-mint",
  "dark:focus-within:border-plumb-mintLight",
].join(" "),

  scopeRow: [
    "flex",
    "flex-wrap",
    "items-center",
    "gap-2",
    "py-4",
  ].join(" "),

  scopeLabel: [
    "mr-1",
    "text-xs",
    "font-medium",
    "uppercase",
    "tracking-wider",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  scopeButton: [
    "min-h-11",
    "rounded-full",
    "border",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "transition-colors",
    "duration-150",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-mint",
    "focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),

  scopeActive: [
    "border-plumb-mint",
    "bg-plumb-mint",
    "text-white",
    "dark:border-plumb-mint",
    "dark:bg-plumb-mint",
    "dark:text-white",
  ].join(" "),

  scopeInactive: [
    "border-border-default",
    "bg-transparent",
    "text-plumb-text",
    "hover:bg-plumb-mint/10",
    "dark:text-plumb-darkText",
    "dark:hover:bg-plumb-mint/10",
  ].join(" "),

  filterRow: [
    "flex",
    "w-[100%]",
    "gap-2",
    "overflow-x-auto",
    "overscroll-x-contain",
    "py-2",
    "pb-4",
    "[-webkit-overflow-scrolling:touch]",
    "[scrollbar-width:none]",
    "[&::-webkit-scrollbar]:hidden",
  ].join(" "),

  filter: [
    "min-h-10",
    "shrink-0",
    "rounded-full",
    "border",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "transition-colors",
    "duration-150",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-mint",
    "focus-visible:ring-offset-2",
    "dark:focus-visible:ring-offset-plumb-dark-canvas",
  ].join(" "),

  filterActive: [
    "border-plumb-mint",
    "bg-plumb-mint",
    "text-white",
  ].join(" "),

  filterInactive: [
    "border-border-default",
    "bg-transparent",
    "text-plumb-muted",
    "hover:border-plumb-mint",
    "hover:text-plumb-ink",
    "dark:text-plumb-darkSubtle",
    "dark:hover:text-plumb-darkText",
  ].join(" "),

  section: [
    "pt-5",
    "sm:pt-7",
  ].join(" "),

  sectionTitle: [
    "mb-3",
    "text-xs",
    "font-semibold",
    "uppercase",
    "tracking-[0.12em]",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  results: [
    "divide-y ",
    "divide-border-default",
  ].join(" "),


  result: [
    "dark:bg-base-bg dark:border-1 my-4 px-8 dark:hover:bg-plumb-mint/40 rounded-full dark:border dark:border-plumb-mintLight rounded-full",
    "block",
    "w-[100%]",
  
  
    "py-2",
    "text-left",
    "transition-colors",
    "duration-150",
    "hover:bg-plumb-mint/5",
    "active:bg-plumb-mint/10",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-inset",
    "focus-visible:ring-plumb-mint",
    // "sm:px-4",
  ].join(" "),

  resultTitle: [
    "font-serif",
    "text-lg",
    "leading-snug",
    "font-medium",
    "text-plumb-ink",
    "dark:text-plumb-darkText",
    "break-words",
  ].join(" "),

  resultMeta: [
    "mt-1",
    "text-xs",
    "font-medium",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  resultDescription: [
    "mt-2",
    "line-clamp-2",
    "text-sm",
    "leading-relaxed",
    "text-plumb-text",
    "dark:text-plumb-darkText",
    "opacity-80",
  ].join(" "),

  empty: [
    "px-3",
    "py-12",
    "text-center",
    "sm:py-16",
  ].join(" "),

  emptyTitle: [
    "font-serif",
    "text-xl",
    "text-plumb-ink",
    "dark:text-plumb-darkText",
  ].join(" "),

  emptyText: [
    "mx-auto",
    "mt-2",
    "max-w-md",
    "text-sm",
    "leading-relaxed",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  loading: [
    "py-10",
    "text-center",
    "text-sm",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  error: [
    "py-10",
    "text-center",
    "text-sm",
    "text-plumb-muted",
    "dark:text-plumb-darkSubtle",
  ].join(" "),

  retry: [
    "mt-3",
    "min-h-11",
    "rounded-full",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "text-plumb-mint",
    "underline",
    "underline-offset-4",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-mint",
  ].join(" "),
},
profile: {

mine: {
  about: {
  content: `space-y-6 mx-4`,
  bio: `text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted`,
  location: `text-sm text-plumb-muted dark:text-plumb-darkMuted`,
  locationLoading: `mt-1 h-4 w-32 rounded motion-safe:animate-pulse`,
  interestsLabel: `text-xs uppercase tracking-[0.08em] text-plumb-subtle dark:text-plumb-darkSubtle`,
  pillList: `mt-2 flex flex-wrap gap-2`,
},
  details: {
  content: `mt-6 max-w-[48rem]`,
  group: `mt-10`,
  groupLabel: `text-xs uppercase tracking-[0.08em] text-plumb-subtle dark:text-plumb-darkSubtle`,
  pillList: `mt-3 flex flex-wrap gap-2`,
  communityPill: `border-plumb-blueSea bg-transparent dark:border-plumb-softBlue/60`,
},
  page: `
    mx-auto w-[100%] max-w-[76rem]
    px-6 pb-20 pt-16
    dark:bg-plumb-dark-canvas
  
    sm:px-10 lg:px-12 flex flex-col items-center
  `,

  header: `
    flex flex-col px-4 max-w-4xl mx-auto
    sm:flex-row sm:items-center 
  `,

  name: `
    font-serif text-[2.5rem] leading-tight
    text-plumb-ink dark:text-plumb-darkText
    sm:text-[3rem]
  `,

  username: `
    mt-1 text-sm
    text-plumb-muted dark:text-plumb-darkMuted
  `,

  sections: `
    mt-10 
    max-w-[98vw]
    overflow-visible
   
  `,

  content: `
    mt-10 w-[100%] max-w-3xl mx-auto
  `,

  sectionHeader: `
    flex flex-col gap-5
    border-b border-plumb-border
    pb-5
    dark:border-plumb-darkBorder
    sm:flex-row sm:items-end sm:justify-between
  `,

  sectionTitle: `
    font-serif text-2xl
    text-plumb-ink dark:text-plumb-darkText
  `,

  sectionDescription: `
    mt-1 text-sm
    text-plumb-muted dark:text-plumb-darkMuted
  `,

  search: `
    w-[100%] rounded-full border
    border-plumb-border
    bg-transparent
    px-4 py-2
       min-h-[48px]
        text-base
     text-plumb-ink
    placeholder:text-plumb-subtle
    outline-none
    transition-colors
    focus:border-plumb-mint
    focus:ring-2 focus:ring-plumb-focus/40
    dark:border-plumb-darkBorder
    dark:text-plumb-darkText
    dark:placeholder:text-plumb-darkSubtle
    dark:focus:border-plumb-mintLight
    dark:focus:ring-plumb-mintLight/30
    sm:max-w-[18rem]
  `,

  collectionItem: `
    group w-[100%]
    border
    border-plumb-border
    bg-transparent
    px-3 py-5
    text-left
    transition-colors duration-200
    hover:border-plumb-mint
    hover:bg-plumb-mint/5
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-plumb-focus
    focus-visible:ring-offset-2
    focus-visible:ring-offset-plumb-canvas
    dark:border-plumb-darkBorder
    dark:hover:border-plumb-mintLight
    dark:hover:bg-plumb-mintLight/10
    dark:focus-visible:ring-plumb-mintLight
    dark:focus-visible:ring-offset-plumb-dark-canvas
    sm:px-4
  `,

  type: `
    text-[0.68rem] uppercase tracking-[0.12em]
    text-plumb-subtle
    dark:text-plumb-darkSubtle
  `,

  role: `
    text-[0.68rem] font-medium uppercase tracking-[0.12em]
    text-plumb-mint
    dark:text-plumb-mintLight
  `,

  title: `
    text-plumb-ink dark:text-plumb-darkText
  `,

  purpose: `
    mt-1.5 max-w-[42rem]
    line-clamp-2
    font-serif text-sm leading-relaxed
    text-plumb-muted dark:text-plumb-darkMuted
  `,

  meta: `
    mt-4 flex flex-wrap items-center
    gap-x-3 gap-y-1.5
  `,

  metaText: `
    text-xs font-medium
    text-plumb-muted dark:text-plumb-darkMuted
  `,

  metaSecondary: `
    text-xs
    text-plumb-subtle dark:text-plumb-darkSubtle
  `,

  storyTag: `
    max-w-[14rem] truncate
    rounded-full border
    border-plumb-border
    bg-plumb-surface
    px-3 py-1.5
    text-xs text-plumb-muted
    dark:border-plumb-darkBorder
    dark:bg-plumb-dark-surface
    dark:text-plumb-darkMuted
  `,

  activity: `
    mt-4 text-xs
    text-plumb-subtle dark:text-plumb-darkSubtle
  `,

  arrow: `
    shrink-0 pt-1
    text-lg leading-none
    text-plumb-subtle
    transition-transform transition-colors duration-200
    group-hover:translate-x-1
    group-hover:text-plumb-mint
    dark:text-plumb-darkSubtle
    dark:group-hover:text-plumb-mintLight
  `,

  updated: `
    block h-2 w-2 rounded-full
    bg-plumb-mint
    
    dark:bg-plumb-mintLight
  `,

  hashtagLabel: `
    text-xs uppercase tracking-[0.08em]
    text-plumb-subtle dark:text-plumb-darkSubtle
  `,

  emptyTitle: `
    font-serif text-2xl
    text-plumb-mint
    dark:text-plumb-mintLight
  `,

  emptyText: `
    mt-3 text-sm leading-relaxed
    text-plumb-muted dark:text-plumb-darkMuted
  `,

  emptyButton: `
    mt-6
  `,
},

    portfolio: {
       section: `
    w-[100%]
  `,

  header: `
    flex flex-col gap-5
  
    pb-5

    sm:flex-row
    sm:items-end
    sm:justify-between
  `,


  searchInput: `
    w-full 
    bg-transparent
    px-4 py-2.5
    text-sm
    text-plumb-ink
    placeholder:text-plumb-subtle
    outline-none
    transition-colors
   
    focus:ring-2
    focus:ring-plumb-focus/40

    dark:text-plumb-darkText
    dark:placeholder:text-plumb-darkSubtle
 
    sm:max-w-[18rem]
  `,

  list: `
    mt-6
  `,

  article: `


  `,

  storyList: `
 
    list-none
    divide-y
`,
 
  storyRow: [
    "w-[100%]   ",
 
    ].join(" "),

  storyButton: `

    group
    flex w-[100%]
    min-h-12
  
    bg-transparent
    py-4
    text-left
    text-plumb-ink
    transition-colors
    hover:text-plumb-mint


  
  
 
  `,

  storyContent: [`
    min-w-0 flex-1`,
  
].join(" "),

  storyTitle: `
    font-medium
    underline-offset-4
    group-hover:underline
    group-focus-visible:underline
  `,

  storyDescription: `
    mt-1
    text-sm leading-relaxed
    text-plumb-muted
    dark:text-plumb-darkMuted
  `,

  arrow: `
    shrink-0
    text-lg
    leading-none
    text-plumb-subtle
    transition-transform
    duration-200
    group-hover:translate-x-1
    group-hover:text-plumb-mint
    dark:text-plumb-darkSubtle
    dark:group-hover:text-plumb-mintLight
  `,




},
  page: [
    "mx-auto  ",
    "px-4 sm:px-5",
    "pt-safe pb-24",
    "bg-plumb-surface dark:bg-plumb-dark-canvas",
    " text-plumb-text",
    " dark:text-plumb-darkText",
  ].join(" "),

  content: "space-y-8 sm:space-y-10 max-w-2xl mx-auto",

  header: "space-y-5 py-6 sm:space-y-6 sm:py-8 px-4 max-w-4xl mx-auto",

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

pill: {
  container: [
    "group flex w-[100%] min-w-0",
    "items-center justify-between gap-3",
    "min-h-12 px-4 py-3",
    "rounded-full",
    "border border-plumb-borderStrong/50",
    "bg-transparent",
    "text-left",
    "transition-all duration-200",
    "hover:border-plumb-mintHover",
    "hover:bg-plumb-mint/5",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-plumb-focus/40",
    "dark:border-plumb-darkBorderStrong",
    "dark:hover:border-plumb-mintLight",
    "dark:hover:bg-plumb-mint/10",
    "motion-reduce:transition-none",
  ].join(" "),

  title: [
    "min-w-0 break-words",
    "font-serif text-base leading-snug",
    "text-plumb-ink",
    "transition-colors duration-150",
    "group-hover:text-plumb-mintHover",
    "dark:text-plumb-darkText",
    "dark:group-hover:text-plumb-mintLight",
  ].join(" "),

  arrow: [
    "shrink-0 text-lg leading-none",
    "text-plumb-muted",
    "transition-transform duration-200",
    "group-hover:translate-x-1",
    "group-hover:text-plumb-mintHover",
    "dark:text-plumb-darkMuted",
    "dark:group-hover:text-plumb-mintLight",
  ].join(" "),
},

  stats: "flex flex-wrap items-center gap-x-8 gap-y-4",

  stat: "flex min-w-[4rem] flex-col items-center text-center",

  statValue: "font-semibold text-plumb-ink dark:text-plumb-darkText",

  statLabel: "text-xs text-plumb-muted dark:text-plumb-darkMuted",

  searchRow: [
    "flex flex-col gap-2 max-w-2xl  mx-auto py-5",
    "sm:flex-row sm:items-center",
  ].join(" "),

  search: [
    " flex-1 rounded-full border mx-4 px-4 py-3",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-sm text-plumb-text placeholder:text-plumb-muted",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText dark:placeholder:text-plumb-darkMuted",
  ].join(" "),

  actions: "flex min-w-0 items-center gap-3",

  menuButton: [
    "inline-flex h-10 w-10 shrink-0items-center  justify-center",
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
  page: `
    ${shared.page.surface}
    overflow-y-auto pb-20
  `,

  section: shared.surface.border,

  card: `
    ${shared.surface.card}
    p-5
    transition-all duration-200
    hover:-translate-y-0.5
    hover:border-plumb-mintHover
    dark:hover:border-plumb-mintLight
    motion-reduce:transform-none
    motion-reduce:transition-none
  `,

  heading: `
    ${shared.text.heading}
    text-2xl sm:text-3xl
  `,

  body: `
    font-open-sans text-base leading-relaxed
    text-plumb-text dark:text-plumb-darkText
  `,

  muted: shared.text.body,

  empty: `
    ${shared.surface.empty}
    p-8 text-center
  `,

  skeleton: `
    animate-pulse rounded-2xl
    bg-plumb-border dark:bg-plumb-dark-surface
    motion-reduce:animate-none
  `,
},

navbar: {
  header:  [
  "fixed top-0 left-0 right-0 z-[100]",
  "flex flex-row items-center justify-between",
  "w-[100%] box-border",
  "px-[4%]",
  "min-h-[calc(3.5rem+env(safe-area-inset-top,0px))]",
  "pt-[env(safe-area-inset-top,0px)]",
  "bg-plumb-mintHover dark:bg-plumb-dark-surface",
  "border-b border-plumb-mint dark:border-plumb-darkBorder",
].join(" "),
  desktop: [
    "w-[100%] pl-4 min-h-20",
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
  
  ].join(" "),

  wordmark: [
    "text-base",
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
    "py-4",
    "min-h-30",
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
 "my-auto mx-auto flex-1 font-open-sans",
    // "mx-auto items-center text-base",



    "min-w-[3em]",
    // "leading-none",
    "text-center",
    // "tracking-[-0.02em]",
    "text-plumb-darkText bg-transparent dark:text-plumb-surface",

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
  "flex flex-row justify-between px-4",
  "top-0",
  "left-0",
  "right-0",
  "z-[100]",
  "w-[100%]",
  "box-border",
   "bg-plumb-mintHover dark:bg-plumb-dark-surface",
  "border-b border-plumb-mint dark:border-plumb-darkBorder",
  "pt-[env(safe-area-inset-top,0px)]",
  
  "border-b",
  "border-border-default",
].join(" "),

mobileNativeInner: [
  "flex flex-row",
  "w-[86%]",
  "mx-auto",
  "min-h-14",
  "justify-between",
  "",
].join(" "),

mobileNativeWordmark: [
  "bg-transparent",
 
  "font-semibold",
  "tracking-tight",
"text-plumb-darkText dark:text-plumb-mintLight",
  "transition-colors",
  "hover:text-plumb-mint",
  "dark:hover:text-mintLight",
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-plumb-mint",
  "rounded-md",
].join(" "),

mobileNativeItem:" px-2 font-serif  text-plumb-surface my-auto  text-base bg-transparent",

  mobileNativeItemActive: [
    "text-white",
    "font-medium",
  ].join(" "),
},
importWork: {
  section: "mt-16 max-w-3xl",

  intro: "mb-5",

  label: shared.text.eyebrow,

  description: `
    mt-2 max-w-xl
    font-lora text-base leading-relaxed
    text-plumb-text dark:text-plumb-darkText
  `,

  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",

  card: `
    group ${shared.surface.card}
    min-h-[150px] p-6 text-left
    ${shared.interaction.transition}
    hover:-translate-y-0.5
    hover:border-plumb-mintHover
    hover:bg-plumb-surface
    dark:hover:border-plumb-mintLight
    dark:hover:bg-plumb-dark-canvas
    ${shared.interaction.focus}
    focus-visible:ring-offset-plumb-paper
    dark:focus-visible:ring-offset-plumb-dark-canvas
    ${shared.interaction.reducedMotion}
  `,

  cardTitle: `
    ${shared.text.heading}
    text-xl font-semibold
  `,

  cardDescription: `
    ${shared.text.body}
    mt-2 max-w-sm
  `,
},

  about: {
    

  inner: [
    "mx-auto h-full overflow-auto w-[100%]",
   "bg-plumb-surface dark:bg-plumb-dark-canvas",
    " lg:px-24",
  ].join(" "),

  eyebrow: [
    "mb-4 font-open-sans text-xs font-medium",
    "uppercase tracking-widest",
    "text-plumb-muted dark:bg-plumb-dark-canvas dark:text-plumb-darkMuted",
  ].join(" "),

  welcome: [
    "mb-6 py-4 font-serif font-bold",
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
       "bg-transparent ",
    "pt-6 dark:border-plumb-darkBorderStrong",
  ].join(" "),

  sectionLabel: [
    "mb-3 font-open-sans text-xs font-medium",
    "uppercase tracking-widest",
       "",
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
roomPreview: {
  card: `group flex h-full min-h-[12em] w-[100%] border dark:border-1 dark:border-plumb-darkText flex-col rounded-xl border border-plumb-border bg-plumb-elevated p-5 text-left shadow-sm transition-colors duration-200 hover:border-plumb-mint/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2 focus-visible:ring-offset-plumb-canvas dark:border-plumb-darkBorder dark:bg-plumb-dark-elevated dark:hover:border-plumb-mintLight/70 dark:focus-visible:ring-plumb-mintLight dark:focus-visible:ring-offset-plumb-dark-canvas`,
  type: `mb-3 text-[0.68rem] uppercase tracking-[0.16em] text-plumb-blueSea dark:text-plumb-softBlue`,
  title: `min-w-0 flex-1 font-serif text-xl leading-snug text-plumb-ink transition-colors group-hover:text-plumb-mint dark:text-plumb-darkText dark:group-hover:text-plumb-mintLight`,
  arrow: `shrink-0 pt-0.5 text-lg text-plumb-muted transition-transform group-hover:translate-x-0.5 group-hover:text-plumb-mint dark:text-plumb-darkMuted dark:group-hover:text-plumb-mintLight motion-reduce:transform-none`,
  purpose: `mt-4 line-clamp-3 text-sm leading-relaxed text-plumb-muted dark:text-plumb-darkMuted`,
  meta: `mt-6 flex min-h-5 flex-wrap items-center gap-x-4 gap-y-1 border-t border-plumb-border/70 pt-4 text-xs text-plumb-muted dark:border-plumb-darkBorder dark:text-plumb-darkMuted`,
},
page: {
  listItem: `my-2 min-w-0`,
  pillButton: `group flex w-[100%] min-h-12 items-center gap-3 rounded-full border px-4 py-3 text-left shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plumb-focus focus-visible:ring-offset-2 focus-visible:ring-offset-plumb-canvas dark:focus-visible:ring-plumb-mintLight dark:focus-visible:ring-offset-plumb-dark-canvas`,
  pillCollection: `border-plumb-blueSea/50 bg-plumb-blueSea/5 hover:border-plumb-blueSea hover:bg-plumb-blueSea/10 dark:border-plumb-softBlue/40 dark:bg-plumb-softBlue/5 dark:hover:border-plumb-softBlue dark:hover:bg-plumb-softBlue/10`,
  pillPage: `border-plumb-mint/50 bg-plumb-mint/5 hover:border-plumb-mint hover:bg-plumb-mint/10 dark:border-plumb-mintLight/40 dark:bg-plumb-mintLight/5 dark:hover:border-plumb-mintLight dark:hover:bg-plumb-mintLight/10`,
  pillType: `shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.12em]`,
  pillCollectionType: `text-plumb-blueSea dark:text-plumb-softBlue`,
  pillPageType: `text-plumb-mint dark:text-plumb-mintLight`,
  pillTitle: `min-w-0 truncate text-sm font-medium text-plumb-ink dark:text-plumb-darkText`,
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
  label:["text-plumb-ink dark:text-plumb-darkText"].join(" "),
  subLabel:["text-plumb-seaBlue",
" font-semibold font-open-sans dark:text-plumb-surface   "


  ].join(" "),
  
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
    "font-serif font-semibold text-[1.2rem] mx-4 text-base",
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

pill: {
  container: "my-4 px-4 max-w-3xl mx-auto flex flex-row justify-center overflow-x-scroll",
  wrapper: [
  "flex w-max  gap-1 items-center justify-start",
  "overflow-x-scroll overflow-x-contain",

  "[scrollbar-width:none]",
  "[&::-webkit-scrollbar]:hidden",
].join(" "),

  button: `
    shrink-0 whitespace-nowrap rounded-full px-6 py-2
    transition-colors duration-200 sm:text-sm
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-plumb-focus focus-visible:ring-offset-2
    focus-visible:ring-offset-plumb-canvas
    dark:focus-visible:ring-plumb-mintLight
    dark:focus-visible:ring-offset-plumb-dark-canvas
  `,
  active: `bg-plumb-mint text-plumb-darkText shadow-sm dark:bg-plumb-mintLight dark:text-plumb-ink`,
  inactive: `text-plumb-muted bg-plumb-canvas hover:text-plumb-ink dark:text-plumb-darkMuted dark:hover:text-plumb-darkText`,
},


 
  container: ["mt-4  flex flex-col items-center ",].join(" "),
  list: {
    container: [
      "divide-y",
      "text-center",
      "divide-plumb-border",
      "dark:divide-plumb-darkBorder",
      "border",
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
      "p-8 font-serif",
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
    "bg-plumb-mint text-plumb-paper",
    "hover:bg-plumb-mintHover",
    "dark:bg-plumb-dark-surface dark:text-plumb-darkText",
    "dark:hover:bg-plumb-dark-surface",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
  ].join(" "),
},



// input: [
//   "w-[100%] max-w-sm",
//   " bg-plumb-canvas  dark:bg-plumb-darkCanvas border border-1 border-plumb-mintLight/30",


//   "text-plumb-ink  dark:text-plumb-darkText rounded-2xl",
//   "px-4 py-3",
//   "placeholder:text-plumb-muted",
//   "dark:border-plumb-darkBorderStrong",
//   "",
//   "dark:placeholder:text-plumb-darkMuted",
//   "focus:outline-none",
//   "focus-visible:ring-2",
//   "focus-visible:ring-plumb-focus",
//   "focus-visible:ring-offset-2",
//   "focus-visible:ring-offset-paper",
//   "dark:focus-visible:ring-offset-plumb-dark-canvas",
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
,
dashboardItem: {
  titleButton: [
    "block w-fit font-serif  bg-transparent max-w-full rounded-md text-left",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
  ].join(" "),
  continue: [
    "mx-3",
    "mt-3 inline-flex min-h-10 items-center gap-1.5",
    "rounded-full px-3 py-2",
    "font-open-sans text-sm font-medium",
    "text-plumb-muted dark:text-plumb-darkMuted",
"bg-transparent ",
    "transition-colors duration-150",
    "hover:bg-plumb-mint/10 dark:hover:bg-plumb-mint/15",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-plumb-focus focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
    "motion-reduce:transition-none",
  ].join(" "),

  action: [
        "bg-transparent mx-2",
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
  card: [
    "group",
    "w-[100%]",
    "cursor-pointer",
    "select-none",
    "overflow-hidden",
    "rounded-3xl",
    "border",
    "border-plumb-borderStrong",
    "bg-plumb-surface",
    "text-plumb-text",
    "transition-all",
    "duration-200",
    "active:scale-[0.985]",
    "hover:border-plumb-mintHover",
    "md:hover:-translate-y-0.5",
    "md:hover:shadow-md",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText",
    "dark:hover:border-plumb-mintLight",
    "focus-within:ring-2",
    "focus-within:ring-plumb-focus",
    "focus-within:ring-offset-2",
    "focus-within:ring-offset-plumb-surface",
    "dark:focus-within:ring-offset-plumb-dark-surface",
    "motion-reduce:transform-none",
    "motion-reduce:transition-none",
  ].join(" "),

  header: [
    "px-5 pb-3 pt-5",
    "sm:px-6 sm:pt-6 flex flex-row justify-between",
  ].join(" "),

  author: [
    "flex min-w-0 items-center gap-3",
  ].join(" "),

  authorName: [
    "truncate text-sm  bg-transparent font-medium",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  authorType: [
    "mt-0.5 text-xs",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  bookmark: [
    "flex h-9 w-9 shrink-0 items-center justify-center",
    "rounded-full",
    "bg-transparent ",
    "transition-colors duration-150",
    "hover:bg-plumb-mint/20",
    "active:scale-90",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "dark:bg-plumb-mint/15",
    "dark:hover:bg-plumb-mint/25",
    "motion-reduce:transform-none",
  ].join(" "),

  titleContent: [
    "px-5     pb-5",
    "sm:px-6",
  ].join(" "),

  title: [
    "font-serif",
        "text-[1.2rem]",
    "font-medium",
    "leading-[1.08]",
    "tracking-[-0.015em]",
    "text-plumb-ink dark:text-plumb-darkText",
    "transition-colors duration-150",
    "group-hover:text-plumb-mintHover",
    "dark:group-hover:text-plumb-mintLight",
  ].join(" "),

  description: [
    "mt-3 max-w-2xl",
    "text-sm leading-6",
    "text-plumb-text dark:text-plumb-darkText",
  ].join(" "),

  stories: [
    "px-4 pb-4",
    "sm:px-5",
  ].join(" "),

  storyWindow: [
    "overflow-hidden rounded-2xl border",
    "border-plumb-borderStrong",
    "bg-plumb-surface",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-canvas",
  ].join(" "),

  footer: [
    "flex items-center justify-between",
    "border-t",
    "border-plumb-borderStrong",
    "px-5 py-4",
    "sm:px-6",
    "dark:border-plumb-darkBorderStrong",
  ].join(" "),

  metadata: [
    "text-xs",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  separator: [
    "text-xs",
    "text-plumb-muted/40",
    "dark:text-plumb-darkMuted/40",
  ].join(" "),

  arrow: [
    "text-lg",
    "text-plumb-muted dark:text-plumb-darkMuted",
    "transition-transform duration-200",
    "group-hover:translate-x-1",
  ].join(" "),

  skeleton: [
    "h-48 w-[100%] animate-pulse rounded-2xl",
    "border border-plumb-borderStrong",
    "bg-plumb-mint/5",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-dark-surface",
    "motion-reduce:animate-none",
  ].join(" "),
},


 settingRow: {
  container: [
    "flex items-start justify-between gap-5",
    "rounded-2xl border px-4 py-4",
    "border-plumb-borderStrong bg-plumb-paper",
    "text-plumb-text",
    "dark:border-plumb-darkBorderStrong dark:bg-plumb-dark-surface",
    "dark:text-plumb-darkText",
    "transition-colors duration-150",
    "motion-reduce:transition-none",
  ].join(" "),

  content: "min-w-0",

  label: [
    "text-sm font-medium",
    "text-plumb-ink dark:text-plumb-darkText",
  ].join(" "),

  description: [
    "mt-1 max-w-xl",
    "text-xs leading-5",
    "text-plumb-muted dark:text-plumb-darkMuted",
  ].join(" "),

  switch: [
    "relative mt-0.5 inline-flex shrink-0",
    "min-h-11 min-w-11",
    "cursor-pointer items-center justify-center",
    "rounded-full",
    "focus-within:outline-none",
    "focus-within:ring-2 focus-within:ring-plumb-focus",
    "focus-within:ring-offset-2",
    "focus-within:ring-offset-plumb-paper",
    "dark:focus-within:ring-offset-plumb-dark-surface",
  ].join(" "),

  input: "peer sr-only",

  track: [
    "relative block h-6 w-11 rounded-full border",
    "border-plumb-borderStrong",
    "bg-plumb-border",
    "transition-colors duration-150",
    "peer-checked:border-plumb-mintHover",
    "peer-checked:bg-plumb-mintHover",
    "dark:border-plumb-darkBorderStrong",
    "dark:bg-plumb-darkBorder",
    "dark:peer-checked:border-plumb-mintLight",
    "dark:peer-checked:bg-plumb-mintLight",
    "motion-reduce:transition-none",
  ].join(" "),

  thumb: [
    "pointer-events-none absolute left-1 top-1",
    "h-4 w-4 rounded-full",
    "bg-white shadow-sm",
    "transition-transform duration-150",
    "peer-checked:translate-x-5",
    "motion-reduce:transition-none",
  ].join(" "),
},
pill: {
  base: `inline-flex   items-center gap-2 rounded-full py-2 text-sm px-6 font-bold 
duration-200`,
  //  transition-[transform,background-color,border-color,color,box-shadow] 
  interactive:[    
         
    `cursor-pointer hover:-translate-y-0.5
   active:translate-y-0 focus-visible:outline-none
text-plumb-mint
    dark:focus-visible:ring-plumb-mintLight dark:focus-visible:ring-offset-plumb-dark-canvas`,
  "   text-plumb-mint hover:bg-plumb-mintLight focus:bg-plumb-mintLight"].join(" "),

  default: `border border-plumb-mint/30  text-plumb-mint hover:border-plumb-mint  dark:border-plumb-mintLight/30
  dark:text-plumb-mintLight dark:hover:border-plumb-mintLight 
`,

  static: `border border-plumb-border  text-plumb-muted dark:border-plumb-darkBorder dark:text-plumb-darkMuted`,
  icon: `h-4 w-4 shrink-0 object-contain`,
}
}
export {shared}
export default styles


