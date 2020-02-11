import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Reference } from '../../models/reference';
import { Visit } from '../../models/visit';
import { GenericService, VisitService } from '../../services';
 
@Component({
  selector: 'app-symptom-details',
  template: `<div class="ui-grid-row" *ngFor="let symptomGroup of symptomGroups">
              <div class="ui-grid-col-1 ui-sm-12" >
                {{symptomGroup.name}}:
              </div>
              <div class="ui-grid-col-11 ui-sm-12" >
                <p-checkbox id="status" 
                  [(ngModel)]="visit.selectedSymptoms" [value]="symptom.id"
                  label="{{symptom.name}}"
                  *ngFor="let symptom of symptomGroup.childs; let i = index"></p-checkbox>
              </div>
            </div>`, 
  providers: [GenericService, VisitService]
})
export class SymptomDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  @Input() visit: Visit = new Visit();
  symptomGroups: Reference[] = [];
 
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
    
    this.genericService.getActiveElements('symptom')
      .subscribe((data: Reference[]) => { 
        console.info(data);
        if (data.length > 0) {
          this.symptomGroups = data;
        }
      },
      error => console.log(error),
      () => console.log('Get ative symptoms complete'));

  }
  
  ngOnDestroy() {
    this.symptomGroups = null;
  }
 }
