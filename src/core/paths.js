
const Paths ={
    library: {
        route: ()=>`/library/:id`,
        createRoute:(id)=>{return `/library/${id}`;}},
    page:{ route: ()=>`/page/:id`,createRoute:(id)=>{return `/page/${id}`
    }},
    apply:()=>{return "/apply"},
    book: {
        route: ()=>{return `/book/:id`;},
        createRoute:(id)=>{return `/book/${id}`
    } },

    editor:{
        text:()=>{return `/page/text`},
        link:()=>{ return `/page/link`},
        image:()=>{return `/page/image`}   
    },
    login:()=>{return `/login`},
    editPage:{route:()=>{return `/page/:id/edit`},
        createRoute:(id)=>{return `/page/${id}/edit`}},
    editBook:(id)=>{return `/book${id}/edit`},
    createBook:()=>{return `book/new`},
    createLibrary:()=>{return `/library/new`},
    addPagesToBook:(id)=>{return `/book/${id}/add`},
    addItemsToLibrary:(id)=>{return `/library/${id}/add`},
    addStoryToCollection:{
        route:"/story/:id/collection",
        createRoute:(id)=>{
            return `/story/${id}/collection`
        }
    },
    home:()=>{return `/`},
    about:()=>{return `/about`},
    profile:{route:()=>{return `/profile/:id`},
            createRoute:(id)=>{return `/profile/${id}`}},
    myProfile:()=>{return `/profile/home`}
}
export default Paths