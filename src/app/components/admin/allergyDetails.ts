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
  selector: 'app-allergy-details',
  template: `<p-fieldset legend="ALLERGIES" >
            <div class="ui-grid-row" *ngFor="let allergyGroup of allergyGroups">
              <div class="ui-grid-col-1 ui-sm-12" >
                {{allergyGroup.name}}:
              </div>
              <div class="ui-grid-col-11 ui-sm-12" >
                <p-checkbox id="status" 
                  [(ngModel)]="visit.selectedAllergies" [value]="allergy.id"
                  label="{{allergy.name}}"
                  *ngFor="let allergy of allergyGroup.childs; let i = index"></p-checkbox>
              </div>
            </div>
            </p-fieldset>`,
  providers: [GenericService, VisitService]
})
export class AllergyDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() visit: Visit = new Visit();
  allergyGroups: Reference[] = [];
 
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
    
    this.genericService.getActiveElements('allergy')
      .subscribe((data: Reference[]) => 
      { 
        console.info(data)
        if (data.length > 0) {
          this.allergyGroups = data;
        }
      },
      error => console.log(error),
      () => console.log('Get ative allergies complete'));

  }
  
  ngOnDestroy() {
    this.allergyGroups = null;
  }
 }
