import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Admission, Visit, RadInvestigation, Reference } from '../../models';
import { ModalityDropdown, RadExamDropdown, ExamStatusDropdown, RadiologyTechDropdown} from '../dropdowns';
import { GenericService, RadInvestigationService, GlobalEventsManager} from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-radInvestigation-details',
  templateUrl: '../../pages/admin/radInvestigationDetails.html',
  providers: []
})
export class RadInvestigationDetails extends BaseComponent implements OnInit, OnDestroy {

  investigation: RadInvestigation = new RadInvestigation();

  @Input() admission: Admission;
  @Input() visit: Visit;

  itemNumber: string;
  itemNumberLabel: 'Visit';
  messages: Message[] = [];

  modality: Reference;


  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: RadInvestigationService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
	public modalityDropdown: ModalityDropdown,
	public examStatusDropdown: ExamStatusDropdown,
	public radiologyTechDropdown: RadiologyTechDropdown,
  	public examDropdown: RadExamDropdown,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);

  }

  ngOnInit(): void {

    let investigationId = null;
    this.route
      .queryParams
      .subscribe(params => {

        investigationId = params['investigationId'];

        if (investigationId != null) {
          this.genericService.getOne(investigationId, 'com.qkcare.model.imaging.RadInvestigation')
            .subscribe(result => {
              if (result.id > 0) {
				this.investigation = result;
				this.admission = this.investigation.admission;
				this.visit = this.investigation.visit;
				this.modality = this.investigation.exam.modality;
				this.investigation.investigationDatetime = new Date(this.investigation.investigationDatetime);
              }
            });
        } else {

        }
      });

  }

  ngOnDestroy() {
    this.investigation = null;
  }

  save() {

    try {
	  this.messages = [];
	  alert(this.visit.id)
	  alert(this.admission.id)
	  if (this.visit.id !== undefined) {
	      this.investigation.visit = this.visit;
	  }
	  if (this.admission.id !== undefined) {
		 this.investigation.admission = this.admission;
	  }

      this.investigationService.saveInvestigaton(this.investigation)
        .subscribe(result => {
            this.processResult(result, this.investigation, this.messages, null);
          });
    } catch (e) {
      console.log(e);
    }
  }
  
  setSelectedVisit(event) {
    this.visit = event;
  }

  setSelectedAdmission(event) {
    this.admission = event;
  }

  clear() {
	  this.messages = [];
	  this.visit = new Visit();
	  this.admission = new Admission();
	  this.investigation = new RadInvestigation();
  }

  populateExams(event) {
    const parameters: string[] = [];

    parameters.push('e.modality.id = |modalityId|' + this.modality.id + '|Long');

    this.genericService.getAllByCriteria('RadExam', parameters)
      .subscribe((data: any[]) => {
		  console.info('DAta: ' +data);
        this.examDropdown.exams = data;
      },
      error => console.log(error),
      () => console.log('Get Exam List complete'));
  }
}
