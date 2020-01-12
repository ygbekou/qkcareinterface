import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {trigger,state,style,transition,animate,AnimationEvent} from '@angular/animations';
import { Admission, User, Visit, Summary, Employee, SummaryTypeTemplate, Reference } from '../../models';
import { SummaryStatusDropdown, SummaryTypeDropdown, EmployeeDropdown, MedicalTeamDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { Message, ConfirmationService, SelectItem } from 'primeng/api';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';


@Component({
  selector: 'app-summary-details',
  templateUrl: '../../pages/admin/summaryDetails.html',
  providers: [GenericService, VisitService, EmployeeDropdown, SummaryStatusDropdown, SummaryTypeDropdown, MedicalTeamDropdown],
  // styles: [
  //     "node_modules/primeflex/primeflex.css"
  //   ],
  styles:[`
        .box,
        .sample-layout > div {
            background-color: #cce4f7;
            text-align: center;
            padding-top: 1em;
            padding-bottom: 1em;
            border-radius: 4px;
        }

        .box-stretched {
            height: 100%;
        }

        .sample-layout {
            margin: 0;
        }

        .sample-layout > div {
            border: 1px solid #ffffff;
        }

        .vertical-container {
            margin: 0;
            height: 200px;
            background: #efefef;
            border-radius: 4px;
        }

        .nested-grid .p-col-4 {
            padding-bottom: 1em;
        }
    `],
  animations: [
        trigger('animation', [
            state('visible', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            transition('void => *', [
                style({transform: 'translateX(50%)', opacity: 0}),
                animate('300ms ease-out')
            ]),
            transition('* => void', [
                animate(('250ms ease-in'), style({
                    height: 0,
                    opacity: 0,
                    transform: 'translateX(50%)'
                }))
            ])
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class SummaryDetails extends BaseComponent implements OnInit, OnDestroy {

  summary: Summary = new Summary();
  user: User;

  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() summarySaveEvent = new EventEmitter<Summary>();

  label: string;
  labelId: number;

  messages: Message[] = [];
  author: Employee = new Employee();
  types: SelectItem[] = [];
  selectedType: string = '';

  physicalExamSystemMap: any = new Map();
  selectedPhysicalExamSystems: Reference[];

  columns: number[] = [];

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

      // this.types = [
      //       {label: 'Paypal', value: 'PayPal', icon: 'fa fa-fw fa-cc-paypal'},
      //       {label: 'Visa', value: 'Visa', icon: 'fa fa-fw fa-cc-visa'},
      //       {label: 'MasterCard', value: 'MasterCard', icon: 'fa fa-fw fa-cc-mastercard'}
      //   ];
  }

  ngOnInit(): void {

    if (this.admission) {
      this.label = 'Admission';
      this.labelId = this.admission.id;
    } else if (this.visit) {
      this.label = 'Visit';
      this.labelId = this.visit.id;
    }

    this.user = JSON.parse(Cookie.get('user'));

    const userName = Cookie.get('userName');

    this.getInitialSummary();

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

  

    

    addColumn() {
        this.columns.push(this.columns.length);
    }

    removeColumn() {
        this.columns.splice(-1, 1);
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


  getInitialSummary() {
    this.clear();

    this.genericService.getObject('/service/summary/getByPresence/' + this.label + '/' + this.labelId)
        .subscribe(result => {
      if (result) {
        this.summary = result;
        this.summary.summaryDatetime = new Date(this.summary.summaryDatetime);
      }
    });
  }

  getSummary(summaryId: number) {
	  this.clear();
    this.genericService.getNewObject('/service/summary/get/', summaryId)
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
    this.summary.description = '';
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





      this.genericService.getObject('/service/admission/physicalExam/list/summaryType/' + this.summary.summaryType.id + '/')
        .subscribe((data: any) => {
          console.info(data)
          this.summary.description = '';
          this.physicalExamSystemMap = data;
          let keys = Object.keys(data);
          this.types = [];

          for (let i = 0; i < keys.length; i++) {
            this.types.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));

    }


  setType() {
    alert(this.selectedType);
		
	}
}
