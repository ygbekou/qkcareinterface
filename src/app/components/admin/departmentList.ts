import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Department } from '../../models';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { GenericService, GlobalEventsManager } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-department-list',
  templateUrl: '../../pages/admin/departmentList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class DepartmentList implements OnInit, OnDestroy {

  departments: Department[] = [];
  cols: any[];

  @Output() departmentIdEvent = new EventEmitter<string>();

  DEPARTMENT_LIST_LABEL: string;
  DEPARTMENT_LIST: string;

  constructor
    (
    private genericService: GenericService,
    private translate: TranslateService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit(): void {

    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME' },
            { field: 'title', header: 'Title', headerKey: 'COMMON.TITLE' },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION' },
            { field: 'picture', header: 'Picture', headerKey: 'COMMON.PICTURE' },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS' }
        ];

    this.route
        .queryParams
        .subscribe(params => {

          const parameters: string [] = [];

          this.genericService.getAllByCriteria('Department', parameters)
            .subscribe((data: Department[]) =>     {
              this.departments = data;
            },
            error => console.log(error),
            () => console.log('Get all Department complete'));
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
    this.departments = null;
  }

  edit(departmentId: number) {
      this.departmentIdEvent.emit(departmentId + '');
  }

  delete(departmentId: number) {
      
  }

 }
