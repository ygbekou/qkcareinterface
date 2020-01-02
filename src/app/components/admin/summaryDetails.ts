import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Admission, User, Visit, Summary, Employee, SummaryTypeTemplate } from '../../models';
import { SummaryStatusDropdown, SummaryTypeDropdown, EmployeeDropdown, MedicalTeamDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary-details',
  templateUrl: '../../pages/admin/summaryDetails.html',
  providers: [GenericService, VisitService, EmployeeDropdown, SummaryStatusDropdown, SummaryTypeDropdown, MedicalTeamDropdown]
})
export class SummaryDetails extends BaseComponent implements OnInit, OnDestroy {

  summary: Summary = new Summary();
  user: User;

  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() summarySaveEvent = new EventEmitter<Summary>();

  messages: Message[] = [];
  author: Employee = new Employee();

  constructor
    (
      public genericService: GenericService,
      private visitService: VisitService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public summaryTypeDropdown: SummaryTypeDropdown,
      public summaryStatusDropdown: SummaryStatusDropdown,
      public medicalTeamDropdown: MedicalTeamDropdown,
      private route: ActivatedRoute
    ) {
	    super(genericService, translate, confirmationService, tokenStorage);
      this.user = new User();
      this.summaryTypeDropdown.getSummaryTypeByRole(undefined);
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
                  this.summary.author = data[0];
                  this.author = data[0];
                }
              },
              error => console.log(error),
              () => console.log('Get all user\'s employee record complete'));
          });
  }

  ngOnDestroy() {
    this.summary = null;
  }

  save(statusId: number) {

    this.messages = [];
    this.summary.visit = this.visit;
    this.summary.admission = this.admission;
    this.summary.summaryStatus.id = statusId;

    try {
      this.genericService.save(this.summary, 'Summary')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.summary, this.messages, null);
            this.summary = result;
            this.summarySaveEvent.emit(this.summary);
          } else {
            	this.processResult(result, this.summary, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }


  getSummary(summaryId: number) {
	  this.clear();
    this.genericService.getOne(summaryId, 'Summary')
        .subscribe(result => {
    if (result.id > 0) {
      this.summary = result;
      this.summary.summaryDatetime = new Date(this.summary.summaryDatetime);
      }
    });
  }

  clear() {
    this.messages = [];
    this.summary = new Summary();
    this.summary.author = this.author;
  }

  findTemplate() {
      const parameters: string [] = [];
      parameters.push('e.summaryType.id = |summaryTypeId|' + this.summary.summaryType.id + '|Long');

      this.genericService.getAllByCriteria('SummaryTypeTemplate', parameters, '')
        .subscribe((data: SummaryTypeTemplate[]) => {
          if (data.length > 0) {
            this.summary.description = data[0].template;
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));
  }
}
