import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, AdmissionDiagnosis, Diagnosis, Visit } from '../../models';
import { DiagnosisDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, AdmissionService, TokenStorage } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-admission-diagnoses',
  templateUrl: '../../pages/admin/admissionDiagnoses.html',
  providers: [GenericService, AdmissionService, DiagnosisDropdown]

})
export class AdmissionDiagnoses extends BaseComponent implements OnInit, OnDestroy {

  admissionDiagnosis: AdmissionDiagnosis = new AdmissionDiagnosis();

  diagnosisCols: any[];
  admissionDiagnoses: AdmissionDiagnosis[] = [];
  parentId: number;
  parentEntity: string;
  entity: string;

  @Input() admission: Admission;
  @Input() visit: Visit;

  messages: Message[] = [];

  constructor
    (
      private admissionService: AdmissionService,
      public genericService: GenericService,
	    public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public globalEventsManager: GlobalEventsManager,
      public diagnosisDropdown: DiagnosisDropdown,
      private route: ActivatedRoute,
      private router: Router
    ) {
		    super(genericService, translate, confirmationService, tokenStorage);
      	this.clear();
  }


  ngOnInit(): void {

    this.diagnosisCols = [
            { field: 'name', parent: 'diagnosis', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description', parent: 'diagnosis', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '25%', 'text-align': 'center'} },
            { field: 'instructions', header: 'Instructions', headerKey: 'COMMON.INSTRUCTIONS', type: 'string',
                                        style: {width: '50%', 'text-align': 'center'} }
        ];

    this.admissionDiagnoses.push(new AdmissionDiagnosis());

	const parameters: string [] = [];

    if (this.visit && this.visit.id > 0) {
      this.parentId = this.visit.id;
      this.parentEntity = 'visit';
	  this.entity = 'VisitDiagnosis';
	  parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
    }
    if (this.admission && this.admission.id > 0) {
      this.parentId = this.admission.id;
      this.parentEntity = 'admission';
	  this.entity = 'AdmissionDiagnosis';
	  parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');

	}

	this.route
        .queryParams
        .subscribe(params => {
            this.genericService.getAllByCriteria('AdmissionDiagnosis', parameters)
              .subscribe((data: AdmissionDiagnosis[]) => {
				this.admissionDiagnoses = data;
			},
			error => console.log(error),
			() => console.log('Get all DoctorOrders complete'));
		});



    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.diagnosisCols) {
      const col = this.diagnosisCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  ngOnDestroy() {
    this.admissionDiagnosis = null;
  }

  addNew() {
    this.admissionDiagnoses.push(new AdmissionDiagnosis());
  }


  saveDiagnosis(rowData: AdmissionDiagnosis) {
    if (!rowData.diagnosis || !(rowData.diagnosis.id > 0)) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.DIAGNOSIS_REQUIRED});
      return;
    }
    rowData.admission = this.admission;
    rowData.visit = this.visit;

    try {
      this.genericService.save(rowData, this.entity)
        .subscribe(result => {
          if (result.id > 0) {
            rowData = result;
            this.processResult(result, rowData, this.messages, null);
          } else {
            this.processResult(result, rowData, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  clear() {
    this.admissionDiagnosis = new AdmissionDiagnosis();
    this.admissionDiagnosis.admission = new Admission();
    this.admissionDiagnosis.diagnosis = new Diagnosis();
  }

  getDiagnoses() {
    this.admissionService.getDiagnoses(+this.parentId, this.parentEntity)
     .subscribe((data: AdmissionDiagnosis[]) => {
        this.admissionDiagnoses = data;
        if (this.admissionDiagnoses != null
              && this.admissionDiagnoses.length === 0) {
          const ad = new AdmissionDiagnosis();
          ad.diagnosis = new Diagnosis();
          this.admissionDiagnoses.push(new AdmissionDiagnosis());
        }
      },
      error => console.log(error),
      () => console.log('Get Patient Diagnoses complete'));
  }

  
}
