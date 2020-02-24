import { Admission } from './';

export class VitalSign {
  id: number;
  admission: Admission;
  vitalSignDatetime: Date = new Date();
  temperature: number;
  pulse: number;
  respiratoryRate: number;
  heartRate: number;
  diastolicBloodPressure: number;
  systolicBloodPressure: number;
  meanBloodPressure: number;
  bloodSugar: number;
  pain: number;
  weight: number;
  height: number;
  bmi: number;
  
}