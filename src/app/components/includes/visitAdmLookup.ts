import { Visit, Admission, Bill } from '../../models';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GenericService, BillingService } from '../../services';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-visitAdm-lookup',
  template: `<div class="ui-grid ui-grid-responsive ui-fluid">
              <div class="ui-grid-row">
                <div class="ui-grid-col-5 ui-sm-12">  
          
                  <div class="ui-grid-row" *ngIf="itemType == 'ALL'">
                    <p-radioButton name="itemLabel" value="Visit" label="Visit" (onClick)="clearSelection()"
                    [(ngModel)]="itemNumberLabel" #itemLabelr="ngModel" required></p-radioButton>&nbsp;&nbsp;&nbsp;
                    <p-radioButton name="itemLabel" value="Admission" label="Admission" (onClick)="clearSelection()"
                    [(ngModel)]="itemNumberLabel" #itemLabelr="ngModel" required></p-radioButton>
                 </div>
				<br/>
                 
                 <div class="ui-grid-row">
                     <div class="form-group">
						<form #searchForm="ngForm">
							<div class="ui-inputgroup">
								<input type="text" pInputText class="form-control" id="searchT"
									required [(ngModel)]="itemNumber"
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
                      {{visit.patient.user.sex}}
                    </div>  
                    <div class="ui-grid-col-4 ui-sm-12" *ngIf="admission && admission.patient">
                      {{admission.patient.user.sex}}
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
   
  @Input() itemNumberLabel = 'Visit';
  @Input() itemType = 'ALL';
  @Input() visit: Visit;
  @Input() admission: Admission;
  
  @Output() visitEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() admissionEmit: EventEmitter<Admission> = new EventEmitter<Admission>();
  @Output() billEmit: EventEmitter<Bill> = new EventEmitter<Bill>();
  @Input() itemNumber: string;
  @Input() originalPage: string;
  
  SEARCH_TEXT = '';
  
  constructor(
        private genericService: GenericService,
        private billingService: BillingService,
        private router: Router
    ) {
		
  }
  
  ngOnInit() {
  }
  
  openVisitOrAdmSearchPage() {
    if (this.itemNumber !== undefined && this.itemNumber !== '') {
        this.lookUpItem();
    } else {
      try {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'originalPage': this.originalPage,    
          }
        };
        this.router.navigate(['/admin/' + this.itemNumberLabel.toLowerCase() + 'List'], navigationExtras);
      } catch (e) {
        console.log(e);
      }
    }
  }

  lookUpItem() {
    this.visit = null;
    this.admission = null;
    const parameters: string[] = [];

    if (this.itemNumberLabel === 'Visit') { 
      parameters.push('e.id = |visitId|' + this.itemNumber + '|Long');
    }
    if (this.itemNumberLabel === 'Admission') { 
      parameters.push('e.id = |admissionId|' + this.itemNumber + '|Long');
    }
  
      this.genericService.getAllByCriteria(this.itemNumberLabel, parameters)
        .subscribe((data: any[]) => {
          if (data) {
            if (this.itemNumberLabel === 'Visit')  {
              this.visit = data[0];
              this.visitEmit.emit(this.visit);
            } 
            if (this.itemNumberLabel === 'Admission') {
              this.admission = data[0];
              this.visitEmit.emit(this.admission);
            }
          }
        },
        error => console.log(error),
        () => console.log('Get Item complete'));
    
        if (this.originalPage === 'admin/billDetails') {

            this.billingService.getBillByItemNumber(this.itemNumberLabel, this.itemNumber)
              .subscribe((data: Bill) => {
                if (data && data.id != null && data.id != null) {
                    this.billEmit.emit(data);
                } else {
					try {
						const navigationExtras: NavigationExtras = {
							queryParams: {
								'originalPage': this.originalPage,    
							}
						};
						this.router.navigate(['/admin/' + this.itemNumberLabel.toLowerCase() + 'List'], navigationExtras);
					} catch (e) {
						console.log(e);
					}
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
