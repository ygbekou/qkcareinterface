
export class AuthToken {
  id: number;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  token: string;
  roleName: string;
  picture: string;
  firstTimeLogin: string;
  authorities: number[];
  menus: MenuVO[];

  constructor() {
  }

}


export class MenuVO {
  id: number;
	label: string;
  routerLink: string[];
  icon: string;
	
	items: MenuVO[];
}
