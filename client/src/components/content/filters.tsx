import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchFilters } from "@/types/content";

interface FiltersProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onClearFilters: () => void;
}

export function Filters({ filters, onFilterChange, onClearFilters }: FiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Category:</label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => onFilterChange('category', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-40" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="web-dev">Web Dev</SelectItem>
                <SelectItem value="ux-design">UX Design</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="react">React</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Type:</label>
            <Select
              value={filters.contentType || "all"}
              onValueChange={(value) => onFilterChange('contentType', value === 'all' ? '' : value)}
            >
              <SelectTrigger className="w-32" data-testid="select-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book">Books</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="article">Articles</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <Select
              value={filters.sortBy || "relevance"}
              onValueChange={(value) => onFilterChange('sortBy', value)}
            >
              <SelectTrigger className="w-32" data-testid="select-sort">
                <SelectValue placeholder="Relevance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="ml-auto"
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
