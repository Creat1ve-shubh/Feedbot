import { create } from "zustand";

export type AnalysisStep =
  | "idle"
  | "scraping"
  | "inferring"
  | "aggregating"
  | "done"
  | "error";

export const STEP_LABELS: Record<AnalysisStep, string> = {
  idle: "Ready",
  scraping: "Collecting data",
  inferring: "Running model inference",
  aggregating: "Aggregating results",
  done: "Analysis complete",
  error: "Analysis failed",
};

export const STEP_ORDER: AnalysisStep[] = [
  "idle",
  "scraping",
  "inferring",
  "aggregating",
  "done",
];

interface BrandState {
  brand: string;
  isLoading: boolean;
  analysisStep: AnalysisStep;
  taskId: string | null;
  error: string | null;
  resultCount: number;
  setBrand: (b: string) => void;
  setLoading: (v: boolean) => void;
  setAnalysisStep: (step: AnalysisStep) => void;
  setTaskId: (id: string | null) => void;
  setError: (e: string | null) => void;
  setResultCount: (n: number) => void;
  reset: () => void;
}

const initialState = {
  brand: "",
  isLoading: false,
  analysisStep: "idle" as AnalysisStep,
  taskId: null,
  error: null,
  resultCount: 0,
};

export const useBrandStore = create<BrandState>((set) => ({
  ...initialState,
  setBrand: (b) => set({ brand: b }),
  setLoading: (v) => set({ isLoading: v }),
  setAnalysisStep: (step) => set({ analysisStep: step }),
  setTaskId: (id) => set({ taskId: id }),
  setError: (e) => set({ error: e }),
  setResultCount: (n) => set({ resultCount: n }),
  reset: () => set(initialState),
}));
