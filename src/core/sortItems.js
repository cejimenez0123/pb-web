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

