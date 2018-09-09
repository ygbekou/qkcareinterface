import { Reference } from './reference';

export class LabTest {
  id: number;
  labTestMethod: Reference;
  parent: Reference;
  name: string;
  description: string;
  normalRangeMinimum: number;
  normalRangeMaximum: number;
  criticalLow: number;
  criticalHigh: number;
  unit: Reference; 
  status: number;
}