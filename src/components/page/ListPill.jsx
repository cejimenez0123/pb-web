// import Paths from "../../core/paths";
// import shortName from "../../core/shortName";

import shortName from "../../core/shortName";



export default function ListPill({ item, onClick, profile }) {
  const lastSeen = new Date(profile?.lastNotified)??new Date().getTime() - 24 * 60 * 60 * 1000;

  let isNew =
    item?.updated &&
    new Date(item.updated).getTime() > lastSeen;
  if(item?.userHistory?.length>0){
    isNew=false
  }
  console.log({
    title: item,
    updated: item?.updated,
    lastSeen,
    isNew,
  });
  let bordercolor = item.data?"border-blue":"border-purple"
  return (
    <div
      key={item?.id}
      onClick={onClick}
      className={`px-3 flex flex-row justify-between rounded-full border ${bordercolor} bg-base-bg backdrop-blur-sm shadow-sm active:scale-[0.98] transition`}
    >
      <span className="text-[0.95rem] my-auto py-3 font-medium text-soft dark:text-emerald-200">
        {shortName(item?.title ?? "", 30)}
      </span>

      {isNew && (
        <div className="bg-purple min-h-4 min-w-4 my-auto max-w-4 max-h-4 rounded-full" />
      )}
    </div>
  );
}