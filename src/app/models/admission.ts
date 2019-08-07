import { BedAssignment } from './bedAssignment';
import { DoctorAssignment } from './doctorAssignment';
import { Package } from './package';
import { Patient } from './patient';

export class Admission {
  id: number;
  admissionNumber: string;
  patient: Patient;
  pckage: Package;
  admissionDatetime: Date = new Date();
  admissionReason: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  contactAddress: string;
  status: number;
  bedAssignment: BedAssignment;
  doctorAssignment: DoctorAssignment;
  
}