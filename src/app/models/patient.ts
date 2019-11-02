import { Country } from './country';
import { Insurance } from './insurance';
import { Reference } from './reference';
import { User } from './user';
import { VitalSign } from './vitalSign';
import { GivenVaccine } from './givenVaccine';
import { VaccineDetails } from '../components/admin/vaccineDetails';

export class Patient {
  id: number;
  medicalRecordNumber: string;
  user: User;
  religion: Reference;
  occupation: Reference;
  maritalStatus: Reference;
  nationality: Country;
  contact: string;
  contactPhone: string;
  referral: string;
  referralPhone: string;
  medicalHistory: string;
  name: string;
  bloodGroup: string;
  status: number;
  payerType: Reference;
  employer: string;
  authorizationLetterNumber: string;
  expiryDate: Date;
  employeeId: string;
  insurance: Insurance;
  policyNumber: string;
  insuranceExpiryDate: Date;
  isSelfResponsible = true;
  responsiblePartyFirstName: string;
  responsiblePartyLastName: string;
  accountNumber: string;
  payerTypeName: string;
  maritalStatusName: string;
  occupationName: string;
  nationalityName: string;
  vitalSign: VitalSign;
  visitReason: string;

  
  selectedAllergies: Reference[];
  selectedMedicalHistories: Reference[];
  selectedSocialHistories: Reference[];
  givenVaccines: GivenVaccine[] = [];
  
  errors: string[];

  constructor() {
    this.user = new User();
    this.vitalSign = new VitalSign();

    
    this.selectedAllergies = [];
    this.selectedMedicalHistories = [];
    this.selectedSocialHistories = [];
    this.givenVaccines = [];
  }
}


export class PatientVaccine {
  patient: Patient;
  vaccine: Reference;
  vaccineName: string;

  constructor(patientId: number) {
    this.patient = new Patient();
    this.patient.id = patientId;
  }
}