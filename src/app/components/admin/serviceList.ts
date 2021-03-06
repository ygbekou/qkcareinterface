import { Component, OnInit, OnDestroy } from '@angular/core';
import { Service } from '../../models';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GenericService, TokenStorage, AppInfoStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-service-list',
  templateUrl: '../../pages/admin/serviceList.html',
  providers: []
})
export class ServiceList extends BaseComponent implements OnInit, OnDestroy {

  services: Service[] = [];
  cols: any[];

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public appInfoStorage: AppInfoStorage,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute,
      private router: Router,
  ) {
    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
      {
        field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
        style: { width: '25%', 'text-align': 'center' }
      },
      {
        field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
        style: { width: '35%', 'text-align': 'center' }
      },
      {
        field: 'quantity', header: 'Quantity', headerKey: 'COMMON.QUANTITY', type: 'number',
        style: { width: '10%', 'text-align': 'right' }
      },
      {
        field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE', type: 'number',
        style: { width: '10%', 'text-align': 'right' }
      },
      {
        field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
        style: { width: '10%', 'text-align': 'center' }
      }
    ];

    this.route
      .queryParams
      .subscribe(params => {

        const parameters: string[] = [];
        parameters.push('e.status = |status|0|Integer');

        this.genericService.getAllByCriteria('Service', parameters)
          .subscribe((data: Service[]) => {
            this.services = data;
          },
            error => console.log(error),
            () => console.log('Get all Services complete'));
      });

    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }


  updateCols() {
    // tslint:disable-next-line: forin
    for (const index in this.cols) {
      const col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }

  ngOnDestroy() {
    this.services = null;
  }

  edit(serviceId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'serviceId': serviceId,
        }
      };
      this.router.navigate(['/admin/serviceDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

}
