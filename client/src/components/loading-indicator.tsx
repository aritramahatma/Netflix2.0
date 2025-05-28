export function LoadingIndicator({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <div className="loading-dots">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <span className="text-muted-foreground ml-4">{text}</span>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-none w-48 animate-pulse">
      <div className="bg-muted rounded-lg h-72 mb-3"></div>
      <div className="bg-muted rounded h-4 mb-2"></div>
      <div className="bg-muted rounded h-3 w-16"></div>
    </div>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg h-64 md:h-72 mb-2"></div>
          <div className="bg-muted rounded h-4"></div>
        </div>
      ))}
    </div>
  );
}
