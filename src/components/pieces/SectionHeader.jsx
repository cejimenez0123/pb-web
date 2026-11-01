// function SectionHeader({
//   eyebrow,
//   title,
//   description,
//   actionLabel,
//   onAction,
// }) {
//   return (
//     <div
//       className="
//         mb-4
//         border-b
//         border-card-border
//         pb-3
//       "
//     >
//       <div
//         className="
//           flex
//           items-end
//           justify-between
//           gap-4
//         "
//       >
//         <div className="min-w-0">
//           {eyebrow && (
//             <p
//               className="
//                 mb-1
//                 text-xs
//                 font-medium
//                 uppercase
//                 tracking-[0.12em]
//                 text-text-secondary
//               "
//             >
//               {eyebrow}
//             </p>
//           )}

//           <h2
//             className="
//               font-serif
//               text-2xl
//               font-semibold
//               leading-tight
//               text-text-primary
//               sm:text-3xl
//             "
//           >
//             {title}
//           </h2>

//           {description && (
//             <p
//               className="
//                 mt-1
//                 max-w-xl
//                 text-sm
//                 leading-relaxed
//                 text-text-secondary
//               "
//             >
//               {description}
//             </p>
//           )}
//         </div>

//         {actionLabel && onAction && (
//           <button
//             type="button"
//             onClick={onAction}
//             className="
//               shrink-0
//               text-sm
//               font-medium
//               text-text-brand
//               transition-opacity
//               hover:opacity-70
//             "
//           >
//             {actionLabel}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default  SectionHeader

import styles from "../../styles/style";

function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}) {
  const s = styles.sectionHeader;

  return (
    <div className={s.container}>
      <div className={s.layout}>
        <div className={s.content}>
          {eyebrow && (
            <p className={s.eyebrow}>
              {eyebrow}
            </p>
          )}

          <h2 className={s.title}>
            {title}
          </h2>

          {description && (
            <p className={s.description}>
              {description}
            </p>
          )}
        </div>

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={s.action}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export default SectionHeader;
