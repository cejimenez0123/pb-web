function checkResult(result,fn,err){
    if(result.error==null){
        const {payload} = result
        if(payload.error==null){
            fn(payload)
            
        }else{
           err(payload.error)
        }
    }else{
      err(result.error)
    }
}
export default checkResult