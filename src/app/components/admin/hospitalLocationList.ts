import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User, Schedule, Employee, HospitalLocation } from '../../models';  
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-hospitalLocation-list',
  templateUrl: '../../pages/admin/hospitalLocationList.html',
  providers: [GenericService]
})
export class HospitalLocationList implements OnInit, OnDestroy {
  
  hospitalLocations: HospitalLocation[] = [];
  cols: any[];
  
  @Output() hospitalLocationIdEvent = new EventEmitter<string>();
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'address', header: 'Address', headerKey: 'COMMON.ADDRESS' },
            { field: 'city', header: 'City', headerKey: 'COMMON.CITY' },
            { field: 'countryName', header: 'Country', headerKey: 'COMMON.COUNTRY' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            parameters.push('e.status = |status|0|Integer')
            
            this.genericService.getAllByCriteria('HospitalLocation', parameters)
              .subscribe((data: HospitalLocation[]) => 
              { 
                this.hospitalLocations = data 
                console.info(this.hospitalLocations)
              },
              error => console.log(error),
              () => console.log('Get all hospitalLocations complete'));
          });
  

      this.updateCols();
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.updateCols();
      });
  }
 
  
  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
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

  delete(hospitalLocationId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "hospitalLocationId": hospitalLocationId,
        }
      }
      this.router.navigate(["/admin/hospitalLocationDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  getAllHospitalLocations() {
    this.genericService.getAll('HospitalLocation')
      .subscribe((data: HospitalLocation[]) => 
      { 
        this.hospitalLocations = data 
        console.info(this.hospitalLocations)
      },
      error => console.log(error),
      () => console.log('Get all HL complete'));
  }
  
 }
