import { Component, OnInit, OnDestroy, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Constants } from '../../app.constants';
import { BirthReport } from '../../models/activities';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({ 
  selector: 'app-birthReport-list',
  templateUrl: '../../pages/activities/birthReportList.html',
  providers: [GenericService] 
})
  
export class BirthReportList extends BaseComponent implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  birthReports: BirthReport[] = [];
  cols: any[];
  
  constructor
    (
    private globalEventsManager: GlobalEventsManager,
    public genericService: GenericService,
    public confirmationService: ConfirmationService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'birthDatetime', header: 'Date time', headerKey: 'COMMON.BIRTH_DATE', type:'date' },
            { field: 'name', header: 'Baby Name', headerKey: 'COMMON.BABY' },
            { field: 'fatherName', header: 'Father Name', headerKey: 'COMMON.FATHER' },
            { field: 'motherName', header: 'Mother Name', headerKey: 'COMMON.MOTHER' },
            { field: 'comments', header: 'Notes', headerKey: 'COMMON.NOTES' }
        ];
    
    this.route
        .queryParams
        .subscribe(params => {          
          
            let parameters: string [] = []; 
            
            let itemNumberLabel = params['itemNumberLabel'];
          
            parameters.push('e.status = |status|0|Integer')
            if (itemNumberLabel == 'Visit') 
              parameters.push('e.visit.id > |visitId|0|Long')
            if (itemNumberLabel == 'Admission') 
              parameters.push('e.admission.id > |admissionId|0|Long')
          
            this.genericService.getAllByCriteria(Constants.BIRTH_REPORT_CLASS, parameters)
              .subscribe((data: BirthReport[]) => 
              { 
                this.birthReports = data 
              },
              error => console.log(error),
              () => console.log('Get all BirthReport complete'));
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
    this.birthReports = null;
  }
  
  edit(birthReportId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "birthReportId": birthReportId,
        }
      }
      this.router.navigate(["/admin/birthReportDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(birthReportId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "birthReportId": birthReportId,
        }
      }
      this.router.navigate(["/admin/birthReportDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
