import { Employee } from './Employee';
import { GivenVaccine } from './givenVaccine';
import { Package } from './package';
import { Patient } from './patient';
import { Reference } from './reference';
import { VitalSign } from './vitalSign';
import { Appointment } from './appointment';

export class Visit {
  id: number;
  chiefOfComplain: string;
  patient: Patient;
  pckage: Package;
  doctor: Employee;
  visitDatetime: Date = new Date();
  status: number;
  isHealthCheckupSel: number;
  appointment: Appointment;
  vitalSign: VitalSign;
  selectedAllergies: Reference[];
  selectedSymptoms: Reference[];
  selectedMedicalHistories: Reference[];
  selectedSocialHistories: Reference[];
  givenVaccines: GivenVaccine[] = [];
  
  constructor() {
    this.vitalSign = new VitalSign(); 
    this.selectedAllergies = [];
    this.selectedSymptoms = [];
    this.selectedMedicalHistories = [];
    this.selectedSocialHistories = [];
    this.givenVaccines = [];
  }
  
}