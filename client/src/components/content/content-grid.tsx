import { ContentCard } from "./content-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContentWithProgress } from "@/types/content";

interface ContentGridProps {
  content: ContentWithProgress[];
  isLoading?: boolean;
  onStartLearning?: (content: ContentWithProgress) => void;
}

export function ContentGrid({ content, isLoading, onStartLearning }: ContentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="content-grid-loading">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-12" data-testid="content-grid-empty">
        <p className="text-muted-foreground text-lg">No content found matching your search criteria.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="content-grid">
      {content.map((item) => (
        <ContentCard
          key={item.id}
          content={item}
          onStartLearning={onStartLearning}
        />
      ))}
    </div>
  );
}
