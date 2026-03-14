import { apiGet } from "./client";

export interface AnalysisItem {
  id: number;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  testDate: string;
  patientId: number;
}

export function getAnalysesByPatientId(patientId: number): Promise<AnalysisItem[]> {
  return apiGet<AnalysisItem[]>(`/analyses/patient/${patientId}`);
}
