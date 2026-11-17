import { create } from "lodash";
import { PageType } from "./constants";



const Paths ={
    search:"/search",
    terms:"/terms",
    newsletter:()=>`/newsletter`,
    feedback:()=>`/feedback`,
    links:()=>`/links`,
    calendar:()=>"/events",
    dashboard:"/dashboard",
    onboard:"/apply",
    write: "/write",
    signup: "/signup",
    register:"/register",
   
    page:{ 
        pre:"/s",
        route: ()=>`/s/:id/view`,createRoute:(id)=>{return `/s/${id}/view`
    }},
    
    workshop:{
             pre:"/workshop",
        route:()=>"/workshop/:storyId",
        reader:()=>"/workshop",
        createRoute:(pageId)=>{return "/workshop/"+pageId}
    },
    hashtag:{
             pre:"/hashtag",
        route:()=>"/hashtag/:id",
        createRoute:(id)=>`/hashtag/${id}`
    },
    editCollection:{
             pre:"/col",
        route: ()=>`/col/:id/edit`,
        createRoute:(id)=>{return `/col/${id}/edit`;}},
    
    apply:()=>{return "/apply"},

    collections: "/cols",

    collection:{
        pre:"/col",
        route: ()=>{return '/col/:id/view'},
        createRoute:(id)=>{return "/col/"+id+"/view"}
    },
    editor:
    {
           pre:"/s/editor",
            route:"/s/editor/:id",
            createRoute:(id)=>"/s/editor/"+id
    },
    login: `/login`,
    
    editPage:{
        pre:"/s",
        route:`/s/:type/edit/:id`,
        createRoute:(id,type)=>{
            let addType = type
            if(type==PageType.text){
                addType = "text"
            }
            return `/s/${addType}/edit/${id}`
        }},

    addToCollection:{
        pre:"/col",
        route:'/col/:id/add',
        createRoute:(id)=>{return `/col/${id}/add`}},
    
    addStoryToCollection:{
        pre:"/item",
        collection:(id)=>`/item/${id}/collection`,
        story:(id)=>`/item/${id}/story`,
               route:"/item/:id/:type",
        createRoute:(id)=>{
            return `/item/${id}/collection`
        }
    },
    discovery:"/discovery",
    home:`/home`,
    about:()=>{return `/about`},
    editProfile:
    
    `/me/edit`,
    profile:{route:()=>{return `/profile/:id/view`},
            createRoute:(id)=>{return `/profile/${id}/view`}},
        
    myProfile:`/profile`,
    notifications:"/profile/alert"
}
export default Paths