import { Constants } from '../../app.constants';
import { Patient, Visit, Admission, Bill } from '../../models';
import { User } from '../../models/user';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, AppointmentService, BillingService } from '../../services';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-visitAdm-lookup',
  template: `<div class="ui-grid ui-grid-responsive ui-fluid">
              <div class="ui-grid-row">
                <div class="ui-grid-col-5 ui-sm-12">  
          
                  <div class="ui-grid-row" *ngIf="itemType == 'ALL'">
                    <p-radioButton name="itemLabel" value="Visit" label="Visit" (onClick)="clearSelection()"
                    [(ngModel)]="itemNumberLabel" #itemLabelr="ngModel" required></p-radioButton>
                    <p-radioButton name="itemLabel" value="Admission" label="Admission" (onClick)="clearSelection()"
                    [(ngModel)]="itemNumberLabel" #itemLabelr="ngModel" required></p-radioButton>
                 </div>
				<br/>
                 
                 <div class="ui-grid-row">
                     <div class="form-group">
						<form #searchForm="ngForm">
							<div class="ui-inputgroup">
								<input type="text" pInputText class="form-control" id="searchT"
									required [(ngModel)]="itemNumber" (change)="lookUpItem()"
									placeholder="{{SEARCH_TEXT}}" name="searchT"
									#searchT="ngModel">
								<button type="button" pButton icon="fa fa-search" (click)="openVisitOrAdmSearchPage()"></button>
							</div>
                        </form>
                     </div>
                  </div>
                </div>
                <div class="ui-grid-col-6 ui-sm-12">
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      Patient ID:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="visit && visit.patient">
                      {{visit.patient.medicalRecordNumber}}
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="admission && admission.patient">
                      {{admission.patient.medicalRecordNumber}}
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12">
                      Gender:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="visit && visit.patient">
                      {{visit.patient.sex}}
                    </div>  
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="admission && admission.patient">
                      {{admission.patient.sex}}
                    </div>     
                  </div>
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      Name:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="visit && visit.patient">
                      {{visit.patient.name}}
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="admission && admission.patient">
                      {{admission.patient.name}}
                    </div>
                  </div>
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-4 ui-sm-12">
                      DOB:
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="visit && visit.patient">
                      {{visit.patient.user.birthDate | date:'dd/MM/yyyy'}}
                    </div>
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="admission && admission.patient">
                      {{admission.patient.user.birthDate | date:'dd/MM/yyyy'}}
                    </div>
                  </div>  
                  <div class="ui-grid-row">
                    <div class="ui-grid-col-6 ui-sm-12" *ngIf="visit && visit.patient">
                      Visit Date: {{visit.visitDatetime | date:'dd/MM/yyyy'}}
                    </div>
                    <div class="ui-grid-col-6 ui-sm-12" *ngIf="visit && visit.patient">
                      Visit ID: {{visit.id}}
                    </div>
                    <div class="ui-grid-col-6 ui-sm-12" *ngIf="admission && admission.patient">
                      Admission Date: {{admission.admissionDatetime | date:'dd/MM/yyyy'}}
                    </div>
                    <div class="ui-grid-col-6 ui-sm-12" *ngIf="admission && admission.patient">
                      Admission ID: {{admission.id}}
                    </div>
                  </div>        
                </div>
              </div>
             </div>`
})
  
  
export class VisitAdmLookup implements OnInit {
   
  @Input() itemNumberLabel: string = 'Visit';
  @Input() itemType: string = 'ALL';
  @Input() visit: Visit;
  @Input() admission: Admission;
  
  @Output() visitEmit: EventEmitter<Visit> = new EventEmitter<Visit>();
  @Output() admissionEmit: EventEmitter<Admission> = new EventEmitter<Admission>();
  @Output() billEmit: EventEmitter<Bill> = new EventEmitter<Bill>();
  @Input() itemNumber: string;
  @Input() originalPage: string;
  
  SEARCH_TEXT: string = "";
  
  constructor(
        private genericService: GenericService,
        private billingService: BillingService,
        private router: Router
    ) {
		
  }
  
  ngOnInit() {
  }
  
  openPatientSearchPage() {
	if (this.itemNumber !== undefined && this.itemNumber !== '') {
			this.lookUpItem();
	} else {
		try {
		let navigationExtras: NavigationExtras = {
			queryParams: {
				"originalPage": this.originalPage,    
			}
		}
			this.router.navigate(["/admin/visitList"], navigationExtras);
		}
		catch (e) {
			console.log(e);
		}
	}
  }

  lookUpItem() {
    this.visit = null;
    this.admission = null;
    let parameters: string[] = [];

    if (this.itemNumberLabel == 'Visit') 
      parameters.push('e.id = |visitId|' + this.itemNumber + '|Long')
    if (this.itemNumberLabel == 'Admission') 
      parameters.push('e.id = |admissionId|' + this.itemNumber + '|Long')
  
      this.genericService.getAllByCriteria(this.itemNumberLabel, parameters)
        .subscribe((data: any[]) => {
          if (data) {
            if (this.itemNumberLabel == 'Visit')  {
              this.visit = data[0];
              this.visitEmit.emit(this.visit);
            } 
            if (this.itemNumberLabel == 'Admission') {
              this.admission = data[0];
              this.admissionEmit.emit(this.admission);
            }
          }
        },
        error => console.log(error),
        () => console.log('Get Item complete'));
    
        if (this.originalPage == 'admin/billDetails') {

            this.billingService.getBillByItemNumber(this.itemNumberLabel, this.itemNumber)
              .subscribe((data: Bill) => {
                if (data) {
                    this.billEmit.emit(data);
                }
              },
              error => console.log(error),
              () => console.log('Get Item complete'));
                 
        }
  }
  
  
  clearSelection() {
    this.itemNumber = '';
    this.visit = null;
    this.admission = null;
  }
}
