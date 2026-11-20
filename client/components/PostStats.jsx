import { EyeIcon, CommentIcon, HeartIcon } from "@/components/icons.jsx";

// Views / comments / heart row. Numbers are optional: whatever is missing is hidden.
export default function PostStats({ views, comments, likes, showLabels = false, className = "" }) {
  const hasViews = views !== undefined && views !== null;
  const hasComments = comments !== undefined && comments !== null;
  return (
    <div className={`flex items-center gap-4 text-xs text-neutral-600 ${className}`}>
      {hasViews && (
        <span className="inline-flex items-center gap-1.5">
          <EyeIcon className="h-4 w-4" />
          {showLabels ? `${views} views` : views}
          {!showLabels && <span className="sr-only">views</span>}
        </span>
      )}
      {hasComments && (
        <span className="inline-flex items-center gap-1.5">
          <CommentIcon className="h-4 w-4" />
          {showLabels ? `${comments} comments` : comments}
          {!showLabels && <span className="sr-only">comments</span>}
        </span>
      )}
      <span className="ml-auto inline-flex items-center gap-1.5">
        <HeartIcon className="h-4 w-4" />
        {likes !== undefined && likes !== null && (showLabels ? `${likes} likes` : likes)}
      </span>
    </div>
  );
}
