import { Skeleton } from "./Skeleton";

export function KPICardSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410] p-5">
      <div className="flex items-center justify-between mb-1">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-28 mt-2" />
      <Skeleton className="h-3 w-24 mt-2" />
    </div>
  );
}

export function ListItemSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410] p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-3 w-48 mt-2" />
    </div>
  );
}

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({ rows = 5 }: TableSkeletonProps): React.ReactElement {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-[#1A1410] border border-[#1A1410] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20 mt-1" />
            </div>
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardListSkeleton(): React.ReactElement {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-[#1A1410] last:border-0"
        >
          <div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40 mt-1" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export function CalendarGridSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410]">
      <div className="grid grid-cols-7 border-b border-[#1A1410]">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-3 flex justify-center">
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: 35 }).map((_, i) => (
          <div
            key={i}
            className="p-3 min-h-[80px] border-b border-r border-[#1A1410]"
          >
            <Skeleton className="h-4 w-5" />
            {i % 5 === 2 && (
              <>
                <Skeleton className="h-3 w-16 mt-2" />
                <Skeleton className="h-2 w-12 mt-1" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportCardSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410] p-6">
      <Skeleton className="h-4 w-24 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmployeeListItemSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410] p-4 flex items-center gap-4">
      <Skeleton className="w-12 h-12 shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20 mt-1" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="w-2 h-2" />
      </div>
    </div>
  );
}

export function MessageListItemSkeleton(): React.ReactElement {
  return (
    <div className="bg-[#1A1410] border border-[#1A1410] p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-3 w-full mt-2" />
      <Skeleton className="h-3 w-24 mt-1" />
    </div>
  );
}
