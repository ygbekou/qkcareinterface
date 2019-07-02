import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Admission, Visit, VitalSign, Patient, User } from '../../models';
import { GenericService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/api';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";


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
  @Output() vitalSignSaveEvent = new EventEmitter<VitalSign>();

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
      private route: ActivatedRoute
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
              this.genericService.getOne(vitalSignId, 'VitalSign')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.vitalSign = result;
                  this.vitalSign.vitalSignDatetime = new Date(this.vitalSign.vitalSignDatetime);
                }
              });
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
      this.genericService.save(this.vitalSign, 'VitalSign')
        .subscribe(result => {
          if (result.id > 0) {
			  this.vitalSign = result;
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
    //let weightInKg = this.vitalSign.weight * 0.45;
	//let heightInMeter = this.vitalSign.height * 0.025;

	let weightInKg = this.vitalSign.weight;
    let heightInMeter = this.vitalSign.height;
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
    });
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
      this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: 'At least 1 vital sign. '});
    }

    return this.messages.length === 0;
  }


 }
