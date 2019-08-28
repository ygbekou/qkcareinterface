import { Reference } from "../reference";
import { Admission } from '../admission';
import { Visit } from '../visit';
import { Employee } from "..";


export class RadExam {
  id: number;
  name: string;
  description: string;
  status: number;
  rate: number;
  modality: Reference;

  constructor() {
    this.modality = new Reference();
  }
}


export class RadInvestigation {
  id: number;
  admission: Admission;
  visit: Visit;
  investigationDatetime: Date;
  exam: RadExam;
  name: string;
  description: string;
  status: number;
  assignTo: Employee;
  assignDatetime: Date;
  rejectionDatetime: Date;
  rejectionComments: string;
  completeDatetime: Date;
  completeComments: string;
  examStatus: Reference;
  
  constructor() {
	this.exam = new RadExam();
  }
}
