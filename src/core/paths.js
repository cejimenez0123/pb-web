
const Paths ={
    library: (id)=>{return `/library/${id}`;},
    page:(id)=>{return `/page/${id}`;},
    book: (id)=>{return `/book/${id}`},
    editor:(id)=>{return `/page/new`},
    editPage:{route:()=>{return `/page/:id/edit`},
        createRoute:(id)=>{return `/page/${id}/edit`}},
    editBook:(id)=>{return `/book${id}/edit`},
    createBook:()=>{return `book/new`},
    createLibrary:()=>{return `/library/new`},
    addPagesToBook:(id)=>{return `/book/${id}/add`},
    addItemsToLibrary:(id)=>{return `/library/${id}/add`},
    home:()=>{return `/`},
    profile:{route:()=>{return `/profile/:id`},
            createRoute:(id)=>{return `/profile/${id}`}},
    myProfile:()=>{return `/profile/home`}
}
export default Paths