import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Constants } from '../../app.constants';
import { DeathReport } from '../../models/activities';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from '../admin/baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({ 
  selector: 'app-deathReport-list',
  templateUrl: '../../pages/activities/deathReportList.html',
  providers: [GenericService] 
})
  
export class DeathReportList extends BaseComponent implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  deathReports: DeathReport[] = [];
  cols: any[];
  
  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'deathDatetime', header: 'Date time', headerKey: 'COMMON.DEATH_DATETIME', type:'date' },
            { field: 'patientName', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'comments', header: 'Comments', headerKey: 'COMMON.COMMENTS' }
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
          
            this.genericService.getAllByCriteria(Constants.DEATH_REPORT_CLASS, parameters)
              .subscribe((data: DeathReport[]) => 
              { 
                this.deathReports = data 
              },
              error => console.log(error),
              () => console.log('Get all DeathReport complete'));
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
    this.deathReports = null;
  }
  
  edit(deathReportId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "deathReportId": deathReportId,
        }
      }
      this.router.navigate(["/admin/deathReportDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

  delete(deathReportId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "deathReportId": deathReportId,
        }
      }
      this.router.navigate(["/admin/deathReportDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
