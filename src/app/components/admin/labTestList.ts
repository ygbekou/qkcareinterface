import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LabTest } from '../../models/labTest';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-labTest-list',
  templateUrl: '../../pages/admin/labTestList.html',
  providers: [GenericService]
})
export class LabTestList implements OnInit, OnDestroy {
  
  labTests: LabTest[] = [];
  cols: any[];
  
  @Output() labTestIdEvent = new EventEmitter<string>();
  
  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name'             , header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'description'      , header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'normalRange'      , header: 'Normal Range', headerKey: 'COMMON.NORMAL_RANGE' },
            { field: 'methodName'       , header: 'Method', headerKey: 'COMMON.METHOD' },
            { field: 'groupName'        , header: 'Group', headerKey: 'COMMON.GROUP' },
            { field: 'statusDesc'       , header: 'Status', headerKey: 'COMMON.STATUS', type:'string' }
        ];
    
    this.route
        .queryParams
        .subscribe(() => {          
          
            let parameters: string [] = []; 
            
            
            this.genericService.getAllByCriteria('LabTest', parameters)
              .subscribe((data: LabTest[]) => 
              { 
                this.labTests = data 
                console.info(this.labTests)
              },
              error => console.log(error),
              () => console.log('Get all Lab Tests complete'));
          });
  
      this.updateCols();
      this.translate.onLangChange.subscribe(() => {
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
    this.labTests = null;
  }
  
  edit(labTestId: number) {
      this.labTestIdEvent.emit(labTestId + '');
  }

  delete(labTestId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "labTestId": labTestId,
        }
      }
      this.router.navigate(["/admin/labTestDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
  
  getAllLabTests() {
    this.genericService.getAll('LabTest')
      .subscribe((data: LabTest[]) => 
      { 
        this.labTests = data 
        console.info(this.labTests)
      },
      error => console.log(error),
      () => console.log('Get all Lab Tests complete'));
  }

 }
