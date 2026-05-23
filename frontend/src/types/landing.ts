export interface Task {
  id: string;
  title: string;
  description: string;
  status: "Backlog" | "InProgress" | "Review" | "Completed";
  assignee: string;
  hours: number;
  priority: "Low" | "Medium" | "High";
}

export interface MetricSummary {
  nodesSynced: number;
  almActivityIndex: number;
  activeDevelopers: number;
  sprintHours: number;
}

export interface AiDiagnosis {
  isDemo: boolean;
  productivityScore: number;
  burnoutRisk: "Low" | "Medium" | "High";
  burnoutExplanation: string;
  predictedBlockers: string[];
  recommendations: string[];
}
