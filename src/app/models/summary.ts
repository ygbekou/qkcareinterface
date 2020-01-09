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

export class SystemReviewQuestionAssignment {
  id: number;
  systemReviewQuestion: Reference;
  summaryType: SummaryType;
  description: string;
  
  constructor () {
    this.systemReviewQuestion = new Reference();
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

export class PhysicalExam {
  id: number;
  admission: Admission;
  visit: Visit;
  author: Employee;
  physicalExamDatetime: Date = new Date();
  physicalExamDate: string;
  shortMenu: string;
  
  selectedPhysicalExamSystems: number[];

  constructor() {
  }
  
}


export class PhysicalExamResult {
  id: number;
  physicalExam: PhysicalExam;
  physicalExamSystem: Reference;
  
  constructor() {
  }
  
}


export class SystemReview {
  id: number;
  admission: Admission;
  visit: Visit;
  author: Employee;
  systemReviewDatetime: Date = new Date();
  systemReviewDate: string;
  shortMenu: string;
  
  selectedSystemReviewQuestions: number[];

  constructor() {
  }
  
}


export class SystemReviewResult {
  id: number;
  systemReview: SystemReview;
  ystemReview: Reference;
  
  constructor() {
  }
  
}
