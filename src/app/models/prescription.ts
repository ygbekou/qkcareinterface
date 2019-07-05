import { Product } from './';
import { Admission } from './admission';
import { Appointment } from './appointment';
import { Patient } from './patient';
import { Diagnosis } from './diagnosis';
import { Visit } from './visit';

export class Prescription {
  id: number;
  admission: Admission;
  visit: Visit;
  prescriptionType: string;
  prescriptionDatetime: Date;
  notes: string;
  isDischarge: boolean = false;
  status: number;
  
  prescriptionMedicines: PrescriptionMedicine[] = [];
  prescriptionDiagnoses: PrescriptionDiagnosis[] = [];
}

export class PrescriptionMedicine {
  id: number;
  medicine: Product;
  medType: string;
  dosage: string;
  quantity: number;
  frequency: string;
  numberOfDays: number;
}

export class PrescriptionDiagnosis {
  id: number;
  diagnosis: string;
  instructions: string;
}