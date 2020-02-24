import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Reference } from '../../models/reference';
import { GenericService, TokenStorage, VisitService } from '../../services';
import { Patient } from 'src/app/models';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
 
@Component({
  selector: 'app-social-history-details',
  template: `<p-messages [(value)]="messages"></p-messages>
              <div class="ui-grid-row">
                <div class="ui-grid-col-11 ui-sm-12" >
                  <p-checkbox id="status" 
                    [(ngModel)]="patient.selectedSocialHistories" [value]="socialHistory.id"
                    label="{{socialHistory.name}}"
                    *ngFor="let socialHistory of socialHistories; let i = index"></p-checkbox>
                </div>
              </div>
              <br/>
              <button type="button" pButton label="{{ 'COMMON.SAVE' | translate }}" icon="fa fa-save" (click)="save()"></button>`,
  providers: [GenericService]
})
export class SocialHistoryDetails extends BaseComponent implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() patient: Patient = new Patient();
  socialHistories: Reference[] = [];
 
  constructor
    (
      public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public visitService: VisitService
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    
    this.genericService.getActiveElements('socialhistory')
      .subscribe((data: Reference[]) => { 
        console.info(data);
        if (data.length > 0) {
          this.socialHistories = data;
          this.getSocialHistories();
        }
      },
      error => console.log(error),
      () => console.log('Get ative socialHistories complete'));

  }

  save() {

	  this.messages = [];
      try { 
        this.visitService.saveSocialHistories(this.patient)
          .subscribe(result => {
            if (result.id > 0) {
              this.processResult(result, this.patient, this.messages, null);
              this.patient = result;
            } else {
              this.processResult(result, this.patient, this.messages, null);
            }
          });
      } catch (e) {
        console.log(e);
      }
    }

  getSocialHistories() {
   
    this.visitService.getPatientEntities(this.patient.id, 'socialHistories')
      .subscribe((data: Patient) => {
        this.patient = data;
      },
      error => console.log(error),
      () => console.log('Get all patient social histories complete'));

    }
  
  ngOnDestroy() {
    this.socialHistories = null;
  }
 }
