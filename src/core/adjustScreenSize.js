import { Fullscreen } from "@mui/icons-material"
import { useMediaQuery } from "react-responsive"
export default function adjustScreenSize(isGrid=false,isContent,grid="",gridMobile="",horizPhone="",fullScreen="",height=""){
    const isPhone =  useMediaQuery({
        query: '(max-width: 768px)'
      })
      const isHorizPhone =  useMediaQuery({
        query: '(min-width: 768px)'
      })
  
      return isGrid?isPhone?
      (gridMobile+`w-grid-mobile${isContent?"-content":""} ${height.length<1?`h-grid-mobile${isContent?`-content`:""}`:""}`):
      (grid+`   w-grid${isContent?"-content":""} ${height.length<1?"h-grid":""}${isContent?"-content":""}`):
      (isHorizPhone?(`${horizPhone} w-page${isContent?"-content":""} ${height.length<1? ` max-h-page${isContent?`-content`:""}`:""}`)
      :(`${fullScreen} w-page-mobile${isContent?`-content`:""}  max-h-page-mobile${isContent?`-content`:``}`))
    }