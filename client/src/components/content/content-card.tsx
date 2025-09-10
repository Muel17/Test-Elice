import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentWithProgress } from "@/types/content";
import { useSaveContent, useUnsaveContent, useUpdateProgress } from "@/hooks/use-content";
import { ProgressControls } from "@/components/progress/progress-controls";
interface ContentCardProps {
  content: ContentWithProgress;
  onStartLearning?: (content: ContentWithProgress) => void;
}

export function ContentCard({ content, onStartLearning }: ContentCardProps) {
  const saveContent = useSaveContent();
  const unsaveContent = useUnsaveContent();
  const updateProgress = useUpdateProgress();

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (content.isSaved) {
      unsaveContent.mutate(content.id);
    } else {
      saveContent.mutate(content.id);
    }
  };

  const handleStartLearning = () => {
    // Allow user to start/restart learning even if completed
    if (!content.progress || content.progress.status === 'completed') {
      updateProgress.mutate({
        contentId: content.id,
        status: 'in_progress',
        progressPercentage: 5
      });
    }
    onStartLearning?.(content);
  };

  const handleContinue = () => {
    onStartLearning?.(content);
  };

  const getRatingStars = (rating: string | null | undefined) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={cn(
                "w-4 h-4",
                i < fullStars || (i === fullStars && hasHalfStar)
                  ? "fill-current"
                  : "text-gray-300 fill-current"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  const getCategoryColor = (category: string | null | undefined) => {
    switch (category) {
      case 'programming':
        return 'bg-accent/10 text-accent';
      case 'react':
        return 'bg-primary/10 text-primary';
      case 'science':
      case 'data-science':
        return 'bg-green-100 text-green-700';
      case 'design':
      case 'ux-design':
        return 'bg-purple-100 text-purple-700';
      case 'python':
        return 'bg-blue-100 text-blue-700';
      case 'web-dev':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressStatus = () => {
    if (!content.progress) return null;
    
    switch (content.progress.status) {
      case 'completed':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              In Progress - {content.progress.progressPercentage}%
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    if (content.progress?.status === 'completed') {
      return (
        <Button variant="secondary" size="sm" disabled className="text-sm font-medium">
          ✓ Completed
        </Button>
      );
    } else if (content.progress?.status === 'in_progress') {
      return (
        <Button variant="secondary" size="sm" onClick={handleContinue} className="text-sm font-medium">
          Continue
        </Button>
      );
    } else {
      return (
        <Button size="sm" onClick={handleStartLearning} className="text-sm font-medium">
          Start Learning
        </Button>
      );
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-content-${content.id}`}>
      <div className="relative">
        <img
          src={content.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=240"}
          alt={`${content.title} cover`}
          className="w-full h-48 object-cover"
          data-testid={`img-cover-${content.id}`}
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={cn("text-xs font-medium", getCategoryColor(content.category))}>
            {content.category || 'General'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmarkToggle}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
            data-testid={`button-bookmark-${content.id}`}
          >
            <BookmarkIcon
              className={cn(
                "w-5 h-5 transition-colors",
                content.isSaved
                  ? "fill-current text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            />
          </Button>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-title-${content.id}`}>
          {content.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-description-${content.id}`}>
          {content.description || 'No description available'}
        </p>


        {/* Only allow progress update if content is saved */}
        <div className="mb-4">
          {content.isSaved ? (
            content.progress?.status === 'in_progress' ? (
              <div className="p-3 bg-secondary/20 rounded-lg">
                <ProgressControls content={content} compact={true} />
              </div>
            ) : (
              <ProgressControls content={content} compact={false} />
            )
          ) : (
            <div className="text-xs text-muted-foreground italic">Save this content to track and update your progress.</div>
          )}
        </div>

      
        <div className="flex items-center justify-between">
          {getProgressStatus() || getRatingStars(content.rating)}
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
}
