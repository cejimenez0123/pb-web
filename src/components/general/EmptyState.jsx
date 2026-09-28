function EmptyState({
  title,
  description,
  action,
  onAction,
}) {
  return (
    <div
      className="
        flex
        min-h-44
        flex-col
        items-center
        justify-center
        border
        border-dashed
        border-border-soft
        bg-base-bg
        px-6
        
        py-10
        text-center
        sm:min-h-48
      "
    >
      <h3
        className="
          font-serif
          text-xl
          font-semibold
          text-text-primary
        "
      >
        {title}
      </h3>

      {description && (
        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {description}
        </p>
      )}

      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="
            mt-5
            inline-flex
            min-h-10
            items-center
            justify-center
            rounded-full
            border
            border-border-soft
            px-5
            py-2
            text-sm
            font-medium
            text-text-primary
            transition-colors
            hover:border-base-soft
            hover:text-text-brand
            focus:outline-none
            focus:ring-2
            focus:ring-base-soft
          "
        >
          {action}
        </button>
      )}
    </div>
  );
}
export default EmptyState