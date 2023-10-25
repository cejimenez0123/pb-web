import { createBrowserHistory } from 'history'
const history = createBrowserHistory({forceRefresh:true})
history.listen((location, action) => {
    // console.log("inside history listen");
})
export default history