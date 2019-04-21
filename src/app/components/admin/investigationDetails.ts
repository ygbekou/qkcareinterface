import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Constants} from '../../app.constants';
import {Admission, Visit, Patient, Prescription, Diagnosis, Investigation, LabTest, User} from '../../models';
import {EditorModule} from 'primeng/editor';
import {DoctorDropdown, MedicineDropdown, LabTestDropdown} from '../dropdowns';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule} from 'primeng/primeng';
import {GenericService, InvestigationService, GlobalEventsManager} from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-investigation-details',
  templateUrl: '../../pages/admin/investigationDetails.html',
  providers: [GenericService, InvestigationService, LabTestDropdown]
})
export class InvestigationDetails implements OnInit, OnDestroy {

  investigation: Investigation = new Investigation();
  labTestCols: any[];
  labTests: LabTest[] = [];
  labTestDropdown: LabTestDropdown;

  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;

  @Input() admission: Admission;
  @Input() visit: Visit;

  patient: Patient = new Patient();
  itemNumber: string;
  itemNumberLabel: string = 'Visit';
  messages: Message[] = [];

  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    private genericService: GenericService,
    private investigationService: InvestigationService,
    private translate: TranslateService,
    private lbTestDropdown: LabTestDropdown,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
    ) {
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
                this.investigation = result
              }
            })
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
          if (result.id > 0) {
            this.investigation = result
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  populateLabTests(event) {
    let parameters: string[] = [];

    parameters.push('e.parent.id = |parentId|' + this.investigation.labTest.id + '|Long')

    this.genericService.getAllByCriteria('LabTest', parameters)
      .subscribe((data: any[]) => {
        this.labTests = data;
      },
      error => console.log(error),
      () => console.log('Get LabTest List complete'));
  }
  
  delete() {
  
  }
  
  clear() {
  
  }
}
