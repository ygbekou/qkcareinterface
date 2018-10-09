import { Admission } from './admission';
import { Appointment } from './appointment';
import { Employee } from './employee';
import { LabTest } from './labTest';
import { Product } from './product';
import { Reference } from './reference';
import { Service } from './service';
import { Visit } from './visit';

import { Constants } from '../app.constants';

export class DoctorOrder {
  id: number;
  admission: Admission;
  visit: Visit;
  doctorOrderType: Reference;
  doctorOrderPriority: Reference;
  doctorOrderKind: Reference;
  doctor: Employee;
  doctorOrderDatetime: Date;
  receivedDatetime: Date;
  description: string;
  status: Reference = new Reference();
  
  labTests: LabTest[] = [];
  products: Product[] = [];
  
  constructor() {
    this.doctorOrderType = new Reference();
    this.status = new Reference();
    this.status.id = Constants.DOCTOR_ORDER_STATUS_PENDING;
    this.status.name = 'PENDING';
  }
  
}