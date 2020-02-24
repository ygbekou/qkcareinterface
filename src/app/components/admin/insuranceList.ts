import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Insurance } from '../../models/insurance';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { GenericService } from '../../services';

@Component({
  selector: 'app-insurance-list',
  templateUrl: '../../pages/admin/insuranceList.html',
  providers: [GenericService]
})
export class InsuranceList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  insurances: Insurance[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  constructor
    (
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'insuranceNumber', header: 'Number' },
            { field: 'insuranceCode', header: 'Code' },
            { field: 'serviceTax', header: 'Service Tax' },
            { field: 'discount', header: 'Discount' },
            { field: 'remark', header: 'Remark' },
            { field: 'hospitalRate', header: 'Hospital Rate' },
            { field: 'insuranceRate', header: 'Insurance Rate' },
            { field: 'total', header: 'Total' },
            { field: 'status', header: 'Status' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            const parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer');
            
            this.genericService.getAllByCriteria('Insurance', parameters)
              .subscribe((data: Insurance[]) => { 
                this.insurances = data; 
              },
              error => console.log(error),
              () => console.log('Get all Insurances complete'));
          });
  }
 
  
  ngOnDestroy() {
    this.insurances = null;
  }
  
  edit(insuranceId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'insuranceId': insuranceId,
        }
      };
      this.router.navigate(['/admin/insuranceDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(insuranceId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'insuranceId': insuranceId,
        }
      };
      this.router.navigate(['/admin/insuranceDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

 }
