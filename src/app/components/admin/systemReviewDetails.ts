import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {trigger,state,style,transition,animate,AnimationEvent} from '@angular/animations';
import { Admission, User, Visit, Summary, Employee, SummaryTypeTemplate, Reference, PhysicalExam, SystemReview } from '../../models';
import { SummaryStatusDropdown, SummaryTypeDropdown, EmployeeDropdown, MedicalTeamDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { Message, ConfirmationService, SelectItem } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-systemReview-details',
  templateUrl: '../../pages/admin/systemReviewDetails.html',
  providers: [GenericService, VisitService, EmployeeDropdown, SummaryStatusDropdown, SummaryTypeDropdown, MedicalTeamDropdown],
})
export class SystemReviewDetails extends BaseComponent implements OnInit, OnDestroy {

  systemReview: SystemReview = new SystemReview();
  user: User;

  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() systemReviewSaveEvent = new EventEmitter<SystemReview>();

  messages: Message[] = [];
  author: Employee = new Employee();

  systemReviewQuestionMap: any = new Map();
  selectedSystemReviewQuestions: Reference[];
  types: SelectItem[] = [];
  selectedType: string = '';

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
                  this.systemReview.author = data[0];
                  this.author = data[0];
                }
              },
              error => console.log(error),
              () => console.log('Get all user\'s employee record complete'));
          });

      this.findTypes();
  }

  ngOnDestroy() {
    this.systemReview = null;
  }

  save() {

    this.messages = [];
    this.systemReview.visit = this.visit;
    this.systemReview.admission = this.admission;

    try {
      this.genericService.saveWithUrl('/service/summary/systemReview/save', this.systemReview)
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.systemReview, this.messages, null);
            this.systemReview = result;
            this.systemReviewSaveEvent.emit(this.systemReview);
          } else {
            	this.processResult(result, this.systemReview, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  getSystemReview(systemReviewId: number) {
	  this.clear();
    this.genericService.getNewObject('/service/summary/systemReview/get/', systemReviewId)
        .subscribe(result => {
    if (result.id > 0) {
      this.systemReview = result;
      this.systemReview.systemReviewDatetime = new Date(this.systemReview.systemReviewDatetime);
      }
    });
  }

  clear() {
    this.messages = [];
    this.systemReview = new SystemReview();
    this.systemReview.author = this.author;
  }

  findTypes() {
    this.genericService.getObject('/service/summary/systemReview/list/summaryType/' + 3 + '/')
        .subscribe((data: any) => {
          console.info(data)
          this.systemReviewQuestionMap = data;
          let keys = Object.keys(data);
          this.types = [];

          for (let i = 0; i < keys.length; i++) {
            this.types.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));
  }

}
