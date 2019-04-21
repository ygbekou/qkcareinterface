import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {  } from 'primeng/primeng';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Company } from '../../models/company';

@Component({
  selector: 'app-company-list',
  templateUrl: '../../pages/admin/companyList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class CompanyList implements OnInit, OnDestroy {

  companies: Company[] = [];
  cols: any[];
  @Output() companyIdEvent = new EventEmitter<string>();

  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private router: Router,
    ) {

      const parameters: string [] = [];
      this.genericService.getAllByCriteria('Company', parameters)
          .subscribe((data: Company[]) => {
        this.companies = data;
      },
      error => console.log(error),
      () => console.log('Get all Company complete'));

  }

  updateCols() {
    // tslint:disable-next-line:forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'language', header: 'Language', headerKey: 'COMMON.LANGUAGE'},
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME'},
            { field: 'address', header: 'Address', headerKey: 'COMMON.ADDRESS' },
            { field: 'email', header: 'Email', headerKey: 'COMMON.EMAIL' },
            { field: 'phone', header: 'Phone', headerKey: 'COMMON.PHONE' }
        ];

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateCols();
    });
  }


  ngOnDestroy() {
    this.companies = null;
  }

  edit(companyId: number) {
      this.companyIdEvent.emit(companyId + '');
  }

  delete(companyId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'companyId': companyId,
        }
      };
      this.router.navigate(['/admin/companyDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  getStatusDesc(company: Company): string {
    let statusDesc = '';
    if (company.status === 0) {
      statusDesc = 'Actif';
    } else if (company.status === 1) {
      statusDesc = 'Inactif';
    }
    return statusDesc;
  }
 }
