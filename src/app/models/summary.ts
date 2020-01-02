import { Admission } from './admission';
import { Reference } from './reference';
import { Visit } from './visit';
import { Employee } from './employee';


export class Summary {
  id: number;
  admission: Admission;
  visit: Visit;
  summaryType: SummaryType;
  summaryStatus: Reference;
  author: Employee;
  summaryDatetime: Date = new Date();
  description: string;
  subject: string;
  summaryDate: string;
  shortMenu: string;
  
  constructor() {
	  this.summaryType = new SummaryType();
    this.summaryStatus = new Reference();
  }
  
}

export class SummaryType {
  id: number;
  userGroup: Reference;
  name: string;
  
  constructor () {
    this.userGroup = new Reference();
  }
}

export class PhysicalExamTypeAssignment {
  id: number;
  physicalExamType: Reference;
  summaryType: SummaryType;
  description: string;
  
  constructor () {
    this.physicalExamType = new Reference();
    this.summaryType = new SummaryType();
  }
}

export class SummaryTypeTemplate {
  id: number;
  summaryType: SummaryType;
  template: string;
  
  constructor () {
    this.summaryType = new SummaryType();
  }
}