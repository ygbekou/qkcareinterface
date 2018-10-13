import { HospitalLocation } from './';
import { Department, Employee, Reference } from './';

export class SearchCriteria {
  id: number;
  lastName: string;
  firstName: string;
  birthDate: Date;
  department: Department;
  hospitalLocation: HospitalLocation;
  doctor: Employee;
  medicalRecordNumber: string;
  visitId: number;
  admissionId: number;
  supplier: Reference;
  requestor: Reference;
  shipTo: Reference;
  purchaseOrderDate: Date;
  
}