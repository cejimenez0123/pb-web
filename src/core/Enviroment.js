

let url = import.meta.env.VITE_URL
let redirectUrl = import.meta.env.VITE_REDIRECT_URL

if(import.meta.env.VITE_NODE_ENV=="dev"){
 
    url = import.meta.env.VITE_DEV_URL
    redirectUrl = import.meta.env.VITE_DEV_REDIRECT_URL
   
}
console.log("INUSE",url)

const Enviroment = {
    proxyUrl:import.meta.env.VITE_PROXY_URL,
    redirectUrl:import.meta.env.VITE_REDIRECT_URI,
    imageProxy:(path)=>`${url}/image?path=${encodeURIComponent(path)}`,
    url:url,
    domain:"https://plumbum.app",
    logoChem:"https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O",
    blankPage:{title:"",author:"",authorId:""},
    blankProfile:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    palette:{
        cream:"#f8f6f1",
        soft:"#40906f"
    }
}

export default Enviroment