import { User } from '../user';

export class Role {
  id: number;
  name: string;
  description: string;
  status: number;
  homePage: Resource;

  permissions: Permission[] = [];

  public static PACKAGE = 'com.qkcare.model.authorization.Role';
}


export class Resource {
  id: number;
  name: string;
  urlPath: string; 
  description: string;
  status: number;

  public static PACKAGE = 'com.qkcare.model.authorization.Resource';
}

export class UserRole {
  id: number;
  user: User;
  role: Role;
  status: number;

  public static PACKAGE = 'com.qkcare.model.authorization.UserRole';
}

export class Permission {
  id: number;
  role: Role;
  resource: Resource;
  canAddBool: boolean;
  canEditBool: boolean;
  canViewBool: boolean;
  canDeleteBool: boolean;
  status: number;

  resourceParentName: string;
  resourceName: string;
  resourceUrlPath: string;

  constructor(role: Role, resource: Resource) {
    this.role = role;
    this.resource = resource;
    this.resourceName = resource.name;
    this.resourceUrlPath = resource.urlPath;
  }

  public static PACKAGE = 'com.qkcare.model.authorization.Permission';
}

export class MenuItem {
  id: number;
  parent: MenuItem;
  resource: Resource;
  language: string;
  label: string;
  icon: string; 
  description: string;
  status: number;

  public static PACKAGE = 'com.qkcare.model.authorization.MenuItem';
}
