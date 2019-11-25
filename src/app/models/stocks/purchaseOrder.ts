import { Employee } from '../employee';
import { Product } from '../product';
import { Supplier } from '../supplier';
import { Reference } from '../reference';

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
  purchaseOrderStatus: Reference;
  status: number;
  error: string;
  
  purchaseOrderProducts: PurchaseOrderProduct[] = [];
  
  constructor() {
    this.purchaseOrderStatus = new Reference();
    this.purchaseOrderStatus.id = 1;
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
  receivedQuantity: number;
  receivedDatetime: Date;
  status: number;
}