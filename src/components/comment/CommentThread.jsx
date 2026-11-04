
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
