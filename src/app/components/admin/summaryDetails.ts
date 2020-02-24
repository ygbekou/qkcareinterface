import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {trigger,state,style,transition,animate,AnimationEvent} from '@angular/animations';
import { Admission, User, Visit, Summary, Employee, SummaryTypeTemplate, Reference, SummaryType } from '../../models';
import { SummaryStatusDropdown, SummaryTypeDropdown, EmployeeDropdown, MedicalTeamDropdown, CodeStatusDropdown} from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, VisitService, TokenStorage, GlobalEventsManager } from '../../services';
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

  @Input() summaryTypeId: number;
  label: string;
  labelId: number;

  messages: Message[] = [];
  author: Employee = new Employee();
  systemReviewTypes: SelectItem[] = [];
  physicalExamTypes: SelectItem[] = [];
  systemReviewSelectedType: string = '';
  physicalExamSelectedType: string = '';

  systemReviewQuestionMap: any = new Map();
  physicalExamSystemMap: any = new Map();

  columns: number[] = [];

  iTCols: any[];
  vitalSignCols: any[];
  investigationResults: any[] = [];

  summaryDatetimeStart: Date = new Date();


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
      public codeStatusDropdown: CodeStatusDropdown,
      public globalEventsManager: GlobalEventsManager,
      private route: ActivatedRoute
    ) {
	    super(genericService, translate, confirmationService, tokenStorage);
      this.user = new User();
      this.summaryTypeDropdown.getSummaryTypeByRole(undefined);
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


      this.findSystemReviewTypes();
      this.findPhysicalExamTypes();

      this.vitalSignCols = [
      { field: 'name', header: '', headerKey: '' },
      { field: 'lastResult', header: 'LAST RESULT', headerKey: 'COMMON.LAST_RESULT' },
      { field: 'minimum', header: 'MINIMUM', headerKey: 'COMMON.MINIMUM' },
      { field: 'maximum', header: 'MAXIMUM', headerKey: 'COMMON.MAXIMUM' }
    ];
  }

  ngOnDestroy() {
    this.summary = null;
  }

  generateListHeaders() {

    let resultMap = new Map();

    this.iTCols = [];
    this.investigationResults = [];

    console.info('JSON OBJECTS ....')
    console.info(this.summary.investigationJsonObjects)
    
    for (let i in this.summary.investigationJsonObjects) {
      let iTCol = [];
      let investigationResult = [];

      for (let index in this.summary.investigationJsonObjects[i][0]['attributes']) {
        iTCol.push({field: this.summary.investigationJsonObjects[i][0]['attributes'][index], 
          header : this.summary.investigationJsonObjects[i][0]['attributes'][index], type: 'number'});
      }
      this.iTCols.push(iTCol);
      
      for (let index in this.summary.investigationJsonObjects[i]) {
        
        if (index === '0') {
          continue;
        }
      
        investigationResult.push(this.summary.investigationJsonObjects[i][index]);
        
      }

      this.investigationResults.push(investigationResult);
    }
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
      this.genericService.saveWithUrl('/service/summary/summary/save', this.summary)
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
        this.summary.author = this.author;
        this.summaryDatetimeStart.setDate(this.summary.summaryDatetime.getDate() - 1);
        this.summary.summaryType = new SummaryType()
        this.summary.summaryType.id  = +this.summaryTypeId;

        let summaryStatus = new Reference();
        summaryStatus.id = 1;
        summaryStatus.name = 'Draft';
        this.summary.summaryStatus = summaryStatus;
        console.info('RESULT IS READY ....')
        console.info(this.summary.summaryVitalSigns);
        this.generateListHeaders();
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





      this.genericService.getObject('/service/admission/systemReview/list/summaryType/' + this.summary.summaryType.id + '/')
        .subscribe((data: any) => {
          console.info(data)
          this.summary.description = '';
          this.systemReviewQuestionMap = data;
          let keys = Object.keys(data);
          this.systemReviewTypes = [];

          for (let i = 0; i < keys.length; i++) {
            this.systemReviewTypes.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
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
          this.physicalExamTypes = [];

          for (let i = 0; i < keys.length; i++) {
            this.physicalExamTypes.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));

    }


  setType() {
    
		
  }
  

  findPhysicalExamTypes() {
    this.genericService.getObject('/service/summary/physicalExam/list/summaryType/' + 3 + '/')
        .subscribe((data: any) => {
          console.info(data)
          this.physicalExamSystemMap = data;
          let keys = Object.keys(data);
          this.physicalExamTypes = [];

          for (let i = 0; i < keys.length; i++) {
            this.physicalExamTypes.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));
  }

  findSystemReviewTypes() {
    this.genericService.getObject('/service/summary/systemReview/list/summaryType/' + 3 + '/')
        .subscribe((data: any) => {
          console.info(data)
          this.systemReviewQuestionMap = data;
          let keys = Object.keys(data);
          this.systemReviewTypes = [];

          for (let i = 0; i < keys.length; i++) {
            this.systemReviewTypes.push({label: keys[i].split('|')[1], value: keys[i], icon: ''});
          }
        },
        error => console.log(error),
        () => console.log('Get template complete'));
  }

}
