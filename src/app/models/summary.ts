import { Admission } from './admission';
import { Reference } from './reference';
import { Visit } from './visit';
import { Employee } from './employee';
import { InvestigationTest } from './investigation';
import { AdmissionDiagnosis } from './admissionDiagnosis';



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
  subjective: string;
  objective: string;
  summaryDate: string;
  shortMenu: string;

  chiefOfComplain: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  familyHistory: string;
  socialHistory: string;
  surgicalHistory: string;
  homeMedications: string;
  medications: string;
  allergies: string;
  immunizations: string;
  codeStatus: Reference;
  assessment: string;
  plan: string;
  primaryCarePhysician: string;
  powerOfAttorney: string;
  disposition: string;
  
  admissionDiagnoses: AdmissionDiagnosis [];
  selectedSystemReviewQuestionIds
  selectedPhysicalExamSystemIds
  investigationTests: InvestigationTest []
  investigationJsonObjects: any [][]
  summaryVitalSigns: SummaryVitalSign []

  constructor() {
    this.summaryType = new SummaryType();
    this.summaryStatus = new Reference();
    this.codeStatus = new Reference();
  }

}

export class SummaryVitalSign {
  id: number;
  name: string;
  lastResult: string;
  minimum: string;
  maximum: string;

  constructor() {
  }
}

export class SummaryType {
  id: number;
  userGroup: Reference;
  name: string;

  constructor() {
    this.userGroup = new Reference();
  }
}

export class PhysicalExamTypeAssignment {
  id: number;
  physicalExamType: Reference;
  summaryType: SummaryType;
  description: string;

  constructor() {
    this.physicalExamType = new Reference();
    this.summaryType = new SummaryType();
  }
}

export class SystemReviewQuestionAssignment {
  id: number;
  systemReviewQuestion: Reference;
  summaryType: SummaryType;
  description: string;

  constructor() {
    this.systemReviewQuestion = new Reference();
    this.summaryType = new SummaryType();
  }
}

export class SummaryTypeTemplate {
  id: number;
  summaryType: SummaryType;
  template: string;

  constructor() {
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
