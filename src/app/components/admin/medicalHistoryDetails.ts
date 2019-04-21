import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Reference } from '../../models/reference';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { Visit } from '../../models/visit';
import { GenericService, GlobalEventsManager, VisitService } from '../../services';
 
@Component({
  selector: 'app-medicalHistory-details',
  template: `<div class="ui-grid-row">
                <div class="ui-grid-col-11 ui-sm-12" >
                  <p-checkbox id="status" 
                    [(ngModel)]="visit.selectedMedicalHistories" [value]="medicalHistory.id"
                    label="{{medicalHistory.name}}"
                    *ngFor="let medicalHistory of medicalHistories; let i = index"></p-checkbox>
                </div>
              </div>`, 
  providers: [GenericService, VisitService]
})
export class MedicalHistoryDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() visit: Visit = new Visit();
  medicalHistories: Reference[] = [];
 
  constructor
    (
      private genericService: GenericService,
      private visitService: VisitService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {
  }

  ngOnInit(): void {
    
    this.genericService.getActiveElements('medicalhistory')
      .subscribe((data: Reference[]) => 
      { 
        console.info(data)
        if (data.length > 0) {
          this.medicalHistories = data;
        }
      },
      error => console.log(error),
      () => console.log('Get ative medicalHistories complete'));

  }
  
  ngOnDestroy() {
    this.medicalHistories = null;
  }
 }
