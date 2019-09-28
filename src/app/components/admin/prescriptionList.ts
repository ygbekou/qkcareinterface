import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Visit, Admission, Prescription } from '../../models';
import { Router, NavigationExtras } from '@angular/router';
import { GenericService, AdmissionService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-prescription-list',
  templateUrl: '../../pages/admin/prescriptionList.html',
  providers: [GenericService, AdmissionService]
})
export class PrescriptionList extends BaseComponent implements OnInit, OnDestroy {
  
  prescriptions: Prescription[] = [];
  cols: any[];
  
  @Input() admission: Admission;
  @Input() visit: Visit;
  @Output() prescriptionIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    private admissionService: AdmissionService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'prescriptionDatetime', header: 'Date', headerKey: 'COMMON.PRESCRIPTION_DATETIME', type: 'date_time',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'prescriptionTypeName', header: 'Type', headerKey: 'COMMON.PRESCRIPTION_TYPE', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES', type: 'string',
                                        style: {width: '45%', 'text-align': 'center'} },
            { field: 'isDischargeDesc', header: 'Discharge', headerKey: 'COMMON.DISCHARGE', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'}}
        ];
    this.getPrescriptions();
  
    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }
 
  
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  ngOnDestroy() {
    this.prescriptions = null;
  }
  
  edit(prescriptionId: string) {
    this.prescriptionIdEvent.emit(prescriptionId);
  }

  delete(prescriptionId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "prescriptionId": prescriptionId,
        }
      }
      this.router.navigate(["/admin/prescriptionDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  
   getPrescriptions() {
     
      let parameters: string [] = []; 
            
        parameters.push('e.status = |status|0|Integer')
        if (this.visit && this.visit.id > 0)  {
          parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long')
        } 
        if (this.admission && this.admission.id > 0)  {
          parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long')
        } 
        
        
        this.genericService.getAllByCriteria('Prescription', parameters)
          .subscribe((data: Prescription[]) => 
          { 
            this.prescriptions = data 
          },
          error => console.log(error),
          () => console.log('Get all Prescriptions complete'));
	  }
	  
	  updateTable(prescription: Prescription) {
		const index = this.prescriptions.findIndex(x => x.id === prescription.id);

		if (index === -1) {
			this.prescriptions.push(prescription);
		} else {
			this.prescriptions[index] = prescription;
		}

	}
 }
