function shortName(str="",length){
    return str.length<length?str.length==0?"Untitled":str:str.slice(0,length)+"..."
}
export default shortName