import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Visit, PatientService, PatientPackage } from '../../models';
import { ServiceDropdown, PackageDropdown } from '../dropdowns';
import { GenericService, GlobalEventsManager, AdmissionService, TokenStorage, BillingService } from '../../services';
import { Message, ConfirmationService } from 'primeng/api';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-patient-service-details',
  templateUrl: '../../pages/admin/patientServiceDetails.html',
  providers: []

})
export class PatientServiceDetails extends BaseComponent implements OnInit, OnDestroy {

  serviceCols: any[];
  packageCols: any[];

  patientServices: PatientService[] = [];
  patientPackages: PatientPackage[] = [];

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
      public serviceDropdown: ServiceDropdown,
      public packageDropdown: PackageDropdown,
      private billingService: BillingService,
      private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
		serviceDropdown.getServices(3);
      	this.clear();
  }


  ngOnInit(): void {

    this.serviceCols = [
			{ field: 'serviceDate', parent: 'service', header: 'Date', headerKey: 'COMMON.DATE', type: 'date',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'name', parent: 'service', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description', parent: 'service', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '25%', 'text-align': 'center'} },
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES', type: 'string',
                                        style: {width: '40%', 'text-align': 'center'} }
        ];

	this.packageCols = [
			{ field: 'packageDate', parent: 'pckage', header: 'Date', headerKey: 'COMMON.DATE', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'name', parent: 'pckage', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description', parent: 'pckage', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '25%', 'text-align': 'center'} },
            { field: 'notes', header: 'Notes', headerKey: 'COMMON.NOTES', type: 'string',
                                        style: {width: '40%', 'text-align': 'center'} }
        ];


	const parameters: string [] = [];

    if (this.visit && this.visit.id > 0) {
      this.parentId = this.visit.id;
      this.parentEntity = 'visit';
	  parameters.push('e.visit.id = |visitId|' + this.visit.id + '|Long');
    }
    if (this.admission && this.admission.id > 0) {
      this.parentId = this.admission.id;
      this.parentEntity = 'admission';
	  parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long');

	}

	this.route
        .queryParams
        .subscribe(params => {
            this.genericService.getAllByCriteria('PatientService', parameters)
              .subscribe((data: PatientService[]) => {
				this.patientServices = data;
			},
			error => console.log(error),
			() => console.log('Get all Patient Services complete'));
		});

	this.route
        .queryParams
        .subscribe(params => {
            this.genericService.getAllByCriteria('PatientPackage', parameters)
              .subscribe((data: PatientPackage[]) => {
				this.patientPackages = data;
			},
			error => console.log(error),
			() => console.log('Get all Patient Packages complete'));
		});



    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.serviceCols) {
      const col = this.serviceCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
	}
	
	// tslint:disable-next-line: forin
	for (const index in this.packageCols) {
      const col = this.packageCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }


  ngOnDestroy() {
    this.serviceCols = null;
	this.packageCols = null;

	this.patientServices = null;
	this.patientPackages = null;

	this.parentId = null;
	this.parentEntity = null;
	this.entity = null;
  }

  addNewService() {
    this.patientServices.push(new PatientService());
  }

  addNewPackage() {
    this.patientPackages.push(new PatientPackage());
  }


  saveService(rowData: PatientService) {
    if (!rowData.service || !(rowData.service.id > 0)) {
		this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.DIAGNOSIS_REQUIRED});
      this.translate.get(['COMMON.SAVE', 'COMMON.SERVICE', 'MESSAGE.REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['COMMON.SERVICE'] + ' ' + res['MESSAGE.REQUIRED']
            });
		});
		
		return;
    }
    rowData.admission = this.admission;
    rowData.visit = this.visit;

    try {
      this.billingService.saveBillingServiceItem(rowData, 'patientService')
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

  deleteService(rowData: PatientService) {
   
    rowData.admission = this.admission;
    rowData.visit = this.visit;

    try {
      this.billingService.deleteBillingServiceItem(rowData, 'patientService')
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

  savePackage(rowData: PatientPackage) {
    if (!rowData.pckage || !(rowData.pckage.id > 0)) {
		this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.DIAGNOSIS_REQUIRED});
      this.translate.get(['COMMON.SAVE', 'COMMON.PACKAGE', 'MESSAGE.REQUIRED']).subscribe(res => {
            this.messages.push({
                severity: Constants.SUCCESS, summary: res['COMMON.SAVE'],
                detail: res['COMMON.PACKAGE'] + ' ' + res['MESSAGE.REQUIRED']
            });
		});
		
		return;
    }
    rowData.admission = this.admission;
    rowData.visit = this.visit;

    try {
      this.billingService.saveBillingServiceItem(rowData, 'patientPackage')
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


  deletePackage(rowData: PatientPackage) {
   
    rowData.admission = this.admission;
    rowData.visit = this.visit;

    try {
      this.billingService.deleteBillingServiceItem(rowData, 'patientPackage')
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
  }


}
