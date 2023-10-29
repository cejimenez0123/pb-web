import { doc } from "firebase/firestore";
import React,{useState,createRef,useEffect, useLayoutEffect} from "react"
import { useDispatch,useSelector } from "react-redux";
import { setHtmlContent } from "../actions/PageActions";
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import { IconButton ,Button} from "@mui/material";
import theme from "../theme";
export default function RichEditor(props) {
    const [isReady, setIsReady] = useState(false);
    const editorRef = createRef()
    const editingPage = useSelector(state=>state.pages.editingPage)
    const ehtmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const dispatch = useDispatch()
    useEffect(()=>{
     
        
        document.getElementById("editor-page").innerHTML = ehtmlContent
          

    },[editingPage])
   const Type = {
        BOLD:"bold",
        ITALIC:"italic", 
        SUBSCRIPT:"SUBSCRIPT", 
        SUPERSCRIPT:"SUPERSCRIPT",
        STRIKETHROUGH:"STRIKETROUGH", 
        UNDERLINE:"underline", 
        H1:"H1", 
        H2:"H2",
        H3:"H3", 
        H4:"H4", 
        H5:"H5",
        H6:"H6", 
        ORDEREDLIST:"ORDEREDLIST", 
        UNORDEREDLIST:"UNORDEREDLIST", 
        JUSTIFYCENTER:"JUSTIFYCENTER", 
        JUSTIFYFULL:"JUSTIFYFULL", 
        JUSTIFYLEFT:"JUSTIFYLEFT", 
        JUSTIFYRIGHT:"JUSTIFYRIGTHT",
        RIGHT:"right",
        CENTER:"center",
        LEFT:"left"
    }
    const editableDiv = document.getElementsByClassName('editor-page')
    const onTextChaneListener=(event)=>{
        event.preventDefault();
    const content = event.target.innerHTML
    // window.localStorage.setItem('htmlContent',htmlContent) 
            dispatch(setHtmlContent(content))


    }
    const setBlockquote=()=> {
        document.execCommand("formatBlock", false, "blockquote");
      }
    // function performAction(command) {
    //     document.execCommand(command, false, null);
    //     editableDiv.focus();
    //   }
     const setUnderline=()=> {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          document.execCommand("underline", false, null);
        }
        // console.log("setUnderline")
        // document.execCommand("underline", false, null);
    }
    const setStyle=(style)=>{
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          document.execCommand(style, false, null);
        }
    }
    const setFontSize = (fontSize) => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const spanElement = document.createElement("span");
            spanElement.style.fontSize = fontSize + "px";
            spanElement.textContent = range.toString();
            range.deleteContents();
            range.insertNode(spanElement);
        }
    };
    const changeAlignmentLeft = () => {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a new div to wrap the aligned content
          const containerDiv = document.createElement("div");
          containerDiv.style.textAlign = "left";
      
          // Move the contents of the range to the container div
          containerDiv.appendChild(range.extractContents());
      
          // Insert the container div with the aligned content
          range.insertNode(containerDiv);
      
          // Create a new paragraph after the container div
          const newParagraph = document.createElement("p");
          newParagraph.textContent = ""; // Add any initial text you want
          containerDiv.parentNode.insertBefore(newParagraph, containerDiv.nextSibling);
      
          // Set the selection to the new paragraph
          const newRange = document.createRange();
          newRange.setStart(newParagraph, 0);
          newRange.setEnd(newParagraph, 0);
          selection.removeAllRanges();
          selection.addRange(newRange);}
    };
    const changeAlignment = (justify) => {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a new div to wrap the aligned content
          const containerDiv = document.createElement("div");
          containerDiv.style.textAlign = justify;
      
          // Move the contents of the range to the container div
          containerDiv.appendChild(range.extractContents());
      
          // Insert the container div with the aligned content
          range.insertNode(containerDiv);
      
          // Create a new paragraph after the container div
          const newParagraph = document.createElement("p");
          newParagraph.textContent = ""; // Add any initial text you want
          containerDiv.parentNode.insertBefore(newParagraph, containerDiv.nextSibling);
      
          // Set the selection to the new paragraph
          const newRange = document.createRange();
          newRange.setStart(newParagraph, 0);
          newRange.setEnd(newParagraph, 0);
          selection.removeAllRanges();
          selection.addRange(newRange);}
    };
    const changeAlignmentRight = () => {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a new div to wrap the aligned content
          const containerDiv = document.createElement("div");
          containerDiv.style.textAlign = "right";
      
          // Move the contents of the range to the container div
          containerDiv.appendChild(range.extractContents());
      
          // Insert the container div with the aligned content
          range.insertNode(containerDiv);
      
          // Create a new paragraph after the container div
          const newParagraph = document.createElement("p");
          newParagraph.textContent = ""; // Add any initial text you want
          containerDiv.parentNode.insertBefore(newParagraph, containerDiv.nextSibling);
      
          // Set the selection to the new paragraph
          const newRange = document.createRange();
          newRange.setStart(newParagraph, 0);
          newRange.setEnd(newParagraph, 0);
          selection.removeAllRanges();
          selection.addRange(newRange);}
      
    };
    const inputStyle = {
        color: theme.palette.primary.contrastText,
        paddingTop: "1em"
    }
    return(
    <div>
        <div className="editor-btn-row">
            <Button style={inputStyle}
                    onClick={setUnderline}>
                        <FormatUnderlinedIcon/>
            </Button>
            <Button style={inputStyle}
                    onClick={()=>setStyle(Type.BOLD)}>
                        <FormatBoldIcon/>
            </Button>
            <Button style={inputStyle} 
                    onClick={()=>setStyle(Type.ITALIC)}>
                    <FormatItalicIcon/>
            </Button>
            <Button style={inputStyle} onClick={()=>setFontSize(40)}>H1</Button>
            <Button style={inputStyle} onClick={()=>setFontSize(32)}>H2</Button>
            <Button style={inputStyle} onClick={()=>setFontSize(24)}>H3</Button>
            <Button style={inputStyle} onClick={()=>setFontSize(16)}>H4</Button>
            <Button style={inputStyle} onClick={changeAlignmentLeft}><AlignHorizontalLeftIcon/></Button>
            <Button style={inputStyle} onClick={changeAlignmentRight}><AlignHorizontalRightIcon/></Button>
            <Button style={inputStyle} onClick={()=>changeAlignment(Type.CENTER)}><AlignHorizontalCenterIcon/></Button>
            <Button style={inputStyle} onClick={setBlockquote}>""</Button>
        </div>
        <div 
        id="editor-page"
        ref={editorRef}
        contentEditable={true}
        onInput={(e)=>onTextChaneListener(e)}
       >

        </div>
    </div>)
}