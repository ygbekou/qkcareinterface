import { Service, Employee, Package, Reference } from './';
import { Appointment } from './appointment';
import { Admission } from './admission';
import { Visit } from './visit';

export class Bill {
  id: number;
  admission: Admission;
  visit: Visit;
  appointment: Appointment;
  billDate: Date = new Date();
  dueDate: Date;
  notes: string;
  subTotal: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  paid: number;
  due: number;
  status: number;
  
  billServices: BillService[] = [];
  billPayments: BillPayment[] = [];
  
}

export class BillPayment                                                                                                                                                {
  id: number;
  bill: Bill;
  paymentDate: Date;
  description: string;
  amount: number;
}

export class BillService {
  id: number;
  doctorOrderType: Reference;
  service: Service;
  pckage: Package;
  doctor: Employee;
  serviceDate: Date;
  description: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  netAmount: number;
  payerAmount: number;
  patientAmount: number;
}