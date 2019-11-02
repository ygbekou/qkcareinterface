import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GenericService, VisitService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { VaccineDropdown } from '../dropdowns';
import { Patient, PatientVaccine } from 'src/app/models';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
 
@Component({
  selector: 'app-vaccine-details',
  template: ` 
              <p-messages [(value)]="messages"></p-messages>
              <button type="button" pButton icon="fa fa-plus" (click)="addNew()"></button>
              <br/>
              <p-table [columns]="vaccineCols" [value]="patientVaccines">
                <ng-template pTemplate="header" let-vaccineCols>
                    <tr>
                        <th *ngFor="let col of vaccineCols" [pSortableColumn]="col.field">
                            {{col.header}}
                            <p-sortIcon [field]="col.field"></p-sortIcon>
                        </th>
                        <th>Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-rowData let-columns="columns">
                    <tr>
                        <td *ngFor="let col of columns" pEditableColumn>
                          <p-cellEditor *ngIf="col.field == 'givenDate'">
                                <ng-template pTemplate="input">
                                    <p-calendar [(ngModel)]="rowData[col.field]"></p-calendar>
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{rowData[col.field] | date:'dd/MM/yyyy'}}
                                </ng-template>
                            </p-cellEditor>
                            <p-cellEditor *ngIf="col.field == 'vaccineName'">
                                <ng-template pTemplate="input">
                                    <p-autoComplete [(ngModel)]="rowData['vaccine']"
                                    (onDropdownClick)="vaccineDropdown.handleDropdownClick($event)"
                                    [suggestions]="vaccineDropdown.filteredVaccines" [dropdown]="true"
                                    (completeMethod)="vaccineDropdown.filter($event)"
                                    name="name" field="name" [size]="30" placeholder=""
                                    [minLength]="1">
                                  </p-autoComplete>
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{rowData['vaccine'].name}}
                                </ng-template>
                            </p-cellEditor>
                        </td>
                        <td>
                          <button type="button" pButton icon="fa fa-save" (click)="save(rowData)"></button>&nbsp;&nbsp;
                          <button type="button" pButton icon="fa fa-eraser" (click)="remove(patientVaccines.length)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table> `,
  providers: [GenericService, VisitService, VaccineDropdown]
})
export class VaccineDetails extends BaseComponent implements OnInit, OnDestroy {
  
    public error: String = '';
    displayDialog: boolean;

    @Input() patient: Patient;
    patientVaccines: PatientVaccine[] = [];
    
    vaccineCols: any[];
   
    constructor
      (
        public genericService: GenericService,
        public translate: TranslateService,
        public confirmationService: ConfirmationService,
        public tokenStorage: TokenStorage,
        private route: ActivatedRoute,
        public vaccineDropdown: VaccineDropdown
      ) {
        super(genericService, translate, confirmationService, tokenStorage);
    }

    ngOnInit(): void {
      
      this.vaccineCols = [
              { field: 'vaccineName', header: 'Name', headerKey: 'COMMON.NAME' },
              { field: 'givenDate', header: 'Given Date', headerKey: 'COMMON.DATE', type: 'Date' }
          ];
      
      
      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
      });

      this.getVaccines();
    }
    
    addNew() {
      this.patientVaccines.push(new PatientVaccine(this.patient.id));
    }
    
    remove(index: number) {
      //this.givenVaccines.splice(index - 1, 1);
    }
  
    ngOnDestroy() {
      
    }
  
   updateCols() {
    for (var index in this.vaccineCols) {
      let col = this.vaccineCols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  getVaccines() {
   
    const parameters: string [] = [];
    parameters.push('e.patient.id = |patientId|' + this.patient.id + '|Long');
    this.genericService.getAllByCriteria('PatientVaccine', parameters, ' ORDER BY e.givenDate ')
      .subscribe((data: PatientVaccine[]) => {
        this.patientVaccines = data;

      },
      error => console.log(error),
      () => console.log('Get all Vaccine complete'));

    }


  save(patientVaccine: PatientVaccine) {
    try {
      this.messages = [];
      
      this.genericService.save(patientVaccine, 'PatientVaccine')
        .subscribe(result => {
          if (result.id > 0) {
			      this.processResult(result, patientVaccine, this.messages, null);
            patientVaccine = result;
            patientVaccine.vaccineName = patientVaccine.vaccine.name;
          } else {
            this.processResult(result, patientVaccine, this.messages, null);
          }
        })
    } catch (e) {
      console.log(e);
    }
  }
  
 }
