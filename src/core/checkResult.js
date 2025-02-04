function checkResult(result,fn,err=(err)=>{}){
    if(result && result.error==null){
        const {payload} = result
        if(payload && payload.error==null){
            fn(payload)
            
        }else{
            if(payload!=null){
                err(payload.error)
            }else{
               fn({})
            }
        
        }
    }else{
        if(result!=null){
            err(result.error)
        }else{
            err(new Error("Check result error"))
        }
    
    }
}
export default checkResult