import { useMediaQuery } from "react-responsive"
function adjustScreenSize(isGrid=false,isContent,grid="",gridMobile="",horizPhone="",fullScreen=""){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
  
      
    return +isGrid?(isPhone?`max-h-grid-mobile w-grid-mobile-${isContent?"content":""}`+gridMobile:` h-grid${isContent?"-content":""} w-grid${isContent?"-content":""}`+grid):isHorizPhone?`w-page${isContent?"-content":""} h-page-${isContent?"-content":""} `+fullScreen:`w-page-mobile${isContent?"-content":""} h-page-mobile${isContent?"-content":""} `+horizPhone
}
export default adjustScreenSize