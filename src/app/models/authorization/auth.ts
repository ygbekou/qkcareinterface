
export class Role {
  id: number;
  name: string;
  description: string;
  status: number;
}


export class Resource {
  id: number;
  parent: Resource;
  name: string;
  urlPath: string; 
  description: string;
  status: number;
}