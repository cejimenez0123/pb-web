import EmptyState from "../general/EmptyState";
import SectionHeader from "../SectionHeader";
import RoomGrid from "./RoomGrid";

function RoomsPreviewSection({
  rooms,
  onViewRooms,
  onSelectRoom,
}) {
  return (
    <section className="mt-14 pb-16">
      <SectionHeader
        title="Your rooms"
        description="Places to gather the stories, ideas, and things you want to keep close."
        actionLabel="+ Make a room"
        onAction={onViewRooms}
      />

      {rooms.length > 0 ? (
        <RoomGrid
          rooms={rooms}
          onSelectRoom={onSelectRoom}
        />
      ) : (
        <EmptyState
          title="No rooms yet."
          description="Create a room to keep stories and ideas together."
          action="Make a room"
          onAction={onViewRooms}
        />
      )}
    </section>
  );
}

export default RoomsPreviewSection