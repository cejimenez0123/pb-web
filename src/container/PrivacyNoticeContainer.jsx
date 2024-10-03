import html from "./privacynotice.html"
var template = { __html: html };


const PrivacyNoticeContrainer = ()=>{
    return(<div>
      <iframe style={{width:"100vw",height:"100%"}}src={html}></iframe>
      </div>)
}
export default PrivacyNoticeContrainer