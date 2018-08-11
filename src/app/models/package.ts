import { PackageService } from './packageService';

export class Package {
  id: number;
  name: string;
  description: number;
  discount: number;
  status: number;
  statusDesc: string;
  
  packageServices: PackageService[] = [];
  
}