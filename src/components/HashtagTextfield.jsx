
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { create } from 'lodash';
import { useEffect, useState } from 'react';
import debounce from '../core/debounce';
const HashtagTextfield=(page)=>{
    const [hashtagArea, setHashtagArea]=useState("")
    const [hashtags, setHashtags]=useState([])
    const [text,setText]=useState("")
  
    const handleHashtags=(e)=>{

        e.preventDefault();
        const htmlContent = e.target.innerHTML
        let values = htmlContent.split(/(?<![a-zA-Z<> ])|(?![a-zA-Z<> ])/)
   
     
        // let values = []
        // let i = 0
        // let start = i
        // for(i; i < htmlContent.length;i++){
        //    let char = htmlContent[i]
        //    if(!isLetter(char)){
        //    if(char==="<"){
        //     let t =1
        //     for(t;htmlContent.length>i+t-1&&htmlContent[i+t-1]!==">"; t++){
        //         if(htmlContent[i+t]!==">"){
        //             continue
        //         }else{
        //         if(i+t <= htmlContent.length){
        //         let br = htmlContent.slice(i,i+4)
        //         if(br=="<br/>"){
        //             let value = htmlContent.slice(start,i)
        //             values.push(value)
          
        //             setHashtags(values)
        //             setText(createText(values))
        //             start = i
        //         } 
        //     }
        //     }
        // }
        //    }else if(char===" "){
        //         let value = htmlContent.slice(start,i)
        //         values.push(value)
        //         start = i
        //         setHashtags(values)
        //         setText(createText(values))
        //    }}
        // } 
     
      
        // console.log(JSON.stringify(htmlContent))
        

    }
   
    const createText=(values)=>{
        let  htmlString = ""
        values.map(value=>{
            const regex = /[^a-zA-Z<>]/;
            const result = value.replace(regex, '').trim();
    
            htmlString+=(`<div className='hashtag'>#
            ${result}
            </div>`)
        })
        return htmlString
    }
    return(     <div 
        key={page.id}
        id="hashtagArea"
        style={{minHeight:"3em",width:"100%",backgroundColor:"white"}}
        contentEditable={true}
        dangerouslySetInnerHTML={{__html:text}}
        onInput={(e)=>debounce(handleHashtags(e),10)}
       />
       )
}
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
  
export default HashtagTextfield