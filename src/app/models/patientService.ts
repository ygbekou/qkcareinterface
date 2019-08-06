import { Visit } from './visit';
import { Admission } from './admission';
import { Service } from './service';
import { Package } from './package';


export class PatientService {
  id: number;
  serviceDate: Date;
  admission: Admission;
  visit: Visit;
  service: Service;
  notes: string;
  
  constructor() {
    this.service = new Service();
  }
}


export class PatientPackage {
  id: number;
  packageDate: Date;
  admission: Admission;
  visit: Visit;
  pckage: Package;
  notes: string;
  
  constructor() {
    this.pckage = new Package();
  }
}