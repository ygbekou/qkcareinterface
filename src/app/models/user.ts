import { UserGroup } from './userGroup';
import { Role } from '.';


export class User {
  id: number;
  userGroup: UserGroup;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  picture = 'user.jpg';
  sex: string;
  homePhone: string;
  mobilePhone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  birthDate: Date;
  status: number;
    // Transients
  confirmPassword: string;
  name: string;
  roles: Role[];

  constructor() {
    this.userGroup = new UserGroup();
  }
}