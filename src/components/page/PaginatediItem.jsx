import Paths from "../../core/paths";
import shortName from "../../core/shortName";



function PaginatedItem({router,item}){

    return<div
        key={item.id}
        onClick={() => router.push(Paths.page.createRoute(item.id))}
      className="px-3 py-3 rounded-full border border-purple border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] min-h-10  font-medium text-gray-800">
          {shortName(item.title,30)}
      
        </span>
      </div>
}
export default PaginatedItem