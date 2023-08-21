import Library from "../domain/models/library"
const initialState = {
    librariesInView:[Library],
    loading:false,
    error:"",
    bookMarkLibrary: false,
    libraryInView: null
}
const bookSlice = createSlice({
name: 'libraries',
initialState,
extraReducers(builder) {
builder
.addCase()
}

})
export default bookSlice