import UpcomingEventsSection from "./UpcomingEventsSection";
const EMPTY_ARRAY = [];
function FeaturedEventSection({
  events,
  onViewEvents,
  currentProfile,
}) {



  return (
    <section
      className="mt-14"
      aria-label="Upcoming events"
    >
      <UpcomingEventsSection
        profile={currentProfile}
        events={events}
        onViewEvents={onViewEvents}
      />
    </section>
  );
}
export default FeaturedEventSection

