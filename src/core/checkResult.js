// function checkResult(result,fn,err=(err)=>{}){
//     if(result && result.error==null){
//         const {payload} = result
//         if(payload && payload.error==null){
//             fn(payload)
            
//         }else{
//             if(payload!=null){
//                 err(payload.error)
//             }else{
//                fn({})
//             }
        
//         }
//     }else{
//         if(result!=null){
//             err(result.error)
//         }else{
//             err(new Error("Check result error"))
//         }
    
//     }
// }
//  export default checkResult
function checkResult(result, fn, err = (err) => {}) {
  if (result && result.error == null) {
    const { payload } = result;
    if (payload && payload.error == null) {
      fn(payload);
    } else {
      if (payload != null) {
        err(payload.error);
      } else {
        fn({});
      }
    }
  } else {
    if (result != null) {
      // rejectWithValue puts your payload in result.payload
      // result.error is Redux's generic serialized error
      // prefer result.payload if it has status or message, else fall back to result.error
      const rejected = result.payload?.status || result.payload?.message
        ? result.payload
        : result.error;
      err(rejected);
    } else {
      err(new Error("Check result error"));
    }
  }
}

export default checkResult;