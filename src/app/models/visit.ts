import { Employee } from './Employee';
import { Package } from './package';
import { Patient } from './patient';
import { Reference } from './reference';
import { VitalSign } from './vitalSign';
import { Appointment } from './appointment';
import { Service } from './service';

export class Visit {
  id: number;
  chiefOfComplain: string;
  patient: Patient;
  pckage: Package;
  service: Service;
  doctor: Employee;
  visitDatetime: Date = new Date();
  status: number = 0;
  isHealthCheckupSel: number;
  appointment: Appointment;
  vitalSign: VitalSign;
  selectedSymptoms: Reference[];
  
  constructor() {
    this.vitalSign = new VitalSign(); 
    this.selectedSymptoms = [];
  }
  
}