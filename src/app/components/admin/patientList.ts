import { Component, OnInit, OnDestroy } from '@angular/core';
import { Patient, SearchCriteria, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { Constants } from '../../app.constants';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-patient-list',
  templateUrl: '../../pages/admin/patientList.html',
  providers: [GenericService]
})
export class PatientList extends BaseComponent implements OnInit, OnDestroy {

  messages: Message[] = [];
  patients: Patient[] = [];
  cols: any[];
  searchCriteria: SearchCriteria = new SearchCriteria();
  originalPage = '';

  LAST_NAME: any;

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

  updateCols() {
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  generateCols() {
    this.cols = [
            { field: 'lastName', header: 'Last Name', headerKey: 'COMMON.LAST_NAME', type: 'user',
                                        style: {width: '13%', 'text-align': 'center'} },
            { field: 'firstName', header: 'First Name', headerKey: 'COMMON.FIRST_NAME', type: 'user',
                                        style: {width: '13%', 'text-align': 'center'} },
            { field: 'birthDate', header: 'Birth Date', headerKey: 'COMMON.BIRTH_DATE', type: 'date',
                                        style: {width: '13%', 'text-align': 'center'} },
            { field: 'email', header: 'Email', headerKey: 'COMMON.E_MAIL', type: 'user',
                                        style: {width: '15%', 'text-align': 'center'}  },
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE', type: 'user',
                                        style: {width: '10%'}  },
            { field: 'address', header: 'Address', headerKey: 'COMMON.ADDRESS', type: 'user',
                                        style: {width: '20%', 'text-align': 'center'}  },
            { field: 'sex', header: 'Sex', headerKey: 'COMMON.GENDER', type: 'user',
                                        style: {width: '5%', 'text-align': 'center'}  }
        ];
  }

  ngOnInit(): void {

    this.generateCols();

     this.route
        .queryParams
        .subscribe(params => {

        this.originalPage = params['originalPage'];
     });

     this.updateCols();
     this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
     });
  }


  ngOnDestroy() {
    this.patients = null;
  }

  edit(patientId: number) {

    this.globalEventsManager.changePatientId(patientId);
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'patientId': patientId,
        }
      };
      this.router.navigate(['/admin/adminPatient'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  redirectToOrigialPage(patient: Patient) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'patientId': patient.id,
          'patientName': patient.name,
          'mrn': patient.medicalRecordNumber,
          'birthDate': patient.user.birthDate,
          'gender': patient.user.sex,
        }
      };
      this.router.navigate([this.originalPage], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(patientId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'patientId': patientId,
        }
      };
      this.router.navigate(['/admin/patientDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  search() {

        const parameters: string [] = [];
        this.messages = [];

        parameters.push('e.status = |status|0|Integer');
        if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
          parameters.push('e.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
        }
        if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
          parameters.push('e.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
        }
        if (this.searchCriteria.birthDate != null)  {
          parameters.push('e.user.birthDate = |birthDate|' +
            this.searchCriteria.birthDate.toLocaleDateString(this.globalEventsManager.LOCALE,
                Constants.LOCAL_DATE_OPTIONS) + '|Date');
        }

        if (parameters.length === 1) {
            this.translate.get(['MESSAGE.NO_CRITERIA_SET', 'COMMON.SEARCH']).subscribe(res => {
              this.messages.push({
                severity: Constants.ERROR, summary: res['COMMON.SEARCH'],
                detail: res['MESSAGE.NO_CRITERIA_SET']
              });
            });
            this.patients = [];
            return false;
        }

        this.genericService.getAllByCriteria('Patient', parameters)
          .subscribe((data: Patient[]) => {
            this.patients = data;
          },
          error => console.log(error),
          () => console.log('Get all Patients complete'));
      }

 }
