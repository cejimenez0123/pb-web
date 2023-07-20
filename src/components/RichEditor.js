import React,{useState,createRef} from "react"



export default function RichEditor() {
    const [isReady, setIsReady] = useState(false);
    const editorRef = createRef()
    const [htmlContent, setHtmlContent] = useState('');
   const Type = {
        BOLD:"BOLD",
        ITALIC:"ITALIC", 
        SUBSCRIPT:"SUBSCRIPT", 
        SUPERSCRIPT:"SUPERSCRIPT",
        STRIKETHROUGH:"STRIKETROUGH", 
        UNDERLINE:"UNDERLINE", 
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
        JUSTIFYRIGHT:"JUSTIFYRIGTHT"
    }
    const editableDiv = document.getElementsByClassName('editor-page')
    const onTextChaneListener=(event)=>{
        event.preventDefault();
    const content = event.target.innerHTML 

console.log(htmlContent)


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

    // const html=(contents)=> {
    //     if (!contents) {
    //         contents = "";
    //     }
    //     try {
    //         this.exec(`javascript:RE.setHtml('${encodeURIComponent(contents)}');`);
    //     } catch (e) {
    //         // No handling
    //     }
    //     setHtmlContent(contents)
    // }
    return(
    <div>
        <div className="editor-btn-row row flex-nowrap overflow-auto">
            <button onClick={setUnderline}>Underline</button>
            <button onClick={()=>setFontSize(40)}>H1</button>
            <button onClick={()=>setFontSize(32)}>H2</button>
            <button onClick={()=>setFontSize(24)}>H3</button>
            <button onClick={()=>setFontSize(16)}>H4</button>
            <button onClick={changeAlignmentLeft}>Align Left</button>
            <button onClick={changeAlignmentRight}>Align Right</button>
            <button>Align Center</button>
        </div>
        <div 
        className="editor-page"
        ref={editorRef}
        contentEditable={true}
        onChange={(e)=>onTextChaneListener(e)}
       >
        

        </div>
    </div>)
}