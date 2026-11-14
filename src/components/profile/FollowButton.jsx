
import styles from "../../styles/style";

const FollowButton = ({
  isSelf = false,
  label,
  following = false,
  onClick,
  disabled = false,
}) => {
  if (isSelf) {
    return (
      <div
        className={
          styles.button.base +
          " " +
          styles.button.accent +
          " mx-4"
        }
      >
        Self
      </div>
    );
  }

  const isFollowing = Boolean(following);

  return (
    <div
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? "Unfollow profile" : "Follow profile"}
      className={
        styles.button.base +
        " " +
        (isFollowing
          ? styles.button.primary
          : styles.button.secondary)
      }
    >
      {label || (isFollowing ? "Following" : "Follow")}
    </div>
  );
};

export default FollowButton;
