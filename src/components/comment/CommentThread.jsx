
import Comment from "./Comment";

export default function CommentThread({ page, comments, level = 0 ,rawComments}) {
  return (
    <div className="bg-cream dark:bg-base-bgDark pl-1">
      {comments.map((com) => (
        <Comment key={com.id} page={page} comment={com} level={level + 1} />
      ))}
    </div>
  );
}