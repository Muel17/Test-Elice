import { apiRequest } from "./queryClient";
import type { ContentWithProgress, SearchFilters, Progress, ProgressStats } from "@/types/content";

export const contentApi = {
  search: async (query: string, filters: SearchFilters = {}, limit = 20, offset = 0) => {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      ...filters
    });
    
    const response = await apiRequest("GET", `/api/content/search?${params}`);
    return response.json() as Promise<{
      content: ContentWithProgress[];
      total: number;
      hasMore: boolean;
    }>;
  },

  getSaved: async () => {
    const response = await apiRequest("GET", "/api/content/saved");
    return response.json() as Promise<ContentWithProgress[]>;
  },

  save: async (contentId: string) => {
    const response = await apiRequest("POST", `/api/content/${contentId}/save`);
    return response.json();
  },

  unsave: async (contentId: string) => {
    const response = await apiRequest("DELETE", `/api/content/${contentId}/save`);
    return response.json();
  },

  updateProgress: async (contentId: string, status: Progress['status'], progressPercentage: number) => {
    const response = await apiRequest("POST", `/api/content/${contentId}/progress`, {
      status,
      progressPercentage
    });
    return response.json() as Promise<Progress>;
  }
};

export const progressApi = {
  getAll: async () => {
    const response = await apiRequest("GET", "/api/progress");
    return response.json() as Promise<Progress[]>;
  },

  getStats: async () => {
    const response = await apiRequest("GET", "/api/progress/stats");
    return response.json() as Promise<ProgressStats>;
  }
};
