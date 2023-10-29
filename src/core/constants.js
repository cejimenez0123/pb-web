const PageType  = {
    text: "html/text",
    picture:"image",
    video:"video"

}

const RoleType = {
    reader:"reader",
    writer:"writer",
    commenter:"commenter",
    editor :"editor"
}

function canAddToItem(item,profile){
    
   return item.writingIsOpen==true || item.editors.includes(profile.userId)|| item.writers.includes(profile.userId)
}

export {PageType,RoleType,canAddToItem}