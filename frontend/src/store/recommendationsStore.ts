import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Priority, Difficulty, RecommendationCategory } from "../types/recommendations";

export interface RecommendationsFilters {
  category: RecommendationCategory | "ALL";
  priority: Priority | "ALL";
  difficulty: Difficulty | "ALL";
  showCompleted: boolean;
}

export const defaultFilters: RecommendationsFilters = {
  category: "ALL",
  priority: "ALL",
  difficulty: "ALL",
  showCompleted: false,
};

interface RecommendationsStore {
  filters: RecommendationsFilters;
  setFilters: (filters: RecommendationsFilters) => void;
  resetFilters: () => void;
  selectedRecommendationId: string | null;
  setSelectedRecommendationId: (id: string | null) => void;
}

export const useRecommendationsStore = create<RecommendationsStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultFilters }),
      selectedRecommendationId: null,
      setSelectedRecommendationId: (id) => set({ selectedRecommendationId: id }),
    }),
    {
      name: "recommendations-store",
      partialize: (state) => ({ filters: state.filters }),
    }
  )
);
