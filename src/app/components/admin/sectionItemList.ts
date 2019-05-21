import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SectionItem } from '../../models/website';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-sectionItem-list',
  templateUrl: '../../pages/admin/sectionItemList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class SectionItemList implements OnInit, OnDestroy {

  sectionItems: SectionItem[] = [];
  cols: any[];

  @Output() sectionItemIdEvent = new EventEmitter<string>();

  SECTIONITEM_LIST_LABEL: string;
  SECTIONITEM_LIST: string;

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
      { field: 'sectionName', header: 'Section', headerKey: 'COMMON.SECTION' },
      { field: 'title', header: 'Title', headerKey: 'COMMON.TITLE' },
      { field: 'picture', header: 'Picture', headerKey: 'COMMON.PICTURE' },
      { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' }
    ];

    this.route
      .queryParams
      .subscribe(params => {

        const parameters: string[] = [];

        this.genericService.getAllByCriteria('com.qkcare.model.website.SectionItem', parameters)
          .subscribe((data: SectionItem[]) => {
            this.sectionItems = data;
          },
            error => console.log(error),
            () => console.log('Get all SectionItem complete'));
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

  updateTable(aSection: SectionItem) {
    let found = false;
    for (const aSec of this.sectionItems) {
      if (aSec.id === aSection.id) {
        this.sectionItems[this.sectionItems.indexOf(aSec)] = aSection;
        found = true;
        break;
      }
    }
    if (!found) {
      this.sectionItems.push(aSection);
    }
    var onTheFly: SectionItem[] = [];
    onTheFly.push(...this.sectionItems);
    this.sectionItems = onTheFly;
    //this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.sectionItems = null;
  }

  edit(sectionItemId: number) {
    this.sectionItemIdEvent.emit(sectionItemId + '');
  }

  delete(sectionItemId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'sectionItemId': sectionItemId,
        }
      };
      // tslint:disable-next-line:quotemark
      this.router.navigate(["/admin/sectionItemDetails"], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }

}
