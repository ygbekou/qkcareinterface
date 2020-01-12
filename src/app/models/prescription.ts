import { Product } from './';
import { Admission } from './admission'; 
import { Visit } from './visit';
import { Employee } from './Employee';

export class Prescription {
  id: number;
  admission: Admission;
  visit: Visit;
  prescriptionType: string;
  prescriptionDatetime: Date;
  notes: string;
  isDischarge = false;
  status: number;
  doctor: Employee;
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
