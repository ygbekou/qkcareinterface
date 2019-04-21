import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Package } from '../../models/package';
import { GenericService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-invoice-list',
  templateUrl: '../../pages/admin/packageList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class PackageList implements OnInit, OnDestroy {

  public error: String = '';
  displayDialog: boolean;
  packages: Package[] = [];
  cols: any[];

  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;

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
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'discount', header: 'Discount', headerKey: 'COMMON.DISCOUNT' },
            { field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string' }
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
