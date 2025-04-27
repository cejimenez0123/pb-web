import { useMediaQuery } from "react-responsive"
function adjustScreenSize(isGrid=false,grid="",gridMobile="",horizPhone="",fullScreen=""){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
    
      
    return isGrid?(isPhone?" w-grid-mobile-content "+gridMobile:"w-grid"+grid):isHorizPhone?"w-page"+fullScreen:"w-page-mobile"+horizPhone
}
export default adjustScreenSize