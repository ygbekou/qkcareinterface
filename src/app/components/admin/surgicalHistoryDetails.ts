import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { VaccineDropdown, SurgicalProcedureDropdown } from '../dropdowns';
import { Patient, PatientSurgicalHistory } from 'src/app/models';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
 
@Component({
  selector: 'app-surgicalHistory-details',
  template: ` 
              <p-messages [(value)]="messages"></p-messages>
              <button type="button" pButton icon="fa fa-plus" (click)="addNew()"></button>
              <br/>
              <p-table [columns]="patientSurgicalHistoryCols" [value]="patientSurgicalHistories">
                <ng-template pTemplate="header" let-patientSurgicalHistoryCols>
                    <tr>
                        <th *ngFor="let col of patientSurgicalHistoryCols" [pSortableColumn]="col.field">
                            {{col.header}}
                            <p-sortIcon [field]="col.field"></p-sortIcon>
                        </th>
                        <th>Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowData let-columns="columns">
                    <tr>
                        <td *ngFor="let col of columns" pEditableColumn>
                          <p-cellEditor *ngIf="col.field == 'surgeryDate'">
                                <ng-template pTemplate="input">
                                    <p-calendar [(ngModel)]="rowData[col.field]"></p-calendar>
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{rowData[col.field] | date:'dd/MM/yyyy'}}
                                </ng-template>
                            </p-cellEditor>
                            <p-cellEditor *ngIf="col.field == 'surgicalProcedureName'">
                                <ng-template pTemplate="input">
                                    <p-autoComplete [(ngModel)]="rowData['surgicalProcedure']"
                                    (onDropdownClick)="surgicalProcedureDropdown.handleDropdownClick($event)"
                                    [suggestions]="surgicalProcedureDropdown.filteredSurgicalProcedures" [dropdown]="true"
                                    (completeMethod)="surgicalProcedureDropdown.filter($event)"
                                    name="name" field="name" [size]="30" placeholder=""
                                    [minLength]="1">
                                  </p-autoComplete>
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{rowData['surgicalProcedure'].name}}
                                </ng-template>
                            </p-cellEditor>
                        </td>
                        <td>
                          <button type="button" pButton icon="fa fa-save" (click)="save(rowData)"></button>&nbsp;&nbsp;
                          <button type="button" pButton icon="fa fa-eraser" (click)="remove(patientSurgicalHistories.length)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table> `,
  providers: [GenericService, VisitService, VaccineDropdown]
})
export class SurgicalHistoryDetails extends BaseComponent implements OnInit, OnDestroy {
  
    public error: String = '';
    displayDialog: boolean;

    @Input() patient: Patient;
    patientSurgicalHistories: PatientSurgicalHistory[] = [];
    
    patientSurgicalHistoryCols: any[];
   
    constructor
      (
        public genericService: GenericService,
        public translate: TranslateService,
        public confirmationService: ConfirmationService,
        public tokenStorage: TokenStorage,
        private route: ActivatedRoute,
        public surgicalProcedureDropdown: SurgicalProcedureDropdown
      ) {
        super(genericService, translate, confirmationService, tokenStorage);
    }

    ngOnInit(): void {
      
      this.patientSurgicalHistoryCols = [
              { field: 'surgicalProcedureName', header: 'Name', headerKey: 'COMMON.NAME' },
              { field: 'surgeryDate', header: 'Surgery Date', headerKey: 'COMMON.DATE', type: 'Date' }
          ];
      
      
      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
      });

      this.getSurgicalProcedures();
    }
    
    addNew() {
      this.patientSurgicalHistories.push(new PatientSurgicalHistory(this.patient.id));
    }
    
    remove(index: number) {
      //this.givenVaccines.splice(index - 1, 1);
    }
  
    ngOnDestroy() {
      
    }
  
   updateCols() {
    for (var index in this.patientSurgicalHistoryCols) {
      let col = this.patientSurgicalHistoryCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  getSurgicalProcedures() {
   
    const parameters: string [] = [];
    parameters.push('e.patient.id = |patientId|' + this.patient.id + '|Long');
    this.genericService.getAllByCriteria('PatientSurgicalHistory', parameters, ' ORDER BY e.surgeryDate ')
      .subscribe((data: PatientSurgicalHistory[]) => {
        this.patientSurgicalHistories = data;

        for (var index in this.patientSurgicalHistories) {
          this.patientSurgicalHistories[index].surgeryDate = new Date(this.patientSurgicalHistories[index].surgeryDate);
        }

      },
      error => console.log(error),
      () => console.log('Get all Patient Surgicl Procedure complete'));

    }


  save(patientSurgicalHistory: PatientSurgicalHistory) {
    try {
      this.messages = [];
      
      this.genericService.save(patientSurgicalHistory, 'PatientSurgicalHistory')
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, patientSurgicalHistory, this.messages, null);
            patientSurgicalHistory = result;
            patientSurgicalHistory.surgicalProcedureName = patientSurgicalHistory.surgicalProcedure.name;
          } else {
            this.processResult(result, patientSurgicalHistory, this.messages, null);
          }
        })
    } catch (e) {
      console.log(e);
    }
  }
  
 }
