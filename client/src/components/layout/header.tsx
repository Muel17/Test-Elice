import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, BookmarkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount?: number;
}

export function Header({ searchQuery, onSearchChange, savedCount = 0 }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
 
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.23-.13 2.41-.4 3.5-.8C19.84 25.55 22 21.27 22 17V7l-10-5z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground" data-testid="text-logo">Test Elice</h1>
          </div>


          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                className="block w-full pl-10 pr-3 py-2"
                placeholder="Search for books, courses, tutorials..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-saved-content"
              >
                <BookmarkIcon className="w-6 h-6" />
              </Button>
              {savedCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs w-5 h-5 flex items-center justify-center p-0"
                  data-testid="badge-saved-count"
                >
                  {savedCount}
                </Badge>
              )}
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground" data-testid="text-user-initials">
                TE
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
