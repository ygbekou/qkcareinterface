import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Reference } from '../../models/reference';
import { Patient } from '../../models/patient';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
 
@Component({
  selector: 'app-familyHistory-details',
  template: `<p-messages [(value)]="messages"></p-messages>
             <div class="ui-grid-row">
                <div class="ui-grid-col-11 ui-sm-12" >
                  <p-checkbox id="status" 
                    [(ngModel)]="patient.selectedFamilyHistories" [value]="medicalHistory.id"
                    label="{{medicalHistory.name}}"
                    *ngFor="let medicalHistory of medicalHistories; let i = index"></p-checkbox>
                </div>
              </div>
              <br/>
              <button type="button" pButton label="{{ 'COMMON.SAVE' | translate }}" icon="fa fa-save" (click)="save()"></button>`,
  providers: [GenericService, VisitService]
})
export class FamilyHistoryDetails extends BaseComponent  implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() patient: Patient = new Patient();
  medicalHistories: Reference[] = [];
 
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

    this.genericService.getActiveElements('medicalhistory')
      .subscribe((data: Reference[]) => { 
        console.info(data)
        if (data.length > 0) {
          this.medicalHistories = data;

          this.getMedicalHistories();
        }
      },
      error => console.log(error),
      () => console.log('Get ative medicalHistories complete'));
  
  }
  
  save() {

	  this.messages = [];
      try { 
        this.visitService.saveFamilyHistories(this.patient)
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

  getMedicalHistories() {
   
    this.visitService.getPatientEntities(this.patient.id, 'familyHistories')
      .subscribe((data: Patient) => {
        this.patient = data;
      },
      error => console.log(error),
      () => console.log('Get all patient family histories complete'));

    }
    
  ngOnDestroy() {
    this.medicalHistories = null;
  }
 }
