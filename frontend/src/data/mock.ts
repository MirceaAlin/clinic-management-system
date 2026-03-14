export interface Analysis {
  id: number;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  testDate: string;
  patientName: string;
}

export const mockAnalyses: Analysis[] = [
  { id: 1, testName: "Hemogramă completă", result: "13.2", unit: "g/dL",   normalRange: "12.0-16.0", testDate: "2025-11-10", patientName: "Mogage Razvan" },
  { id: 2, testName: "Glicemie",           result: "102",  unit: "mg/dL",  normalRange: "70-110",    testDate: "2025-11-07", patientName: "Mogage Razvan" },
  { id: 3, testName: "Colesterol total",   result: "189",  unit: "mg/dL",  normalRange: "<200",      testDate: "2025-10-29", patientName: "Mogage Razvan" },
  { id: 4, testName: "Vitamina D",         result: "28",   unit: "ng/mL",  normalRange: "30-100",    testDate: "2025-09-15", patientName: "Mogage Razvan" },
  { id: 5, testName: "Fier seric",         result: "72",   unit: "µg/dL",  normalRange: "50-170",    testDate: "2025-09-10", patientName: "Mogage Razvan" },
  { id: 6, testName: "Glicemie",           result: "95",   unit: "mg/dL",  normalRange: "70-110",    testDate: "2025-09-05", patientName: "Mogage Razvan" },
  { id: 7, testName: "Glicemie",           result: "108",  unit: "mg/dL",  normalRange: "70-110",    testDate: "2025-07-15", patientName: "Mogage Razvan" },
  { id: 8, testName: "Glicemie",           result: "105",  unit: "mg/dL",  normalRange: "70-110",    testDate: "2025-05-20", patientName: "Mogage Razvan" },
  { id: 9, testName: "Glicemie",           result: "100",  unit: "mg/dL",  normalRange: "70-110",    testDate: "2025-03-10", patientName: "Mogage Razvan" },
];
