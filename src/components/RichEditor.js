import React,{useState,createRef,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux";
import { setHtmlContent } from "../actions/PageActions";
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import {Menu,MenuItem, Button,Typography} from "@mui/material";
import theme from "../theme";
const fonts = ["Arial","Courier New","Georgia"]
export default function RichEditor(props) {
    const editorRef = createRef()
    const editingPage = useSelector(state=>state.pages.editingPage)
    const ehtmlContent = useSelector(state=>state.pages.editorHtmlContent)
    const [fontName,setFontName]=useState("Arial")
    const [anchorAlign,setAnchorAlign]=useState(null)
    const [anchorFont,setAnchorFont]=useState(null)
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
    const setFont = (name) => {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          document.execCommand("fontName", false, name);
        }
        setFontName(name)
      };
    const setStyle=(style)=>{
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          document.execCommand(style);
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
    const handlePaste = (e) => {
        const clipboardItems = e.clipboardData.items;
    
        // Filter only image items
        const items = [].slice.call(clipboardItems).filter(function (item) {
            return /^image\//.test(item.type);
        });
    
        // If no image items found, exit
        if (items.length === 0) {
            return;
        }
    
        // Get the first image item
        const item = items[0];
        const blob = item.getAsFile();
    
        // Get the image element
        const imageEle = document.getElementById('preview');
    
        // Set the src attribute and maintain aspect ratio
        const reader = new FileReader();
        reader.onload = function (e) {
            imageEle.src = e.target.result;
        };
    
        reader.readAsDataURL(blob);
    
        // Create a File object
        let file = new File([blob], "file name", { type: "image/jpeg", lastModified: new Date().getTime() }, 'utf-8');
    
        // Update the input file element
        let container = new DataTransfer();
        container.items.add(file);
        document.querySelector('#file_input').files = container.files;
    };
    
    const changeAlignmentCenter = () => {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Create a new div to wrap the aligned content
          const containerDiv = document.createElement("div");
          containerDiv.style.textAlign = "center";
      
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
    const handleSelectionChange = () => {
        const selection = window.getSelection();
    
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const font = window.getComputedStyle(range.commonAncestorContainer.parentNode).font;
            let split = font.split(" ")
            let name = split.slice(3).join(' ')
            if(fonts.includes(name)){
                setFontName(name)
            } 
           
        }
    };
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelectionChange);
    
        return () => {
          document.removeEventListener('selectionchange', handleSelectionChange);
        };
      }, []);
    const fontMenu = ()=>{
        console.log(fonts)
        return( <div>
                {fonts.map(font =>{
                    return<MenuItem onClick={()=>setFont(font)}>
                 <Typography fontFamily={font}>{font}</Typography> 
                </MenuItem>
                })}
            
                </div>)
    }
    const inputStyle = {
        backgroundColor:theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: "1px",
    
        // paddingTop: "1em",
        // 
        // marginRight:"1px"
        
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
            <Button
        style={{    backgroundColor:inputStyle.backgroundColor,
                    color:inputStyle.color,
                    borderRadius:inputStyle.borderRadius,
                    overflow:"hidden",
                    whiteSpace:"nowrap",
                    maxWidth:"10%"}}
        aria-controls={Boolean(anchorFont) ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorFont) ? 'true' : undefined}
        onClick={(e)=>setAnchorFont(e.currentTarget)}
      >
        <Typography fontSize={".7em"} >{fontName}</Typography>
      </Button>
      <Menu
        // id="demo-positioned-menu"
        // aria-labelledby="demo-positioned-button"
        anchorEl={anchorFont}
        open={Boolean(anchorFont)}
        onClose={()=>setAnchorFont(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {fontMenu()}
        {/* <MenuItem  onClick={changeAlignmentLeft}><AlignHorizontalLeftIcon/></MenuItem>
        <MenuItem  onClick={changeAlignmentRight}><AlignHorizontalRightIcon/></MenuItem>
        <MenuItem   onClick={changeAlignmentCenter}><AlignHorizontalCenterIcon/></MenuItem> */}
      </Menu>
            <Button
        style={inputStyle}
        aria-controls={Boolean(anchorAlign) ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorAlign) ? 'true' : undefined}
        onClick={(e)=>setAnchorAlign(e.currentTarget)}
      >
        <AlignHorizontalLeftIcon/>
      </Button>
      <Menu
        // id="demo-positioned-menu"
        // aria-labelledby="demo-positioned-button"
        anchorEl={anchorAlign}
        open={Boolean(anchorAlign)}
        onClose={()=>setAnchorAlign(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem  onClick={changeAlignmentLeft}><AlignHorizontalLeftIcon/></MenuItem>
        <MenuItem  onClick={changeAlignmentRight}><AlignHorizontalRightIcon/></MenuItem>
        <MenuItem   onClick={changeAlignmentCenter}><AlignHorizontalCenterIcon/></MenuItem>
        </Menu>
        <Button style={inputStyle} onClick={setBlockquote}>" "</Button>
        </div>
        <div 
        id="editor-page"
        ref={editorRef}
        contentEditable={true}
        onInput={(e)=>onTextChaneListener(e)}
        onPaste={(e)=>{handlePaste(e)}}
       >

        </div>
    </div>)
}