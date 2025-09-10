export interface Content {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  source: string;
  externalId?: string | null;
  contentType: 'book' | 'article' | 'video' | 'course';
  category?: string | null;
  rating?: string | null;
  author?: string | null;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  contentId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  lastUpdated: string;
}

export interface ContentWithProgress extends Content {
  progress?: Progress;
  isSaved?: boolean;
}

export interface SearchFilters {
  category?: string;
  contentType?: string;
  sortBy?: 'relevance' | 'date' | 'rating' | 'title';
}

export interface ProgressStats {
  completed: number;
  inProgress: number;
  saved: number;
  totalProgress: number;
}
