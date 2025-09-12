
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export function NewspaperCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function TopicPillSkeleton() {
  return (
    <Skeleton className="h-8 w-24 rounded-full" />
  )
}

export function TopicResultCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
