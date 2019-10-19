import { PackageService } from './packageService';

export class Package {
  id: number;
  name: string;
  description: number;
  grandTotal: number;
  rate: number;
  discount: number;
  status: number;
  statusDesc: string;
  
  packageServices: PackageService[] = [];
  
  constructor() {
    this.packageServices = [];
  }
  
}