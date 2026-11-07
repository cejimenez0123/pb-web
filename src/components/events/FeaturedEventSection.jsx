import UpcomingEventsSection from "./UpcomingEventsSection";
const EMPTY_ARRAY = [];
function FeaturedEventSection({
  onViewEvents,
  currentProfile,
}) {

  // Keep empty until the Home event data source is connected.
  const upcomingEvents =currentProfile.profileToCollections.find(c=>c.type=="events").collection.storyIdList??EMPTY_ARRAY

  return (
    <section
      className="mt-14"
      aria-label="Upcoming events"
    >
      <UpcomingEventsSection
        profile={currentProfile}
        events={upcomingEvents.map(t=>t.story)}
        onViewEvents={onViewEvents}
      />
    </section>
  );
}
export default FeaturedEventSection