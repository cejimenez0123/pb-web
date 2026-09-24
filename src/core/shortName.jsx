// function shortName(str="",length){
//     return str.length<length?str.length==0?"Untitled":str:str.slice(0,length)+"..."
// }
// export default shortName
function shortName(str = "", length = 60) {
  if (!str) {
    return "Untitled";
  }

  if (str.length <= length) {
    return str;
  }

  return `${str.slice(0, length).trimEnd()}...`;
}

export default shortName;