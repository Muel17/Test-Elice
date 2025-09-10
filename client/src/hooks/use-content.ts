import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contentApi } from "@/lib/api";
import type { SearchFilters } from "@/types/content";
import { useToast } from "@/hooks/use-toast";

export function useSearchContent(query: string, filters: SearchFilters = {}, limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["/api/content/search", query, filters, limit, offset],
    queryFn: () => contentApi.search(query, filters, limit, offset),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSavedContent() {
  return useQuery({
    queryKey: ["/api/content/saved"],
    queryFn: contentApi.getSaved,
  });
}

export function useSaveContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: contentApi.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/saved"] });
      toast({
        title: "Content saved",
        description: "The content has been added to your saved items.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving content",
        description: error.message || "Failed to save content. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUnsaveContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: contentApi.unsave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content/saved"] });
      toast({
        title: "Content removed",
        description: "The content has been removed from your saved items.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing content",
        description: error.message || "Failed to remove content. Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ contentId, status, progressPercentage }: {
      contentId: string;
      status: 'not_started' | 'in_progress' | 'completed';
      progressPercentage: number;
    }) => contentApi.updateProgress(contentId, status, progressPercentage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/content/saved"] });
      toast({
        title: "Progress updated",
        description: "Your learning progress has been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating progress",
        description: error.message || "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });
}
