

let url = import.meta.env.VITE_URL
if(import.meta.env.VITE_NODE_ENV=="dev"){
    url = import.meta.env.VITE_DEV_URL
}
const Enviroment = {
    proxyUrl:import.meta.env.VITE_PROXY_URL,
    url:import.meta.env.VITE_URL

}

export default Enviroment