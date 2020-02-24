import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, VitalSign, Patient, User } from '../../models';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { BaseComponent } from './baseComponent';


@Component({
  selector: 'app-vital-sign-details',
  templateUrl: '../../pages/admin/vitalSignDetails.html',
  providers: [GenericService]
})
export class VitalSignDetails extends BaseComponent implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  @Input() vitalSign: VitalSign = new VitalSign();
  @Input() admission: Admission;
  @Output() vitalSignSaveEvent = new EventEmitter<VitalSign>();

  messages: Message[] = [];

  patient: Patient = new Patient();


  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
      this.patient.user = new User();
      
  }

  ngOnInit(): void {

    let vitalSignId = null;
    this.route
        .queryParams
        .subscribe(params => {

          vitalSignId = params['vitalSignId'];

          if (vitalSignId != null) {
              this.genericService.getOne(vitalSignId, 'VitalSign')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.vitalSign = result;
                  this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
                }
              });
          } else {
            if (this.vitalSign  != null) {
              this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
            }
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
      this.genericService.save(this.vitalSign, 'VitalSign')
        .subscribe(result => {
          if (result.id > 0) {
            this.vitalSign = result;
            this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
            this.vitalSignSaveEvent.emit(this.vitalSign);
          } else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  calculateBMI() {
	const weightInKg = this.vitalSign.weight;
    const heightInMeter = this.vitalSign.height;
	const heightInMeterSquare = heightInMeter * heightInMeter;
	const bmi = weightInKg / heightInMeterSquare;
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
    });
  }

  addNew() {
    this.vitalSign = new VitalSign();
  }

  validate() {
    this.messages = [];
    if (this.vitalSign.temperature == null && this.vitalSign.pulse == null
      && this.vitalSign.respiratoryRate == null && this.vitalSign.diastolicBloodPressure == null
      && this.vitalSign.systolicBloodPressure == null && this.vitalSign.meanBloodPressure == null
      && this.vitalSign.bloodSugar == null && this.vitalSign.pain == null
      && this.vitalSign.weight == null && this.vitalSign.height == null) {
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 vital sign. '});
    }

    return this.messages.length === 0;
  }


 }
