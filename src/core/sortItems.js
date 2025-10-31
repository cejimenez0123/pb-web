export default function sortItems(pages = [], cols = []) {
  const now = Date.now();
  const threeDaysMs = 1000 * 60 * 60 * 24 * 3; // 3 days
  const k = 4;

  // Flatten all stories from collections
  const storiesInCollections = cols
    .filter(Boolean)
    .flatMap(col => col.storyIdList || [])
    .map(stc => stc.story)
    .filter(Boolean);

  // Combine pages and collections
  const allItems = [...pages, ...cols].filter(Boolean);

  // Remove items that are already inside collections
  const uniqueItems = allItems.filter(
    item => !storiesInCollections.some(story => story.id === item.id)
  );

  // Split into "recent" (last 3 days) and "older" items
  const recentItems = [];
  const olderItems = [];

  uniqueItems.forEach(item => {
    const updatedTime = new Date(item.updated).getTime();
    if (now - updatedTime < threeDaysMs) {
      recentItems.push(item);
    } else {
      olderItems.push(item);
    }
  });

  // Sort recent items by updated timestamp (newest first)
  recentItems.sort((a, b) => new Date(b.updated) - new Date(a.updated));

  // Sort older items by priority/recency score
  olderItems.sort((a, b) => {
    const updatedA = new Date(a.updated).getTime();
    const updatedB = new Date(b.updated).getTime();

    const score = item => {
      if (item.priority) {
        const age = (now - new Date(item.updated).getTime()) / threeDaysMs;
        return item.priority / (age + k);
      }
      return 0;
    };

    const scoreA = score(a);
    const scoreB = score(b);

    if (scoreA !== scoreB) return scoreB - scoreA;

    // fallback: most recently updated first
    return updatedB - updatedA;
  });

  return [...recentItems, ...olderItems]??[];
}

// export default function sortItems(pages,cols){
// let pagesInView = pages
// let date = 1000 * 60 * 60 * 24 * 3; // 1 day in ms
// let k = 4;
// let now = Date.now();
// // Get all stories inside collections
// let stories = cols.filter(item => item).map(col => col.storyIdList).flat();
// // Find the most recently updated story
// let allItems = [...pagesInView, ...cols].filter(item=>item);
// let list = allItems.filter(item => {
//     return !stories.find(story => story.storyId == item.id);
//   });
  
//   // Split into "created today" and "other" items
//   let todayItems = [];
//   let otherItems = [];
  

//   // Sort "today" items by creation time (newest first)

//   todayItems = allItems.filter(item=>now - new Date(item.updated) < date).sort((a, b) => b.updated - a.updated);
//   console.log(todayItems)
//   otherItems = allItems.filter(item=>now - new Date(item.updated) > date)
//   // Sort remaining items using priority/recency score
//   otherItems.sort((a, b) => {
//     if (a.priority || b.priority) {
//       if (a.priority && b.priority) {
//         let ageA = (now - new Date(a.updated).getTime()) / date;
//         let ageB = (now - new Date(b.updated).getTime()) / date;
  
//         let scoreA = a.priority / (ageA + k);
//         let scoreB = b.priority / (ageB + k);
  
//         if (scoreA > scoreB) return -1;
//         if (scoreA < scoreB) return 1;
//         return 0;
//       }
//       return a.priority ? -1 : 1;
//     }
  
//     // Neither has priority — fallback to updated date (more recent first)
//     return b.updated - a.updated;
//   });

//   // Combine both groups
//   let finalList = [...todayItems, ...otherItems];
  
// return finalList
// }