import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Edit3 } from "lucide-react";
import { useUpdateProgress } from "@/hooks/use-content";
import type { ContentWithProgress } from "@/types/content";

interface ProgressControlsProps {
  content: ContentWithProgress;
  compact?: boolean;
}

export function ProgressControls({ content, compact = false }: ProgressControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customProgress, setCustomProgress] = useState(
    content.progress?.progressPercentage?.toString() || "0"
  );
  const updateProgress = useUpdateProgress();

  const currentProgress = content.progress?.progressPercentage || 0;
  const isCompleted = content.progress?.status === 'completed';

  const handleProgressUpdate = (percentage: number) => {
    const status = percentage >= 100 ? 'completed' : 'in_progress';
    updateProgress.mutate({
      contentId: content.id,
      status,
      progressPercentage: percentage,
    });
    
    if (percentage >= 100) {
      setIsOpen(false);
    }
  };

  const handleCustomSubmit = () => {
    const percentage = Math.min(100, Math.max(0, parseInt(customProgress) || 0));
    handleProgressUpdate(percentage);
    setIsOpen(false);
  };

  const presetButtons = [25, 50, 75, 100];

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {presetButtons.map((percentage) => (
          <Button
            key={percentage}
            variant={currentProgress >= percentage ? "default" : "outline"}
            size="sm"
            onClick={() => handleProgressUpdate(percentage)}
            className="text-xs px-2 py-1 h-6"
            data-testid={`button-progress-${percentage}-${content.id}`}
            disabled={updateProgress.isPending}
          >
            {percentage === 100 ? "✓" : `${percentage}%`}
          </Button>
        ))}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-6"
              data-testid={`button-custom-progress-${content.id}`}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
              <DialogDescription>
                Set your learning progress for "{content.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="custom-progress">Custom Progress:</Label>
                <Input
                  id="custom-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={customProgress}
                  onChange={(e) => setCustomProgress(e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <div className="space-y-2">
                <Label>Quick Options:</Label>
                <div className="flex space-x-2">
                  {presetButtons.map((percentage) => (
                    <Button
                      key={percentage}
                      variant={currentProgress >= percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCustomProgress(percentage.toString())}
                      className="flex-1"
                    >
                      {percentage === 100 ? "Complete" : `${percentage}%`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCustomSubmit}
                disabled={updateProgress.isPending}
                className="w-full"
              >
                {updateProgress.isPending ? "Updating..." : "Update Progress"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Learning Progress</span>
        {isCompleted && (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-accent h-2 rounded-full transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{currentProgress}% Complete</span>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs">
              Update Progress
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
              <DialogDescription>
                Set your learning progress for "{content.title}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="custom-progress">Custom Progress:</Label>
                <Input
                  id="custom-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={customProgress}
                  onChange={(e) => setCustomProgress(e.target.value)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <div className="space-y-2">
                <Label>Quick Options:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {presetButtons.map((percentage) => (
                    <Button
                      key={percentage}
                      variant={currentProgress >= percentage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCustomProgress(percentage.toString())}
                    >
                      {percentage === 100 ? "Complete" : `${percentage}%`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCustomSubmit}
                disabled={updateProgress.isPending}
                className="w-full"
              >
                {updateProgress.isPending ? "Updating..." : "Update Progress"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}