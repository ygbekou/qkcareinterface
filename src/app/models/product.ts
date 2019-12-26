import { Reference } from './reference';

export class Product {
  id: number;
  category: Reference;
  manufacturer: Reference;
  brand: Reference;
  name: string;
  description: string;
  price: number;
  status: number;
  quantityInStock: number;
}