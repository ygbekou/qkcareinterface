import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalLocation, Country } from '../../models';
import { Constants } from '../../app.constants';
import { CountryDropdown } from '../dropdowns';
import { GenericService } from '../../services';

@Component({
  selector: 'app-hospitalLocation-details',
  templateUrl: '../../pages/admin/hospitalLocationDetails.html',
  providers: [GenericService, CountryDropdown]
})
export class HospitalLocationDetails implements OnInit, OnDestroy {
  
  hospitalLocation: HospitalLocation = new HospitalLocation();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  DEPARTMENT: string = Constants.DEPARTMENT;
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private route: ActivatedRoute    ) {

  }

  ngOnInit(): void {

    let hospitalLocationId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.hospitalLocation.country = new Country();
          
          hospitalLocationId = params['hospitalLocationId'];
          
          if (hospitalLocationId != null) {
              this.genericService.getOne(hospitalLocationId, 'HospitalLocation')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.hospitalLocation = result
                }
                else {
                  
                }
              })
          } else {
              
          }
        });
    
  }
  
  ngOnDestroy() {
    this.hospitalLocation = null;
  }

  clear() {
    this.hospitalLocation = new HospitalLocation();
  }
  
  save() {
    try {
      this.genericService.save(this.hospitalLocation, "HospitalLocation")
        .subscribe(result => {
          if (result.id > 0) {
            this.hospitalLocation = result
          }
          else {

          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }

  getHospitalLocation(hospitalLocationId: number) {
    this.genericService.getOne(hospitalLocationId, 'HospitalLocation')
        .subscribe(result => {
      if (result.id > 0) {
        this.hospitalLocation = result
      }
      
    })
  }
  
  delete() {
    
  }
  
 }
