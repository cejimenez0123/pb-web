export default function sortItems(pages,cols){
let pagesInView = pages
let date = 1000 * 60 * 60 * 24 * 3; // 1 day in ms
let k = 4;
let now = Date.now();
// Get all stories inside collections
let stories = cols.filter(item => item).map(col => col.storyIdList).flat();
// Find the most recently updated story
let allItems = [...pagesInView, ...cols].filter(item=>item);
let list = allItems.filter(item => {
    return !stories.find(story => story.storyId == item.id);
  });
  
  // Split into "created today" and "other" items
  let todayItems = [];
  let otherItems = [];
  

  // Sort "today" items by creation time (newest first)

  todayItems = allItems.filter(item=>now - new Date(item.created) < date).sort((a, b) => b.created - a.created);
  console.log(todayItems)
  otherItems = allItems.filter(item=>now - new Date(item.created) > date)
  // Sort remaining items using priority/recency score
  otherItems.sort((a, b) => {
    if (a.priority || b.priority) {
      if (a.priority && b.priority) {
        let ageA = (now - new Date(a.updated).getTime()) / date;
        let ageB = (now - new Date(b.updated).getTime()) / date;
  
        let scoreA = a.priority / (ageA + k);
        let scoreB = b.priority / (ageB + k);
  
        if (scoreA > scoreB) return -1;
        if (scoreA < scoreB) return 1;
        return 0;
      }
      return a.priority ? -1 : 1;
    }
  
    // Neither has priority — fallback to updated date (more recent first)
    return b.updated - a.updated;
  });
  console.log("today",todayItems[0])
  // Combine both groups
  let finalList = [...todayItems, ...otherItems];
  
return finalList
}