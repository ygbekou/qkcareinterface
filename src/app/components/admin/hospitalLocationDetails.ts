import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalLocation, Country } from '../../models';
import { CountryDropdown } from '../dropdowns';
import { GenericService } from '../../services';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';
import { TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-hospitalLocation-details',
  templateUrl: '../../pages/admin/hospitalLocationDetails.html',
  providers: [GenericService, CountryDropdown]
})
export class HospitalLocationDetails extends BaseComponent implements OnInit, OnDestroy {
  
  hospitalLocation: HospitalLocation = new HospitalLocation();
  
  @Output() hospitalLocationSaveEvent = new EventEmitter<HospitalLocation>();
  
  constructor
    (
	  public genericService: GenericService,
	  public translate: TranslateService,
	  public confirmationService: ConfirmationService,
	  private countryDropdown: CountryDropdown,
	  private route: ActivatedRoute    ) {

		super(genericService, translate, confirmationService);
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
                  this.hospitalLocation = result;
				}
              });
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
      this.genericService.save(this.hospitalLocation, 'HospitalLocation')
        .subscribe(result => {
          if (result.id > 0) {
			this.processResult(result, this.hospitalLocation, this.messages, null);
			this.hospitalLocationSaveEvent.emit(this.hospitalLocation);
          } else {
            this.processResult(result, this.hospitalLocation, this.messages, null);
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  getHospitalLocation(hospitalLocationId: number) {
    this.genericService.getOne(hospitalLocationId, 'HospitalLocation')
        .subscribe(result => {
      if (result.id > 0) {
        this.hospitalLocation = result;
      }
      
    });
  }

  
 }
