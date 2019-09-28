import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Package } from '../../models/package';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-invoice-list',
  templateUrl: '../../pages/admin/packageList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class PackageList extends BaseComponent implements OnInit, OnDestroy {

  packages: Package[] = [];
  cols: any[];

  constructor
    (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private route: ActivatedRoute,
    private router: Router,
    ) {
		  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '25%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
										style: {width: '35%', 'text-align': 'center'} },
			{ field: 'rate', header: 'Rate', headerKey: 'COMMON.RATE', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'discount', header: 'Discount', headerKey: 'COMMON.DISCOUNT', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];

    this.route
        .queryParams
        .subscribe(params => {

            const parameters: string [] = [];
            parameters.push('e.status = |status|0|Integer');

            this.genericService.getAllByCriteria('Package', parameters)
              .subscribe((data: Package[]) => {
                this.packages = data;
              },
              error => console.log(error),
              () => console.log('Get all Packages complete'));
          });


    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
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

  ngOnDestroy() {
    this.packages = null;
  }

  edit(packageId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'packageId': packageId,
        }
      };
      this.router.navigate(['/admin/packageDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

  delete(packageId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'packageId': packageId,
        }
      };
      this.router.navigate(['/admin/packageDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

 }
