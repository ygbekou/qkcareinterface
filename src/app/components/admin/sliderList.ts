import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Slider } from '../../models/website';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-slider-list',
  templateUrl: '../../pages/admin/sliderList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class SliderList implements OnInit, OnDestroy {

  sliders: Slider[] = [];
  cols: any[];

  @Output() sliderIdEvent = new EventEmitter<string>();


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
