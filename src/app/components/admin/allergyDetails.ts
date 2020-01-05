import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Reference } from '../../models/reference';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { Patient } from 'src/app/models';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
 
@Component({
  selector: 'app-allergy-details',
  template: `<p-messages [(value)]="messages"></p-messages>
              <div class="ui-grid-row" *ngFor="let allergyGroup of allergyGroups">
              <div class="ui-grid-col-1 ui-sm-12" >
                {{allergyGroup.name}}:
              </div>
              <div class="ui-grid-col-11 ui-sm-12" >
                <p-checkbox id="status" 
                  [(ngModel)]="patient.selectedAllergies" [value]="allergy.id"
                  label="{{allergy.name}}"
                  *ngFor="let allergy of allergyGroup.childs; let i = index"></p-checkbox>
              </div>
            </div> 
            <br/>
            <button type="button" pButton label="{{ 'COMMON.SAVE' | translate }}" icon="fa fa-save" (click)="save()"></button>`,
  providers: [GenericService, VisitService]
})
export class AllergyDetails extends BaseComponent implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() patient: Patient = new Patient();
  allergyGroups: Reference[] = [];
 
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
    
    this.genericService.getActiveElements('allergy')
      .subscribe((data: Reference[]) => {         
        if (data.length > 0) {
          this.allergyGroups = data;
          this.getAllergies();
        }
      },
      error => console.log(error),
      () => console.log('Get ative allergies complete'));

  }

save() {

	this.messages = [];
    try {
      this.visitService.saveAllergies(this.patient)
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

  getAllergies() {
   
    this.visitService.getPatientEntities(this.patient.id, 'allergies')
      .subscribe((data: Patient) => {
        this.patient = data;
      },
      error => console.log(error),
      () => console.log('Get all patient allergies complete'));

    }
  
  ngOnDestroy() {
    this.allergyGroups = null;
  }

 }

 
