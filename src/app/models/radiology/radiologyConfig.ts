import { Reference } from "../reference";
import { Admission } from '../admission';
import { Visit } from '../visit';
import { Employee } from "..";
import { GenericService } from "src/app/services/generic.service";
import { DropdownUtil } from "src/app/components/dropdowns/dropdown.util";


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
  name: string;
  description: string;
  status: number;
  assignTo: Employee;
  assignDatetime: Date;
  rejectionDatetime: Date;
  completeDatetime: Date;
  examStatus: Reference;

  investigationExams: RadInvestigationExam[] = [];
  investigationComments: RadInvestigationComment[] = [];
  
}


export class RadInvestigationExam {
  id: number;
  exam: RadExam;
  modality: Reference;
  comments: string;

  filteredExams: RadExam[];
  exams: RadExam[] = [];

  constructor(
	   public genericService: GenericService,
  ) {
	  this.exam = new RadExam();
  }


  populateExams(event) {
    const parameters: string[] = [];

    parameters.push('e.modality.id = |modalityId|' + this.modality.id + '|Long');

    this.genericService.getAllByCriteria('RadExam', parameters)
      .subscribe((data: any[]) => {
        this.exams = data;
      },
      error => console.log(error),
      () => console.log('Get Exam List complete'));
  }


  filter(event) {
    this.filteredExams = DropdownUtil.filter(event, this.exams);
  }

  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredExams = this.exams;
    }, 10)
  }
}


export class RadInvestigationComment {
  id: number;
  commentDatetime: Date;
  title: string;
  comments: string;

  investigation: RadInvestigation = null;

  constructor() {
	  
  }
}
