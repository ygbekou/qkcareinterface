import { Employee } from '../employee';
import { Product } from '../product';
import { Supplier } from '../supplier';

export class PurchaseOrder {
  id: number;
  supplier: Supplier;
  requestor: Employee;
  shipTo: Employee;
  purchaseOrderDate: Date = new Date();
  comments: string;
  subTotal: number;
  taxes: number;
  discount: number;
  grandTotal: number;
  paid: number;
  due: number;
  status: number;
  error: string;
  
  purchaseOrderProducts: PurchaseOrderProduct[] = [];
  
  constructor() {
    this.requestor = new Employee();
    this.shipTo = new Employee();
    this.supplier = new Supplier();
    this.purchaseOrderProducts.push(new PurchaseOrderProduct())
  }
  
}

export class PurchaseOrderProduct {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountPercentage: number;
  discountAmount: number;
  status: number;
}