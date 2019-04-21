import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Visit, VitalSign, Patient, User } from '../../models';
import { EditorModule } from 'primeng/editor';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';

@Component({ 
  selector: 'app-vitalSign-details',
  templateUrl: '../../pages/admin/vitalSignDetails.html',
  providers: [GenericService]
})
export class VitalSignDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() vitalSign: VitalSign = new VitalSign();
  @Input() admission: Admission;
 
  messages: Message[] = [];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  patient: Patient = new Patient();
  
  
  constructor
    (
      private genericService: GenericService,
      private translate: TranslateService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
    this.patient.user = new User();
  }

  ngOnInit(): void {
    
    let vitalSignId = null;
    this.route
        .queryParams
        .subscribe(params => {
      
          vitalSignId = params['vitalSignId'];
          
          if (vitalSignId != null) {
              this.genericService.getOne(vitalSignId, "VitalSign")
                  .subscribe(result => {
                if (result.id > 0) {
                  this.vitalSign = result
                  this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
                }
              })
          } else {
              
          }
     });
    
  }
  
  ngOnDestroy() {
    this.vitalSign = null;
  }
  
  save() {
    
    this.messages = [];
    this.vitalSign.admission = this.admission;
    
    try {
      this.genericService.save(this.vitalSign, "VitalSign")
        .subscribe(result => {
          if (result.id > 0) {
            this.vitalSign = result;
          }
          else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  calculateBMI() {
    let weightInKg = this.vitalSign.weight * 0.45;
    let heightInMeter = this.vitalSign.height * 0.025;
    let heightInMeterSquare = heightInMeter * heightInMeter;
    let bmi = weightInKg / heightInMeterSquare;
    this.vitalSign.bmi = Math.round(bmi);
  }
  
  getVitalSign(vitalSignId: number) {
    this.messages = [];
    this.genericService.getOne(vitalSignId, 'VitalSign')
        .subscribe(result => {
      if (result.id > 0) {
        this.vitalSign = result;
        this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
      }
    })
  }
  
  addNew() {
    this.vitalSign = new VitalSign();
  }
 
  validate() {
    this.messages = [];
    if (this.vitalSign.temperature == null && this.vitalSign.pulse == null
      && this.vitalSign.respiration == null && this.vitalSign.bloodPressure == null
      && this.vitalSign.bloodSugar == null && this.vitalSign.pain == null
      && this.vitalSign.weight == null && this.vitalSign.height == null) {
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:'At least 1 vital sign. '});
    }
    
    return this.messages.length == 0;
  }
 }
