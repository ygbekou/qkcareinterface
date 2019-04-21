import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, VitalSign, User } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';


@Component({
  selector: 'app-vitalSign-list',
  templateUrl: '../../pages/admin/vitalSignList.html',
  providers: [GenericService]
})
export class VitalSignList implements OnInit, OnDestroy {
  
  vitalSigns: VitalSign[] = [];
  cols: any[];
  
  @Input() admission: Admission;
  @Output() vitalSignIdEvent = new EventEmitter<string>();

  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'vitalSignDatetime', header: 'Date', headerKey: 'COMMON.VITAL_SIGN_DATE_TIME', type:'date' },
            { field: 'patientMRN', header: 'Patient ID', headerKey: 'COMMON.PATIENT_ID' },
            { field: 'patientName', header: 'Patient Name', headerKey: 'COMMON.PATIENT_NAME' },
            { field: 'temperature', header: 'Temperature', headerKey: 'COMMON.TEMPERATURE' },
            { field: 'pulse', header: 'Pulse', headerKey: 'COMMON.PULSE' },
            { field: 'respiration', header: 'Respiration', headerKey: 'COMMON.RESPIRATION' },
            { field: 'bloodPressure', header: 'Blood Pressure', headerKey: 'COMMON.BLOOD_PRESSURE'},
            { field: 'bloodSugar', header: 'Blood Sugar', headerKey: 'COMMON.BLOOD_SUGAR' },
            { field: 'pain', header: 'Pain', headerKey: 'COMMON.PAIN' },
            { field: 'weight', header: 'Weight(pound)', headerKey: 'COMMON.WEIGHT' },
            { field: 'height', header: 'Height(in)', headerKey: 'COMMON.HEIGHT' },
            { field: 'bmi', header: 'BMI', headerKey: 'COMMON.BMI' }
        ];
    
    let parameters: string [] = []; 
 
    if (this.admission && this.admission.id > 0)  {
      parameters.push('e.admission.id = |admissionId|' + this.admission.id + '|Long')
    } 
    
    this.route
        .queryParams
        .subscribe(params => {          
          
        this.genericService.getAllByCriteria('VitalSign', parameters)
          .subscribe((data: VitalSign[]) => 
          { 
            this.vitalSigns = data 
          },
          error => console.log(error),
          () => console.log('Get all VitalSigns complete'));
      });
  
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
    this.vitalSigns = null;
  }
  
  edit(prescriptionId: string) {
    this.vitalSignIdEvent.emit(prescriptionId);
  }

  delete(vitalSignId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "vitalSignId": vitalSignId,
        }
      }
      this.router.navigate(["/admin/vitalSignDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
