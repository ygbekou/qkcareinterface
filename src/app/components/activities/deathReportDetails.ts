import {Component, OnInit, OnDestroy, ChangeDetectorRef, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Constants} from '../../app.constants';
import {Admission} from '../../models/admission';
import {Patient} from '../../models/patient';
import {DeathReport} from '../../models/activities';
import {Message, ConfirmationService} from 'primeng/api';
import {GenericService, GlobalEventsManager, TokenStorage} from '../../services';
import { BaseComponent } from '../admin/baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deathReport-details',
  templateUrl: '../../pages/activities/deathReportDetails.html',
  providers: [GenericService, GlobalEventsManager]
})
export class DeathReportDetails extends BaseComponent implements OnInit, OnDestroy {

  deathReport: DeathReport = new DeathReport();
  messages: Message[] = [];

  @Input() admission: Admission;

  patient: Patient = new Patient();
  itemNumber: string;
  itemNumberLabel: string = 'Admission';

  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    public confirmationService: ConfirmationService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

    let deathReportId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          this.itemNumberLabel = params['itemNumberLabel'] ? params['itemNumberLabel'] : this.itemNumberLabel;
          deathReportId = params['deathReportId'];
          
          if (deathReportId != null) {
              this.genericService.getOne(deathReportId, Constants.DEATH_REPORT_CLASS)
                  .subscribe(result => {
                if (result.id > 0) {
                  this.deathReport = result
                  this.deathReport.deathDatetime = new Date(this.deathReport.deathDatetime);
                  this.admission = this.deathReport.admission;
                  this.patient = this.admission.patient;
                }
                else {
                  
                 
                }
              })
          } else {
              
          }
     });

  }

  ngOnDestroy() {
    this.deathReport = null;
  }

  save() {
    this.messages = [];
    if (this.deathReport.deathDatetime == null) {
      this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.MISSING_REQUIRED_FIELD});
      return;
    }
    
    try {
      this.deathReport.admission = this.admission;
      this.genericService.save(this.deathReport, Constants.DEATH_REPORT_CLASS)
        .subscribe(result => {
          if (result.id > 0) {
            this.deathReport = result
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.messages.push({severity:Constants.ERROR, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_UNSUCCESSFUL});
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  clear() {
      this.messages = [];
      this.deathReport = new DeathReport();
      this.admission = new Admission();
  }

  lookUpVisitAdm(event) {
    this.admission = event;
    
  }
}
