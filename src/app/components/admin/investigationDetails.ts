import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Admission, Visit, Investigation, LabTest} from '../../models';
import { LabTestDropdown} from '../dropdowns';
import { GenericService, InvestigationService, GlobalEventsManager, TokenStorage} from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-investigation-details',
  templateUrl: '../../pages/admin/investigationDetails.html',
  providers: [GenericService, InvestigationService, LabTestDropdown]
})
export class InvestigationDetails extends BaseComponent implements OnInit, OnDestroy {

  investigation: Investigation = new Investigation();
  labTestCols: any[];
  labTests: LabTest[] = [];
  labTestDropdown: LabTestDropdown;

  @Input() admission: Admission;
  @Input() visit: Visit;

  itemNumber: string;
  itemNumberLabel: 'Visit';
  messages: Message[] = [];

  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private investigationService: InvestigationService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private lbTestDropdown: LabTestDropdown,
    private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
    	this.labTestDropdown = lbTestDropdown;

  }

  ngOnInit(): void {

    let investigationId = null;
    this.route
      .queryParams
      .subscribe(params => {

        investigationId = params['investigationId'];

        if (investigationId != null) {
          this.genericService.getOne(investigationId, 'Investigation')
            .subscribe(result => {
              if (result.id > 0) {
				this.investigation = result;
				this.investigation.investigationDatetime = new Date(this.investigation.investigationDatetime);
				this.populateLabTests('');
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
      this.investigation.visit = this.visit;

      this.investigationService.saveInvestigaton(this.investigation)
        .subscribe(result => {
            this.processResult(result, this.investigation, this.messages, null);
          });
    } catch (e) {
      console.log(e);
    }
  }

  populateLabTests(event) {
    const parameters: string[] = [];

    parameters.push('e.parent.id = |parentId|' + this.investigation.labTest.id + '|Long');

    this.genericService.getAllByCriteria('LabTest', parameters)
      .subscribe((data: any[]) => {
        this.labTests = data;
      },
      error => console.log(error),
      () => console.log('Get LabTest List complete'));
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
	  this.investigation = new Investigation();
	  this.labTests = [];
  }
}
