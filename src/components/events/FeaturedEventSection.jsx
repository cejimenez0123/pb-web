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
function getEventHtml(event) {
  const candidates = [
    event?.data,
    event?.page?.data,
    event?.story?.data,
    event?.event?.data,
    event?.content,
    event?.page?.content,
  ];

  return candidates.find(
    (value) => typeof value === "string" && value.trim()
  ) || "";
}
