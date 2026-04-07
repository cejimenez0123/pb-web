import Paths from "../../core/paths";

const PageProfileList = ({ items, router }) => (
    <div className="space-y-2">
    {items.map((p) => (
      <div
        key={p.id}
        onClick={() => router.push(Paths.page.createRoute(p.id))}
    
        className="p-3 backdrop-blur-sm shadow-sm border-blue bg-base-bg rounded-full border-1 border active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] font-medium text-gray-800">
        {p?.title?.length > 0 ? p.title : "Untitled"}
        </span>
      </div>
    ))}
  </div>
);

export default PageProfileList