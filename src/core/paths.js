// const isClip = import.meta.env.MODE === "clip";
// const basename = isClip ? "/clip" : "/";

// // ✅ Helper to add basename prefix when needed
// const prefixPath = (path) => basename === "/clip" ? `/clip${path}` : path;

// const Paths ={
//     newsletter:()=>prefixPath(`/newsletter`),
//     feedback:()=>prefixPath(`/feedback`),
//     links:()=>prefixPath(`/links`),
//     calendar:()=>prefixPath("/events"),
//     onboard:prefixPath("/onboard"),
//     library: {
//         route: ()=>prefixPath(`/library/:id`),
//         createRoute:(id)=>prefixPath(`/library/${id}`)},
//     page:{ 
//         route: ()=>prefixPath(`/story/:id`), 
//         createRoute:(id)=>prefixPath(`/story/${id}`)
//     },
//     workshop:{
//         route:()=>prefixPath("/workshop/page/:pageId"),
//         reader:()=>prefixPath("/workshop"),
//         createRoute:(pageId)=>prefixPath("/workshop/page/"+pageId)
//     },
//     hashtag:{
//         route:()=>prefixPath("/hashtag/:id"),
//         createRoute:(id)=>prefixPath(`/hashtag/${id}`)
//     },
//     editCollection:{
//         route: ()=>prefixPath(`/collection/:id/edit`),
//         createRoute:(id)=>prefixPath(`/collection/${id}/edit`)},
    
//     apply:()=>prefixPath("/apply"),
//     book: {
//         route: ()=>prefixPath(`/book/:id`),
//         createRoute:(id)=>prefixPath(`/book/${id}`)
//     },
//     collection:{
//         route: ()=>prefixPath('/collection/:id'),
//         createRoute:(id)=>prefixPath("/collection/"+id)
//     },
//     editor:
//     {
//         text:()=>prefixPath(`/story/text/edit`),
//         link:()=> prefixPath(`/story/link/edit`),
//         image:()=>prefixPath(`/story/image/edit`)   
//     },
//     login:()=>prefixPath(`/login`),
//     editPage:{
//         route:()=>prefixPath(`/story/:id/editor`),
//         createRoute:(id)=>prefixPath(`/story/${id}/editor`)},

//     addToCollection:{
//         route:prefixPath('/collection/:id/add'),
//         createRoute:(id)=>prefixPath(`/collection/${id}/add`)},
//     createCollection:{
//         route:()=>prefixPath("/collection")
//     },
//     addStoryToCollection:{
//         collection:(id)=>prefixPath(`/item/${id}/collection`),
//         story:(id)=>prefixPath(`/item/${id}/story`),
//         route:prefixPath("/item/:id/:type"),
//         createRoute:(id)=>{
//             return prefixPath(`/item/${id}/collection`)
//         }
//     },
//     discovery:()=>prefixPath("/discovery"),
//     home:()=>prefixPath(`/home`),
//     about:()=>prefixPath(`/`),
//     editProfile:prefixPath(`/profile/edit`),
//     profile:{
//         route:()=>prefixPath(`/profile/:id`),
//         createRoute:(id)=>prefixPath(`/profile/${id}`)
//     },
//     myProfile:prefixPath(`/profile/home`),
//     notifications:()=>prefixPath("/profile/alert")
// }

// export default Paths

const isClip = import.meta.env.MODE === "clip";  // or use a VITE flag

const basename = isClip ? "/clip" : "/";
const Paths ={
    newsletter:()=>`/newsletter`,
    feedback:()=>`/feedback`,
    links:()=>`/links`,
    calendar:()=>"/events",
    onboard:"/onboard",
    library: {
        route: ()=>`/library/:id`,
        createRoute:(id)=>{return `/library/${id}`;}},
    page:{ route: ()=>`/story/:id`,createRoute:(id)=>{return `/story/${id}`
    }},
    workshop:{
        route:()=>"/workshop/page/:pageId",
        reader:()=>"/workshop",
        createRoute:(pageId)=>{return "/workshop/page/"+pageId}
    },
    hashtag:{
        route:()=>"/hashtag/:id",
        createRoute:(id)=>`/hashtag/${id}`
    },
    editCollection:{
        route: ()=>`/collection/:id/edit`,
        createRoute:(id)=>{return `/collection/${id}/edit`;}},
    
    apply:()=>{return "/apply"},
    book: {
        route: ()=>{return `/book/:id`;},
        createRoute:(id)=>{return `/book/${id}`
    } },
    collection:{
        route: ()=>{return '/collection/:id'},
        createRoute:(id)=>{return "/collection/"+id}
    },
    editor:
    {
        text:()=>{return `/story/text/edit`},
        link:()=>{ return `/story/link/edit`},
        image:()=>{return `/story/image/edit`}   
    },
    login:()=>{return `/login`},
    editPage:{route:()=>{return `/story/:id/editor`},
        createRoute:(id)=>{return `/story/${id}/editor`}},

    addToCollection:{
        route:'/collection/:id/add',
        createRoute:(id)=>{return `/collection/${id}/add`}},
    createCollection:{
        route:()=>{return "/collection"}
    },
    addStoryToCollection:{
        collection:(id)=>`/item/${id}/collection`,
        story:(id)=>`/item/${id}/story`,
               route:"/item/:id/:type",
        createRoute:(id)=>{
            return `/item/${id}/collection`
        }
    },
    discovery:()=>"/discovery",
    home:()=>{return `/home`},
    about:()=>{return `/`},
    editProfile:`/profile/edit`,
    profile:{route:()=>{return `/profile/:id`},
            createRoute:(id)=>{return `/profile/${id}`}},
    myProfile:`/profile/home`,
    notifications:()=>{return"/profile/alert"}
}
export default Paths