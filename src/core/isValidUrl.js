const isValidUrl = urlString=> {
  let url;
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	 if(!!urlPattern.test(urlString)){
  try {
    url = new URL(urlString);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";}
  else{
    return false
  }
}
export default isValidUrl
