import { Admission } from './admission';
import { Diagnosis } from './diagnosis';
import { Visit } from './visit';

export class AdmissionDiagnosis {
  id: number;
  admission: Admission;
  visit: Visit;
  diagnosis: Diagnosis;
  instructions: string;
  
  constructor() {
    this.diagnosis = new Diagnosis();
  }
}