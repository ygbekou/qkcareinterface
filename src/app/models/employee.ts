import { Department } from './department';
import { User } from './user';

export class Employee {
  id: number;
  user: User = new User();
  department: Department;
  designation: string;
  shortBiographie: string;
  specialist: string;
  resume: string;
  status: number;
  name: string;
}