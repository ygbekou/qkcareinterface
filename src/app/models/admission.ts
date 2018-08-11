import { Employee } from './Employee';
import { BedAssignment } from './bedAssignment';
import { DoctorAssignment } from './doctorAssignment';
import { Insurance } from './insurance';
import { Package } from './package';
import { Patient } from './patient';

export class Admission {
  id: number;
  admissionNumber: string;
  patient: Patient;
  pckage: Package;
  admissionDatetime: Date = new Date();
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  contactAddress: string;
  status: number;
  bedAssignment: BedAssignment;
  doctorAssignment: DoctorAssignment;
  
}