import { Eye } from "lucide-react";

interface ViewCountProps {
  views: number;
  className?: string;
}

export function ViewCount({ views, className = "" }: ViewCountProps) {
  return (
    <div
      className={`flex items-center gap-1 text-gray-500 dark:text-gray-400 ${className}`}
    >
      <Eye size={16} />
      <span className="text-sm">
        {views.toLocaleString()} {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}

export default ViewCount;
