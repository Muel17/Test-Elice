import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { ContentGrid } from "@/components/content/content-grid";
import { useSavedContent } from "@/hooks/use-content";
import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/lib/api";
import type { ContentWithProgress } from "@/types/content";

export default function SavedContent() {
  const { data: savedContent, isLoading, error } = useSavedContent();
  
  const { data: progressStats } = useQuery({
    queryKey: ["/api/progress/stats"],
    queryFn: progressApi.getStats,
  });

  const handleStartLearning = (content: ContentWithProgress) => {
    if (content.url) {
      window.open(content.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery=""
        onSearchChange={() => {}}
        savedCount={savedContent?.length || 0}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar progressStats={progressStats} />
          
          <main className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
                Saved Content
              </h2>
              <p className="text-muted-foreground mt-1" data-testid="text-saved-description">
                Your bookmarked learning resources
              </p>
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">Error loading saved content</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Please try again or check your connection.
                </p>
              </div>
            )}

            {!error && (
              <ContentGrid
                content={savedContent || []}
                isLoading={isLoading}
                onStartLearning={handleStartLearning}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
