const styles = {
  text: {
    heading: "text-plumb-ink dark:text-plumb-darkText",
    body: "text-plumb-text dark:text-plumb-darkText",
    muted: "text-plumb-muted dark:text-plumb-darkMuted",
    subtle: "text-plumb-subtle dark:text-plumb-darkSubtle",
  },
  tabs: {
  container: [
    "sticky",
    "top-0",
    "z-10",
    "bg-plumb-surface/95",
    "dark:bg-plumb-dark-surface/95",
    "backdrop-blur",
  ].join(" "),

  wrapper: [
    "flex",
    "gap-6",
    "overflow-x-auto",
    
  ].join(" "),
list: {
container: [
"divide-y",
"divide-plumb-border",
"dark:divide-plumb-darkBorder",
"border-y",
"border-plumb-border",
"dark:border-plumb-darkBorder",
].join(" "),

item: [
"w-[100%]",
"my-2",
"px-4 sm:px-6",
"rounded-2xl",
"py-4",
"flex",
"items-center",
"justify-between",
"gap-4",
"text-left",
"transition-colors",
"hover:bg-plumb-mint/5",
"dark:hover:bg-plumb-mint/10",
"focus-visible:outline-none",
"focus-visible:ring-2",
"focus-visible:ring-plumb-focus",
].join(" "),

metadata: [
"shrink-0",
"text-xs",
"capitalize",
"font-medium",
"text-plumb-muted",
"dark:text-plumb-darkMuted",
].join(" "),
},

  tab: [
    "text-center",
    "relative",
    "min-h-11",
    "shrink-0",
    "px-3",
    "py-4",
    "text-sm",
    "font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-plumb-focus",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-plumb-surface",
    "dark:focus-visible:ring-offset-plumb-dark-surface",
  ].join(" "),

  active: [
    "text-plumb-mint",
    "dark:text-plumb-mintLight",
    "after:absolute",
    "after:inset-x-0",
    "after:bottom-0",
    "after:h-0.5",
    "after:rounded-full",
    "after:bg-plumb-mint",
    "dark:after:bg-plumb-mintLight",
  ].join(" "),

  inactive: [
    "text-plumb-muted",
    "hover:text-plumb-ink",
    "dark:text-plumb-darkMuted",
    "dark:hover:text-plumb-darkText",
  ].join(" "),
},
button: {
  // Shared physical behavior only.
  // base: [
  //       "rounded-full",
  //   "inline-flex items-center justify-center",
  //   "rounded-full",
  //   "font-medium",
  //   "transition-colors",
  //   "focus-visible:outline-none",
  //   "focus-visible:ring-2",
  //   "focus-visible:ring-plumb-focus",
  //   "focus-visible:ring-offset-2",
  //   "active:scale-[0.98]",
  //   "disabled:cursor-not-allowed",
  //   "disabled:opacity-50",
  // ].join(" "),
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
"bg-plumb-mint",
"text-white",
"shadow-sm",
"hover:bg-plumb-mintHover",
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