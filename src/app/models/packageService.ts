import { Service } from './service';

export class PackageService {
  id: number;
  service: Service;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}