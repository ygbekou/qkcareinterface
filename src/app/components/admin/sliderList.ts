import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Slider } from '../../models/website';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-slider-list',
  templateUrl: '../../pages/admin/sliderList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class SliderList extends BaseComponent implements OnInit, OnDestroy {

  sliders: Slider[] = [];
  cols: any[];

  @Output() sliderIdEvent = new EventEmitter<string>();


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
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' }
        ];

    this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];

          this.genericService.getAllByCriteria('com.qkcare.model.website.Slider', parameters)
            .subscribe((data: Slider[]) => {
              this.sliders = data;
            },
            error => console.log(error),
            () => console.log('Get all Slider complete'));
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
    this.sliders = null;
  }

  edit(sliderId: number) {
      this.sliderIdEvent.emit(sliderId + '');
  }

  delete(sliderId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'sliderId': sliderId,
        }
      };
      this.router.navigate(['/admin/sliderDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

 }
