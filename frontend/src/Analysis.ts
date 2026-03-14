export interface AnalysisEntry {
  id: number;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  testDate: string;
  patientId?: number;
  patientName?: string;
}
