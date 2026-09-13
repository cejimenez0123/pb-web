import { Button } from "../ui/Button";

export function EventFilters({ value, onChange }) {
  const filters = ["All", "Plumbumb", "Nearby", "Saved"];

  return (
    <div className="flex flex-wrap gap-3" role="tablist" aria-label="Event filters">
      {filters.map((filter) => {
        const active = value === filter;
        return (
          <Button
            key={filter}
            variant={active ? "primary" : "ghost"}
            onClick={() => onChange(filter)}
            role="tab"
            aria-selected={active}
          >
            {filter}
          </Button>
        );
      })}
    </div>
  );
}
