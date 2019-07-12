import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { GivenVaccine } from '../../models/givenVaccine';
import { Reference } from '../../models/reference';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { Visit } from '../../models/visit';
import { GenericService, GlobalEventsManager, VisitService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { VaccineDropdown } from '../dropdowns';
 
@Component({
  selector: 'app-vaccine-details',
  template: ` 
             <p-table [columns]="vaccineCols" [value]="givenVaccines">
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
                            <p-cellEditor *ngIf="col.field == 'vaccine'">
                                <ng-template pTemplate="input">
                                    <p-autoComplete [(ngModel)]="rowData[col.field]"
                                    (onDropdownClick)="vaccineDropdown.handleDropdownClick($event)"
                                    [suggestions]="vaccineDropdown.filteredVaccines" [dropdown]="true"
                                    (completeMethod)="vaccineDropdown.filter($event)"
                                    name="name" field="name" [size]="30" placeholder=""
                                    [minLength]="1">
                                  </p-autoComplete>
                                </ng-template>
                                <ng-template pTemplate="output">
                                    {{rowData[col.field].name}}
                                </ng-template>
                            </p-cellEditor>
                        </td>
                        <td>
                          <button type="button" pButton icon="fa fa-plus" (click)="addNew()"></button>&nbsp;&nbsp;
                          <button type="button" pButton icon="fa fa-eraser" (click)="remove(givenVaccines.length)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table> `,
  providers: [GenericService, VisitService, VaccineDropdown]
})
export class VaccineDetails implements OnInit, OnDestroy {
  
    public error: String = '';
    displayDialog: boolean;
    @Input() givenVaccines: GivenVaccine[] = [];
    
    vaccineCols: any[];
   
    constructor
      (
        private genericService: GenericService,
        private visitService: VisitService,
        private translate: TranslateService,
        private vaccineDropdown: VaccineDropdown,
        private changeDetectorRef: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router
      ) {
    }

    ngOnInit(): void {
      
      this.vaccineCols = [
              { field: 'vaccine', header: 'Name', headerKey: 'COMMON.NAME' },
              { field: 'givenDate', header: 'Given Date', headerKey: 'COMMON.DATE', type: 'Date' }
          ];
      
      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
      });
    }
    
    addNew() {
      this.givenVaccines.push(new GivenVaccine());
    }
    
    remove(index: number) {
      this.givenVaccines.splice(index - 1, 1);
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
  
 }
