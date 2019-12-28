import {
  Admission, Visit, Appointment, PatientService, PatientPackage,
  Investigation, Service, Package, Product, LabTest, BedAssignment, Employee, Reference
} from '.';

import { PatientSaleProduct } from './stocks/patientSale';

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

export class BillPayment {
  id: number;
  bill: Bill;
  paymentDate: Date;
  description: string;
  amount: number;
}

export class BillService {
  id: number;
  doctorOrderType: Reference;
  patientService: PatientService;
  patientPackage: PatientPackage;
  patientSaleProduct: PatientSaleProduct;
  investigation: Investigation;

  service: Service;
  pckage: Package;
  product: Product;
  labTest: LabTest;

  bedAssignment: BedAssignment;
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
  systemGenerated: string;

  constructor() {
    this.doctorOrderType = new Reference();
  }
}
