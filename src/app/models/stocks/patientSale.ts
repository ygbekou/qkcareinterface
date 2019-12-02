import { Admission } from '../admission';
import { DoctorOrder } from '../doctorOrder';
import { Product } from '../product';
import { Visit } from '../visit';
import { Reference } from '../reference';

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
  paid: number;
  due: number;
  patientSaleStatus: Reference;
  status: number;
  
  patientSaleProducts: PatientSaleProduct[] = [];
  
  constructor() {
    this.patientSaleStatus = new Reference();
    this.patientSaleStatus.id = 1;
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
  deliveryQuantity: number;
  deliveryDatetime: Date;
  status: number;

  patientSale: PatientSale;

}