import { createBrowserHistory } from 'history'
const history = createBrowserHistory({forceRefresh:true})
history.listen((location, action) => {
   
})
export default history