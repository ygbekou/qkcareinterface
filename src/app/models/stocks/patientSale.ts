import { Admission } from '../admission';
import { DoctorOrder } from '../doctorOrder';
import { Product } from '../product';
import { Visit } from '../visit';

export class PatientSale {
  id: number;
  admission: Admission;
  visit: Visit;
  doctorOrder: DoctorOrder;
  saleDatetime: Date = new Date();
  notes: string;
  subTotal: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  status: number;
  
  patientSaleProducts: PatientSaleProduct[] = [];
  
  constructor() {
    this.patientSaleProducts.push(new PatientSaleProduct())
  }
  
}

export class PatientSaleProduct {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  status: number;

  patientSale: PatientSale;

}