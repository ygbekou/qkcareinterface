import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Department } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { GenericService } from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-department-list',
  templateUrl: '../../pages/admin/departmentList.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class DepartmentList extends BaseComponent implements OnInit, OnDestroy {

  departments: Department[] = [];
  cols: any[];

  @Output() departmentIdEvent = new EventEmitter<string>();

  constructor
    (
    public genericService: GenericService,
	public translate: TranslateService,
	public confirmationService: ConfirmationService,
    private route: ActivatedRoute
    ) {
	  super(genericService, translate, confirmationService);
  }

  ngOnInit(): void {

    this.cols = [
            { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', type: 'string',
                                        style: {width: '30%', 'text-align': 'center'} },
            { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', type: 'string',
                                        style: {width: '50%', 'text-align': 'center'} },
            { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
                                        style: {width: '10%', 'text-align': 'center'} }
        ];

    this.route
        .queryParams
        .subscribe(() => {

          const parameters: string [] = [];

          this.genericService.getAllByCriteria('Department', parameters)
            .subscribe((data: Department[]) =>     {
              this.departments = data;
            },
            error => console.log(error),
            () => console.log('Get all Department complete'));
     });

    this.updateCols();
    this.translate.onLangChange.subscribe(() => {
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

  updateTable(department: Department) {
		const index = this.departments.findIndex(x => x.id === department.id);

		if (index === -1) {
			this.departments.push(department);
		} else {
			this.departments[index] = department;
		}
  }

 }
