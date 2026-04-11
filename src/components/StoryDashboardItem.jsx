import Paths from "../core/paths";
export default function StoryDashboardItem({ story, router }) {
  return (
    <div
      onClick={() => router.push(Paths.page.createRoute(story.id))}
      className="
        w-[100%]
      
        h-[8rem]
        border border-blue
        rounded-2xl
        shadow-md
        bg-base-bg
        px-4
        py-3
        flex
        flex-col
        justify-between
        hover:scale-[1.01]
        transition
      "
    >
      <div className="flex flex-col gap-1 min-w-0">

        <h4 className="
          text-[1.05rem]
          text-text-soft
          break-words
          line-clamp-2
        ">
          {story.title?.length > 0 ? story.title : "Untitled"}
        </h4>

        <h6 className="
          text-xs
          text-text-soft
          opacity-70
        ">
          {story.status}
        </h6>

      </div>
    </div>
  );
}
// export default function StoryDashboardItem({ story, router }) {
//   return (
//     <div
//       onClick={() => router.push(Paths.page.createRoute(story.id))}
//       className="
    
//         border border-blue
//         rounded-2xl
//         shadow-md
//         min-w-[14rem]
//         max-h-[8rem]
//         min-h-[8rem]
//         py-4
//         bg-base-bg
//         hover:scale-[1.01]
//         transition
//       "
//     >
//       <div className="flex flex-col gap-1 min-w-0">
        
//         {/* TITLE */}
//         <h4 className="
//           text-[1.1rem]
//           text-text-soft
//           break-words
//           line-clamp-2
//         ">
//           {story.title?.length > 0 ? story.title : "Untitled"}
//         </h4>

//         {/* STATUS */}
//         <h6 className="
//           text-sm
//           text-text-soft
//           opacity-70
//         ">
//           {story.status}
//         </h6>

//       </div>
//     </div>
//   );
// }