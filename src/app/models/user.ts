import { UserGroup } from './userGroup';
import { Role } from '.';
import { BaseModel } from './baseModel';
export class User extends BaseModel {
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
    super();
    this.userGroup = new UserGroup();
  }
}
