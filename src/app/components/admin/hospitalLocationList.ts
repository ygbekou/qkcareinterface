import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalLocation } from '../../models';  
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-hospitalLocation-list',
  templateUrl: '../../pages/admin/hospitalLocationList.html',
  providers: [GenericService]
})
export class HospitalLocationList extends BaseComponent implements OnInit, OnDestroy {
  
  hospitalLocations: HospitalLocation[] = [];
  cols: any[];
  
  @Output() hospitalLocationIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private route: ActivatedRoute
    ) {
		super(genericService, translate, confirmationService);
    
  }

  ngOnInit(): void {
    this.cols = [
			{ field: 'name', header: 'Name', headerKey: 'COMMON.NAME', 
					type: 'string', style: {width: '20%', 'text-align': 'center'} },
			{ field: 'address', header: 'Address', headerKey: 'COMMON.ADDRESS', 
					type: 'string', style: {width: '25%', 'text-align': 'center'} },
			{ field: 'city', header: 'City', headerKey: 'COMMON.CITY', 
					type: 'string', style: {width: '25%', 'text-align': 'center'} },
			{ field: 'countryName', header: 'Country', headerKey: 'COMMON.COUNTRY',
					type: 'string', style: {width: '10%', 'text-align': 'center'} },
			{ field: 'status', header: 'Status', headerKey: 'COMMON.STATUS',
			 		type: 'string', style: {width: '10%', 'text-align': 'center'}  }
        ];
    
    this.route
        .queryParams
        .subscribe(() => {          
          
            const parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer');
            
            this.genericService.getAllByCriteria('HospitalLocation', parameters, " ORDER BY name DESC ")
              .subscribe((data: HospitalLocation[]) => { 
                this.hospitalLocations = data; 
              },
              error => console.log(error),
              () => console.log('Get all hospitalLocations complete'));
          });
  

      this.updateCols();
      this.translate.onLangChange.subscribe(() => {
          this.updateCols();
      });
  }
 
  
  updateCols() {
    for (let index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }

  }
 
 
  ngOnDestroy() {
    this.hospitalLocations = null;
  }
  
  edit(labTestId: number) {
      this.hospitalLocationIdEvent.emit(labTestId + '');
  }

  updateTable(hospitalLocation: HospitalLocation) {
		const index = this.hospitalLocations.findIndex(x => x.id === hospitalLocation.id);

		if (index === -1) {
			this.hospitalLocations.push(hospitalLocation);
		} else {
			this.hospitalLocations[index] = hospitalLocation;
		}

  }

  getAllHospitalLocations() {
    this.genericService.getAll('HospitalLocation')
      .subscribe((data: HospitalLocation[]) => { 
        this.hospitalLocations = data; 
      },
      error => console.log(error),
      () => console.log('Get all HL complete'));
  }
  
 }
