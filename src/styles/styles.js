import theme from "../theme"

const checkmarkStyle={
    color:theme.palette.secondary.main,
}
const saveButtonStyle={
    backgroundColor:theme.palette.primary.main,
    color:theme.palette.secondary.contrastText
}
const textfieldStyle={
    backgroundColor: "rgb(165, 214, 167)",
    borderRadius:"8px"
}
const textareaStyle={padding:"1em",borderRadius:"16px"}
const btnStyle ={fontSize: "1em",paddingTop:"1em",color:theme.palette.primary.contrastText,height:"100%"}
const iconStyle ={ color: theme.palette.primary.dark, fontSize:`2em`}
export {checkmarkStyle,saveButtonStyle,textfieldStyle,btnStyle,iconStyle,textareaStyle}