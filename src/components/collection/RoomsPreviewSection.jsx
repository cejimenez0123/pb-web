import styles from "../../styles/style";
import EmptyState from "../general/EmptyState";
import SectionHeader from "../pieces/SectionHeader";

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
        buttonClass={" dark:bg-transparent text-lg bg-plumb-button-room-bg/20  border-plumb-button-room-bg/20 text-plumb-mint  dark:text-plumb-mintLight"}
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