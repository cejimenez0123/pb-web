// import truncate from "html-truncate";
// import Paths from "../core/paths";
// import { PageType } from "../core/constants";
// import shortName from "../core/shortName";
// export default function StoryDashboardItem({ story, router }) {
//   return (
//     <div
//       onClick={() => router.push(Paths.page.createRoute(story.id))}
//       className="
//         w-[100%]
      
//         h-[8rem]
//         border border-blue
//         rounded-2xl
//         shadow-md
//         bg-base-bg
//         px-4
//         py-3
//         flex
//         flex-col
//         justify-between
//         hover:scale-[1.01]
//         transition
//       "
//     >
//       <div className="flex flex-col gap-1 min-w-0">

//         <h4 className="
//           text-[1.05rem]
//           dark:text-emerald-200
//           text-text-soft
//           break-words
//           line-clamp-2
//         ">
//           {shortName(story.title,30)}
//         </h4>
//         <h5 className="
//           text-sm
//           dark:text-emerald-200
//           text-text-soft
//           opacity-80
//           line-clamp-3
//         ">
//        {story.type == PageType.text? story.description.length>0 ? <div dangerouslySetInnerHTML={{_html:truncate(story?.data,50,{})}}/> : null:null}
//         </h5>
//         <h6 className="
//           text-xs
//           dark:text-emerald-200
//           text-text-soft
//           opacity-70
//         ">
//           {story.status}
//         </h6>

//       </div>
//     </div>
//   );
// }
import truncate from "html-truncate";
import Paths from "../core/paths";
import { PageType } from "../core/constants";
import shortName from "../core/shortName";

export default function StoryDashboardItem({ story, router }) {
return (
<div
onClick={() => router.push(Paths.page.createRoute(story.id))}
className="w-[100%] h-[8rem] border border-blue dark:border-info-blue rounded-2xl shadow-md bg-base-bg dark:bg-text-primary px-4 py-3 flex flex-col justify-between hover:scale-[1.01] transition cursor-pointer"
>
<div className="flex flex-col gap-1 min-w-0">
<h4 className="text-[1.05rem] text-text-primary dark:text-base-surface break-words line-clamp-2">
{shortName(story.title, 30)}
</h4>
<h5 className="text-sm text-text-secondary dark:text-text-secondary opacity-80 line-clamp-3">
</h5>
<h6 className="text-xs text-text-secondary dark:text-base-surface opacity-70">
{story.status}
</h6>
</div>
</div>
  );
}