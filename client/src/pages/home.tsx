import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Filters } from "@/components/content/filters";
import { ContentGrid } from "@/components/content/content-grid";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, ListIcon } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/lib/api";
import { useSavedContent } from "@/hooks/use-content";
import type { ContentWithProgress } from "@/types/content";

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchResults,
    totalResults,
    hasNextPage,
    isLoading,
    error
  } = useSearch();

  const { data: progressStats } = useQuery({
    queryKey: ["/api/progress/stats"],
    queryFn: progressApi.getStats,
  });

  const { data: savedContent } = useSavedContent();

  const handleStartLearning = (content: ContentWithProgress) => {
    if (content.url) {
      window.open(content.url, '_blank');
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchQuery={query}
        onSearchChange={setQuery}
        savedCount={savedContent?.length || 0}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar progressStats={progressStats} />
          
          <main className="lg:col-span-3">
            <Filters
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
            />

            {/* Search Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
                  {query ? `Search Results for "${query}"` : "Discover Learning Resources"}
                </h2>
                <p className="text-muted-foreground mt-1" data-testid="text-results-count">
                  {query ? `Found ${totalResults} resources` : "Search for educational content to get started"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <LayoutGridIcon className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <ListIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive text-lg">Error loading content</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Please try again or check your connection.
                </p>
              </div>
            )}

            {/* Content Grid */}
            {!error && (
              <ContentGrid
                content={searchResults}
                isLoading={isLoading}
                onStartLearning={handleStartLearning}
              />
            )}

            {/* Pagination */}
            {searchResults.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
                  </span>
                </div>
                
                <nav className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    data-testid="button-previous-page"
                  >
                    Previous
                  </Button>
                  
                  <span className="px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md">
                    {currentPage}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
