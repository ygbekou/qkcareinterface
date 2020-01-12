export class Reference {
  id: number;
  name: string;
  description: string;
  status: number;
  parent: Reference;
  parentId1: number;
  childs: Reference[];
}
