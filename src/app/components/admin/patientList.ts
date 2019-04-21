import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Patient, SearchCriteria, User } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-patient-list',
  templateUrl: '../../pages/admin/patientList.html',
  providers: [GenericService]
})
export class PatientList implements OnInit, OnDestroy {
  
  patients: Patient[] = [];
  cols: any[];
  searchCriteria: SearchCriteria = new SearchCriteria();
  originalPage: string;
  
  LAST_NAME: any;
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private globalEventsManager: GlobalEventsManager,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }
  
  generateCols(){
    this.cols = [
            { field: 'lastName', header: 'Last Name', headerKey: 'COMMON.LAST_NAME', type:'user' },
            { field: 'firstName', header: 'First Name', headerKey: 'COMMON.FIRST_NAME', type:'user' },
            { field: 'birthDate', header: 'Birth Date', headerKey: 'COMMON.BIRTH_DATE', type:'date' },
            { field: 'email', header: 'Email', headerKey: 'COMMON.E_MAIL', type:'user' },
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE_1', type:'user' },
            { field: 'address', header: 'Address', headerKey: 'COMMON.ADDRESS', type:'user' },
            { field: 'sex', header: 'Sex', headerKey: 'COMMON.GENDER', type:'user' }
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
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "patientId": patientId,
        }
      }
      this.router.navigate(["/admin/adminPatient"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  redirectToOrigialPage(patient: Patient) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "patientId": patient.id,
          "patientName": patient.name,
          "mrn": patient.medicalRecordNumber,
          "birthDate": patient.user.birthDate,
          "gender": patient.user.sex,
        }
      }
      this.router.navigate([this.originalPage], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete(patientId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "patientId": patientId,
        }
      }
      this.router.navigate(["/admin/patientDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  search() {
   
        let parameters: string [] = []; 
            
        parameters.push('e.status = |status|0|Integer')
        if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0)  {
          parameters.push('e.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String')
        }
        if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0)  {
          parameters.push('e.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String')
        } 
        if (this.searchCriteria.birthDate != null)  {
          parameters.push('e.user.birthDate = |birthDate|' + this.searchCriteria.birthDate.toLocaleDateString() + '|Date')
        }  
        
        
        this.genericService.getAllByCriteria('Patient', parameters)
          .subscribe((data: Patient[]) => 
          { 
            this.patients = data 
          },
          error => console.log(error),
          () => console.log('Get all Patients complete'));
      }

 }
