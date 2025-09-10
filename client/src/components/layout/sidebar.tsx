import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchIcon, BookmarkIcon, BarChart3Icon, StarIcon, BookOpenIcon } from "lucide-react";
import { ProgressCircle } from "@/components/progress/progress-circle";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import type { ProgressStats } from "@/types/content";

interface SidebarProps {
  progressStats?: ProgressStats;
}

export function Sidebar({ progressStats }: SidebarProps) {
  const [location] = useLocation();

  const navigationItems = [
    {
      href: "/",
      label: "Discover",
      icon: SearchIcon,
      isActive: location === "/"
    },
    {
      href: "/saved",
      label: "Saved Content",
      icon: BookmarkIcon,
      isActive: location === "/saved"
    },
    {
      href: "/progress",
      label: "Progress",
      icon: BarChart3Icon,
      isActive: location === "/progress"
    }
  ];

  return (
    <aside className="lg:col-span-1">
      <div className="space-y-6">
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4" data-testid="text-navigation-title">Navigation</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={item.isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start space-x-3",
                        item.isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                      data-testid={`button-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </CardContent>
        </Card>

       
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4" data-testid="text-progress-title">Learning Progress</h2>
            <div className="space-y-4">
              <div className="text-center">
                <ProgressCircle
                  percentage={progressStats?.totalProgress || 0}
                  className="mx-auto mb-2"
                />
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium" data-testid="text-completed-count">
                    {progressStats?.completed || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In Progress</span>
                  <span className="font-medium" data-testid="text-in-progress-count">
                    {progressStats?.inProgress || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Saved</span>
                  <span className="font-medium" data-testid="text-saved-count">
                    {progressStats?.saved || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4" data-testid="text-activity-title">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <StarIcon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Welcome to LearnHub!</p>
                  <p className="text-xs text-muted-foreground">Start exploring learning content</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Search for content</p>
                  <p className="text-xs text-muted-foreground">Use the search bar above</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
