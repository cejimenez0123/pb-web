import Paths from "../../core/paths";
import shortName from "../../core/shortName";



export default function ListPill({item,onClick,router}){
    return(                    <div
        key={item?.id}
        onClick={onClick}   className="px-3 py-3 rounded-full border border-purple border-1 bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition"
      >
        <span className="text-[0.95rem] min-h-10  font-medium text-soft dark:text-emerald-200">
            {shortName(item?.title??"",30)}
        </span>
      </div>)
}