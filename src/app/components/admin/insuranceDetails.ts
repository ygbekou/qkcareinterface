import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Insurance } from '../../models/insurance';
import { GenericService, UserService } from '../../services';

@Component({
  selector: 'app-insurance-details',
  templateUrl: '../../pages/admin/insuranceDetails.html',
  providers: [GenericService]
})
export class InsuranceDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  insurance: Insurance = new Insurance();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  
  constructor
    (
      private genericService: GenericService,
      private userService: UserService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {

  }

  ngOnInit(): void {

    let insuranceId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          insuranceId = params['insuranceId'];
          
          if (insuranceId != null) {
              this.genericService.getOne(insuranceId, 'Insurance')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.insurance = result;
                } else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              });
          } 
        });
    
  }
  
  ngOnDestroy() {
    this.insurance = null;
  }

  save() {
    try {
      this.error = '';
      this.genericService.save(this.insurance, 'Insurance')
        .subscribe(result => {
          if (result.id > 0) {
            this.insurance = result;
          } else {
            this.error = Constants.SAVE_UNSUCCESSFUL;
            this.displayDialog = true;
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }

 }
