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
    let editor = item.editors.find(id => id==profile.userId)
    let writer = item.writers.find(id=>id==profile.userId)
   return item.writingIsOpen || Boolean(editor)||Boolean(writer)
}

export {PageType,RoleType,canAddToItem}