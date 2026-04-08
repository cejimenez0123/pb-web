

let url = import.meta.env.VITE_URL
let redirectUrl = import.meta.env.VITE_REDIRECT_URL
const isDev =import.meta.env.VITE_NODE_ENV=="dev"
if(isDev){
 
    url = "http://localhost:8888"??import.meta.env.VITE_DEV_URL
    redirectUrl = import.meta.env.VITE_DEV_REDIRECT_URL
   
}

console.log("URL",url)
const Enviroment = {
    proxyUrl:import.meta.env.VITE_PROXY_URL,
    redirectUrl:import.meta.env.VITE_REDIRECT_URI,
    imageProxy:(path)=>`${url}/image?path=${encodeURIComponent(path)}`,
    url:url,
    domain:isDev?"http://localhost:5173":"https://plumbum.app",
    logoChem:"https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O",
    blankPage:{title:"",author:"",authorId:""},
    blankProfile:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
     "palette": {
        "cream":"#f4f4e0","soft":"#40906f",
    "base": {
      "background": "#f4f4e0", // App background (main canvas, warm cream)
      "surface": "#ffffff", // Cards, modals, sheets (elevated surfaces)
      "soft": "#40906f" // Brand base tone (used for highlights, accents)
    },

    "text": {
      "primary": "#1f2937", // Main readable text (titles, body)
      "secondary": "#6b7280", // Subtext, metadata, timestamps
      "inverse": "#ffffff", // Text on dark buttons/backgrounds
      "brand": "#40906f" // Links, emphasized brand text
    },

    "button": {
      "primary": {
        "bg": "#40906f", // Main CTA (Save, Add, Publish)
        "text": "#ffffff", // Text on primary button
        "hover": "#347a5e" // Hover/pressed state
      },
      "secondary": {
        "bg": "#0097b2", // Secondary actions (View, Navigate)
        "text": "#ffffff",
        "hover": "#007c92"
      },
      "accent": {
        "bg": "#ffde59", // Highlight actions (Explore, Discover)
        "text": "#1f2937",
        "hover": "#e6c94f"
      },
      "danger": {
        "bg": "#d62d15", // Destructive actions (Delete)
        "text": "#ffffff",
        "hover": "#b62511"
      }
    },

    "card": {
      "background": "#ffffff", // Card background
      "border": "#e5e7eb", // Subtle card border
      "highlight": "#7ed957" // Selected/active card accent
    },

    "border": {
      "default": "#e5e7eb", // Standard borders/dividers
      "soft": "#d1d5db", // Lighter borders (inputs, subtle UI)
      "focus": "#40906f" // Focus state (inputs, selected elements)
    },

    "shadow": {
      "sm": "rgba(0,0,0,0.05)", // Small cards
      "md": "rgba(0,0,0,0.08)", // Floating elements
      "lg": "rgba(0,0,0,0.12)" // Modals, overlays
    },

    "accent": {
      "blue": "#0097b2", // Navigation, links, secondary emphasis
      "purple": "#9b67b6", // Depth, hierarchy, creative elements
      "pink": "#e96fbd", // Emotional highlights, reactions
      "orange": "#f85e30" // Energy, alerts, strong emphasis
    },

    "tag": {
      "green": "#7ed957", // Positive tags, growth, success
      "blue": "#598ec8", // Informational tags
      "purple": "#a9a1d4", // Creative categories
      "earth": "#c28558" // Grounded, neutral tags
    },

    "states": {
      "success": "#7ed957", // Success messages, confirmations
      "warning": "#ff914d", // Warnings, caution states
      "error": "#d62d15", // Errors, destructive feedback
      "info": "#0097b2" // Informational messages
    }
  }

}

export default Enviroment