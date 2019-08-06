import { Reference } from './reference';
import { Room } from './room';

export class Bed {
  id: number;
  bedNumber: string;
  description: string;
  status: number;
  room: Room;
  rate: number;
  category: Reference;
}