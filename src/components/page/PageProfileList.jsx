import Paths from "../../core/paths";

const PageProfileList = ({ items, router }) => (
    <div className="space-y-2">
    {items.map((p) => (
      <div
        key={p.id}
        onClick={() => router.push(Paths.page.createRoute(p.id))}
      className="px-3 py-3 rounded-full border border-purple border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] min-h-10  font-medium text-gray-800">
        {p?.title?.length > 0 ? p.title : "Untitled"}
        </span>
      </div>
    ))}
  </div>
);

export default PageProfileList