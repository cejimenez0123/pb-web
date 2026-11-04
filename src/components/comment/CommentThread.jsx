
// // import Comment from "./Comment";

// // export default function CommentThread({ page, comments, level = 0 ,rawComments}) {
// //   return (
// //     <div className="bg-cream dark:bg-base-bgDark pl-1">
// //       {comments.map((com) => (
// //         <Comment key={com.id} page={page} comment={com} level={level + 1} />
// //       ))}
// //     </div>
// //   );
// // }
// import Comment from "./Comment";
// import styles from "../../styles/style";

// export default function CommentThread({
//   page,
//   comments,
//   level = 0,
// }) {
//   if (!comments?.length) return null;

//   return (
//     <div className={styles.hash.thread}>
//       {comments.map((comment) => (
//         <Comment
//           key={comment.id}
//           page={page}
//           comment={comment}
//           level={level + 1}
//         />
//       ))}
//     </div>
//   );
// }

import Comment from "./Comment";
import styles from "../../styles/style";

export default function CommentThread({
  page,
  comments,
  level = 0,
}) {
  if (!comments?.length) return null;

  return (
    <div className={styles.hash.thread}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          page={page}
          comment={comment}
          level={level + 1}
        />
      ))}
    </div>
  );
}
