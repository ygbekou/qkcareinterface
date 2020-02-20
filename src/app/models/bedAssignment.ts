import { Bed } from './bed';

export class BedAssignment {
  id: number;
  bed: Bed;
  startDate: Date;
  endDate: Date;  
  transferBed: Bed;
  transferDate: Date;
}