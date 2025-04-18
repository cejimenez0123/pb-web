

let url = import.meta.env.VITE_URL
import Story from "../domain/models/page"
if(import.meta.env.VITE_NODE_ENV=="dev"){
    url = import.meta.env.VITE_DEV_URL
    console.log("NODE_ENV:",import.meta.env.VITE_NODE_ENV)
}
const Enviroment = {
    proxyUrl:import.meta.env.VITE_PROXY_URL,
    url:url,
    domain:"https://plumbum.app",
    logoChem:"https://drive.usercontent.google.com/download?id=14zH7qNt2xRFE45nukc3NIhLgtMtaSC0O",
    blankPage: new Story("","recommedations","recommendations"),
    blankProfile:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"

}

export default Enviroment