import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/lib/api";
import { useSavedContent } from "@/hooks/use-content";
import { ProgressCircle } from "@/components/progress/progress-circle";

import { ProgressControls } from "@/components/progress/progress-controls";
export default function ProgressPage() {
  const { data: allProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: progressApi.getAll,
  });

  const { data: progressStats } = useQuery({
    queryKey: ["/api/progress/stats"],
    queryFn: progressApi.getStats,
  });

  const { data: savedContent } = useSavedContent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
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
                Learning Progress
              </h2>
              <p className="text-muted-foreground mt-1" data-testid="text-progress-description">
                Track your learning journey and achievements
              </p>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <ProgressCircle
                      percentage={progressStats?.totalProgress || 0}
                      size="sm"
                    />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {progressStats?.totalProgress || 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Complete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-foreground" data-testid="text-completed-total">
                      {progressStats?.completed || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">courses</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-foreground" data-testid="text-in-progress-total">
                      {progressStats?.inProgress || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">courses</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {progressLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-muted rounded w-full mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : allProgress && allProgress.length > 0 ? (
                  <div className="space-y-6">
                    {allProgress.map((progress) => (
                      <div key={progress.id} className="space-y-2" data-testid={`progress-item-${progress.id}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">
                            Content ID: {progress.contentId}
                          </h4>
                          <Badge className={getStatusColor(progress.status)}>
                            {getStatusText(progress.status)}
                          </Badge>
                        </div>
                        <Progress value={progress.progressPercentage} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{progress.progressPercentage}% complete</span>
                          <span>
                            Last updated: {new Date(progress.lastUpdated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No progress data available</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start learning some content to see your progress here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
