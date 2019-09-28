import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SearchCriteria } from '../../models';
import { Admission } from '../../models/admission';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-patientAdmission-list',
  templateUrl: '../../pages/admin/admissionList.html',
  providers: [GenericService]
})

export class AdmissionList extends BaseComponent implements OnInit, OnDestroy {

  admissions: Admission[] = [];
  cols: any[];
  searchCriteria: SearchCriteria = new SearchCriteria();
  originalPage = '';

  constructor
    (
    public genericService: GenericService,
	  public translate: TranslateService,
    public confirmationService: ConfirmationService, 
    public tokenStorage: TokenStorage, 
	  public globalEventsManager: GlobalEventsManager,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
	this.generateCols();

    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
	});
	
	this.route
        .queryParams
        .subscribe(params => {

        this.originalPage = params['originalPage'];
     });

    // Get all admission of the last 24 hrs;
    this.route
        .queryParams
        .subscribe(params => {

            const parameters: string [] = [];

            const endDate = new Date();
            const startDate  = new Date(new Date().setDate(new Date().getDate() - 1));
            parameters.push('e.admissionDatetime >= |admissionDateStart|' + startDate.toLocaleDateString() + ' '
                + startDate.toLocaleTimeString() + '|Timestamp');
            parameters.push('e.admissionDatetime < |admissionDateEnd|' + endDate.toLocaleDateString() + ' '
                + endDate.toLocaleTimeString() + '|Timestamp');

            this.genericService.getAllByCriteria('Admission', parameters)
              .subscribe((data: Admission[]) => {
                this.admissions = data;
              },
              error => console.log(error),
              () => console.log('Get all Admission complete'));
          });
  }

  updateCols() {
    // tslint:disable-next-line:forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  generateCols() { 
	  this.cols = [
            { field: 'admissionNumber', header: 'Admission No', headerKey: 'COMMON.ADMISSION_NUMBER', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'admissionDatetime', header: 'Date/Time', headerKey: 'COMMON.ADMISSION_DATETIME', type: 'date_time',
                                        style: {width: '20%', 'text-align': 'center'}  },
            { field: 'patientId', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'}  },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME', type: 'string',
										style: {width: '30%', 'text-align': 'center'}  }
        ];
  }

  ngOnDestroy() {
    this.admissions = null;
  }

  edit(admissionId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'admissionId': admissionId,
        }
      };
      this.router.navigate(['/admin/admissionDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  search() {

    const parameters: string [] = [];

    if (this.searchCriteria.medicalRecordNumber != null && this.searchCriteria.medicalRecordNumber.length > 0)  {
      parameters.push('e.patient.medicalRecordNumber = |medicalRecordNumber|' + this.searchCriteria.medicalRecordNumber + '|String');
    }
    if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
      parameters.push('e.patient.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
    }
    if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
      parameters.push('e.patient.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
    }
    if (this.searchCriteria.birthDate != null)  {
      parameters.push('e.patient.user.birthDate = |birthDate|' + this.searchCriteria.birthDate.toLocaleDateString() + '|Date');
    }
    if (this.searchCriteria.admissionId != null)  {
      parameters.push('e.id = |admissionId|' + this.searchCriteria.admissionId + '|Long');
    }
    if (this.searchCriteria.admissionDate != null)  {
      const startDate = new Date(this.searchCriteria.admissionDate.setDate(this.searchCriteria.admissionDate.getDate()));
      const endDate  = new Date(this.searchCriteria.admissionDate.setDate(this.searchCriteria.admissionDate.getDate() + 1));
      parameters.push('e.admissionDatetime >= |admissionDateStart|' + startDate.toLocaleDateString() + '|Timestamp');
      parameters.push('e.admissionDatetime < |admissionDateEnd|' + endDate.toLocaleString() + '|Timestamp');
	}
	
	const orderBy = ' ORDER BY e.admissionDatetime ';

    this.genericService.getAllByCriteria('Admission', parameters, orderBy)
      .subscribe((data: Admission[]) => {
        this.admissions = data;
      },
      error => console.log(error),
      () => console.log('Get all Admissions complete'));
  }


  redirectToOrigialPage(admission: Admission) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
		  'admissionId': admission.id,
		  'admissionDatetime': admission.admissionDatetime,
		  'patientId': admission.patient.id,
		  'patientGender`': admission.patient.user.sex,
          'patientName': admission.patient.name,
          'patientMRN': admission.patient.medicalRecordNumber,
          'patientBirthDate': admission.patient.user.birthDate
        }
      };
      this.router.navigate([this.originalPage], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

 }
