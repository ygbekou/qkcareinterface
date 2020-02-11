import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Section } from '../../models/website';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-section-list',
  templateUrl: '../../pages/admin/sectionList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class SectionList extends BaseComponent implements OnInit, OnDestroy {

  sections: Section[] = [];
  cols: any[];

  @Output() sectionIdEvent = new EventEmitter<string>();

  SECTION_LIST_LABEL: string;
  SECTION_LIST: string;

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private globalEventsManager: GlobalEventsManager,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
  ) {
    super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {

    this.cols = [
      { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
      { field: 'title', header: 'Title', headerKey: 'COMMON.TITLE' },
      { field: 'language', header: 'Language', headerKey: 'COMMON.LANGUAGE' },
      { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' }
    ];

    this.route
      .queryParams
      .subscribe(params => {

        const parameters: string[] = [];

        this.genericService.getAllByCriteria('com.qkcare.model.website.Section', parameters)
          .subscribe((data: Section[]) => {
            this.sections = data;
          },
            error => console.log(error),
            () => console.log('Get all Section complete'));
      });


    this.updateCols();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateCols();
    });
  }

  getAll() {
    const parameters: string[] = [];
    this.genericService.getAllByCriteria('com.qkcare.model.website.Section', parameters)
      .subscribe((data: Section[]) => {
        this.sections = data;
      },
        error => console.log(error),
        () => console.log('Get all Section complete'));
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
    this.sections = null;
  }

  edit(sectionId: number) {
    this.sectionIdEvent.emit(sectionId + '');
  }

  delete(sectionId: number) {
    try {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          'sectionId': sectionId,
        }
      };
      this.router.navigate(['/admin/sectionDetails'], navigationExtras);
    } catch (e) {
      console.log(e);
    }
  }


  updateTable(aSection: Section) {
    let found = false; 
    for (const aSec of this.sections) { 
      if (aSec.id === aSection.id) {
        this.sections[this.sections.indexOf(aSec)] = aSection;
        found = true; 
        break;
      }
    }
    if (!found) {
      this.sections.push(aSection);
    }
    const onTheFly: Section[] = [];
    onTheFly.push(...this.sections);
    this.sections = onTheFly;
    this.changeDetectorRef.detectChanges();
  }
}
