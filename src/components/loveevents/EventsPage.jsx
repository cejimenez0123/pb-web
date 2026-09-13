import { useMemo, useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { EventCard } from "./EventCard";
import { EventFilters } from "./EventFilters";
import { events as initialEvents } from "../../data/siteData";

export function EventsPage() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState(initialEvents);

  const filteredEvents = useMemo(() => {
    if (filter === "Saved") return items.filter((event) => event.saved);
    if (filter === "Plumbumb") return items.filter((event) => event.source === "PLUMBUMB");
    // Replace this with your geolocation/search service when Nearby is implemented.
    return items;
  }, [filter, items]);

  function toggleSave(target) {
    setItems((current) =>
      current.map((event) =>
        event.id === target.id ? { ...event, saved: !event.saved } : event
      )
    );
  }

  return (
    <div className="plumb-scrollbar min-h-screen overflow-y-auto">
      <div className="mx-auto max-w-[1120px] px-7 py-12 md:px-12 md:py-16 xl:px-16">
        <SectionHeading
          eyebrow="Events"
          title="Rooms with a date on them."
          description="Some of these are ours; some are simply happening near you and worth knowing about. Nothing appears here because it was paid for."
          titleSize="lg"
        />

        <div className="mt-12">
          <EventFilters value={filter} onChange={setFilter} />
        </div>

        <section className="mt-16 border-t border-plumb-line pt-8">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.025em] md:text-4xl">
            Coming up
          </h2>
          <p className="mt-2 text-lg text-plumb-muted">Save it, or say you'll be there.</p>

          <div className="mt-7 space-y-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
