
const Paths ={
    library: {
        route: ()=>`/library/:id`,
        createRoute:(id)=>{return `/library/${id}`;}},
    page:{ route: ()=>`/page/:id`,createRoute:(id)=>{return `/page/${id}`
    }},
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
    editor:{
        text:()=>{return `/page/text`},
        link:()=>{ return `/page/link`},
        image:()=>{return `/page/image`}   
    },
    login:()=>{return `/login`},
    editPage:{route:()=>{return `/page/:id/edit`},
        createRoute:(id)=>{return `/page/${id}/edit`}},

    addToCollection:{
        route:'/collection/:id/add',
        createRoute:(id)=>{return `/collection/${id}/add`},
    addItemsToLibrary:(id)=>{return `/library/${id}/add`},},
    createColleciton:{
        route:()=>{return "/collection"}
    },
    addStoryToCollection:{
        route:"/story/:id/collection",
        createRoute:(id)=>{
            return `/story/${id}/collection`
        }
    },
    home:()=>{return `/dashboard`},
    about:()=>{return `/`},
    profile:{route:()=>{return `/profile/:id`},
            createRoute:(id)=>{return `/profile/${id}`}},
    myProfile:()=>{return `/profile/home`}
}
export default Paths