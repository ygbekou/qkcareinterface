import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {trigger, state, style, transition, animate, AnimationEvent} from '@angular/animations';
import { Admission, User, Visit, Summary, Employee, SummaryTypeTemplate, Reference, PhysicalExam } from '../../models';
import { SummaryStatusDropdown, SummaryTypeDropdown, EmployeeDropdown, MedicalTeamDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { Message, ConfirmationService, SelectItem } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-physical-exam-details',
  templateUrl: '../../pages/admin/physicalExamDetails.html',
  providers: [GenericService, VisitService, EmployeeDropdown, SummaryStatusDropdown, SummaryTypeDropdown, MedicalTeamDropdown],
})
export class PhysicalExamDetails extends BaseComponent implements OnInit, OnDestroy {

  physicalExam: PhysicalExam = new PhysicalExam();
  user: User;

  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() physicalExamSaveEvent = new EventEmitter<PhysicalExam>();

  messages: Message[] = [];
  author: Employee = new Employee();

  physicalExamSystemMap: any = new Map();
  selectedPhysicalExamSystems: Reference[];
  types: SelectItem[] = [];
  selectedType = '';

  columns: number[] = [];

  constructor
    (
      public genericService: GenericService,
      private visitService: VisitService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public medicalTeamDropdown: MedicalTeamDropdown,
      private route: ActivatedRoute
    ) {
	    super(genericService, translate, confirmationService, tokenStorage);
      this.user = new User();
  }

  ngOnInit(): void {

    this.user = JSON.parse(Cookie.get('user'));

    const userName = Cookie.get('userName');

    this.route
        .queryParams
        .subscribe(params => {

            const parameters: string [] = [];
            parameters.push('e.user.userName = |userName|' + userName + '|String');

            this.genericService.getAllByCriteria('Employee', parameters, '')
              .subscribe((data: Employee[]) => {
                if (data.length > 0) {
                  this.physicalExam.author = data[0];
                  this.author = data[0];
                }
              },
              error => console.log(error),
              () => console.log('Get all user\'s employee record complete'));
          });

      this.findTypes();
  }

  ngOnDestroy() {
    this.physicalExam = null;
  }

  save() {

    this.messages = [];
    this.physicalExam.visit = this.visit;
    this.physicalExam.admission = this.admission;

    try {
      this.genericService.saveWithUrl('/service/summary/physicalExam/save', this.physicalExam)
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.physicalExam, this.messages, null);
            this.physicalExam = result;
            this.physicalExamSaveEvent.emit(this.physicalExam);
          } else {
            	this.processResult(result, this.physicalExam, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  getPhysicalExam(physicalExamId: number) {
	  this.clear();
    this.genericService.getNewObject('/service/summary/physicalExam/get/', physicalExamId)
        .subscribe(result => {
    if (result.id > 0) {
      this.physicalExam = result;
      this.physicalExam.physicalExamDatetime = new Date(this.physicalExam.physicalExamDatetime);
      }
    });
  }

  clear() {
    this.messages = [];
    this.physicalExam = new PhysicalExam();
    this.physicalExam.author = this.author;
  }

  findTypes() {
    this.genericService.getObject('/service/summary/physicalExam/list/summaryType/' + 3 + '/')
        .subscribe((data: any) => {
          console.info(data);
          this.physicalExamSystemMap = data;
          const keys = Object.keys(data);
          this.types = [];

          for (let i = 0; i < keys.length; i++) {
            this.types.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));
  }

}
