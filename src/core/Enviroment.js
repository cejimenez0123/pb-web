

let url = import.meta.env.VITE_URL
if(import.meta.env.VITE_NODE_ENV=="dev"){
    url = import.meta.env.VITE_DEV_URL
    console.log("NODE_ENV:",import.meta.env.VITE_NODE_ENV)
}
const Enviroment = {
    proxyUrl:import.meta.env.VITE_PROXY_URL,
    url:url

}

export default Enviroment