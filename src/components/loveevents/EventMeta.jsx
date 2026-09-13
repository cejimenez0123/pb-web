import { Icon } from "../ui/Icon";

export function EventMeta({ date, time, location }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[16px] text-plumb-muted">
      <span>{date}</span>
      <span aria-hidden="true">·</span>
      <span>{time}</span>
      <Icon name="pin" size={17} />
      <span>{location}</span>
    </div>
  );
}
