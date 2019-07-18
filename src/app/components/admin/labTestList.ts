import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LabTest } from '../../models/labTest';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-labTest-list',
  templateUrl: '../../pages/admin/labTestList.html',
  providers: [GenericService]
})
export class LabTestList extends BaseComponent implements OnInit, OnDestroy {
  
  labTests: LabTest[] = [];
  cols: any[];
  
  @Output() labTestIdEvent = new EventEmitter<string>();
  
  constructor
    (
    public genericService: GenericService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		super(genericService, translate, confirmationService);
    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name'             , header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'description'      , header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '20%', 'text-align': 'center'} },
            { field: 'normalRange'      , header: 'Normal Range', headerKey: 'COMMON.NORMAL_RANGE', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'methodName'       , header: 'Method', headerKey: 'COMMON.METHOD', type: 'string',
                                        style: {width: '15%', 'text-align': 'center'} },
            { field: 'groupName'        , header: 'Group', headerKey: 'COMMON.GROUP', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'statusDesc'       , header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];
    
    this.route
        .queryParams
        .subscribe(() => {          
          
            const parameters: string [] = []; 
            
            this.genericService.getAllByCriteria('LabTest', parameters)
              .subscribe((data: LabTest[]) => { 
                this.labTests = data; 
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
    for (let index in this.cols) {
      const col = this.cols[index];
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
  
  getAllLabTests() {
    this.genericService.getAll('LabTest')
      .subscribe((data: LabTest[]) => { 
        this.labTests = data; 
        console.info(this.labTests);
      },
      error => console.log(error),
      () => console.log('Get all Lab Tests complete'));
  }

  updateTable(labTest: LabTest) {
		const index = this.labTests.findIndex(x => x.id === labTest.id);

		if (index === -1) {
			this.labTests.push(labTest);
		} else {
			this.labTests[index] = labTest;
		}

  }

 }
