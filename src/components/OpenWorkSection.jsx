

import { shared } from "../styles/style";

import EmptyState from "./general/EmptyState";
import SectionHeader from "./pieces/SectionHeader";

function OpenWorkSection({
  stories = [],
  onWrite,
  onSelectStory,
}) {
  const hasStories = stories.length > 0;

  return (
    <section className={`mt-14 ${shared.layout.pagePadding}`}>
  
 
      
   

          <SectionHeader
           title="Open Work"
     eyebrow="Still open"
        
        description="Drafts and fragments you're still finding your way through."
       
        onAction={hasStories ? onWrite : undefined}
      />
      {hasStories ? (
        <WorkList
          stories={stories}
          onSelectStory={onSelectStory}
        />
      ) : (
        <EmptyState
          title="Nothing in progress just yet."
          description="Start with a line, a fragment, or whatever is on your mind."
          action="Start writing"
          onAction={onWrite}
        />
      )}
    </section>
  );
}

export default OpenWorkSection;


function WorkList({ stories, onSelectStory }) {
  return (
    <div
      className="
        mt-4 space-y-1
        border-y border-plumb-border
        dark:border-plumb-darkBorder
      "
    >
      {stories.map((story) => (
        <WorkRow
          key={story.id}
          story={story}
          onClick={() => onSelectStory(story)}
        />
      ))}
    </div>
  );
}