interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps): React.ReactElement {
  return <div className={`bg-[#1A1410] animate-pulse ${className}`} />;
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = "" }: SkeletonTextProps): React.ReactElement {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`bg-[#1A1410] animate-pulse h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

interface ButtonSpinnerProps {
  className?: string;
}

export function ButtonSpinner({ className = "" }: ButtonSpinnerProps): React.ReactElement {
  return (
    <svg
      className={`animate-spin h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
