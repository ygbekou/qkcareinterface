import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Message, ConfirmationService } from 'primeng/api';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { Employee, User, SearchCriteria } from '../../models';
import { DepartmentDropdown } from '../dropdowns';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Constants } from 'src/app/app.constants';
import { BaseComponent } from './baseComponent';

@Component({
	selector: 'app-employee-list',
	templateUrl: '../../pages/admin/employeeList.html',
	providers: [GenericService, DepartmentDropdown]
})
export class EmployeeList extends BaseComponent implements OnInit, OnDestroy {

	messages: Message[] = [];
	employees: Employee[] = [];
	cols: any[];
	searchCriteria: SearchCriteria = new SearchCriteria();

	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService,
    		public tokenStorage: TokenStorage,
			public globalEventsManager: GlobalEventsManager,
			public departmentDropdown: DepartmentDropdown,
			private router: Router,
	) {

		super(genericService, translate, confirmationService, tokenStorage);
	}

	ngOnInit(): void {
		this.cols = [
			{
				field: 'lastName', header: 'Last Name', headerKey: 'COMMON.LAST_NAME', type: 'user',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'firstName', header: 'First Name', headerKey: 'COMMON.FIRST_NAME', type: 'user',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'departmentName', header: 'Department', headerKey: 'COMMON.DEPARTMENT', type: 'department',
				style: { width: '10%', 'text-align': 'center' }
			},
			{
				field: 'groupName', header: 'Role', headerKey: 'COMMON.ROLE',
				style: { width: '10%', 'text-align': 'center' }
			},
			{
				field: 'email', header: 'Email', headerKey: 'COMMON.E_MAIL', type: 'user',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'homePhone', header: 'Phone', headerKey: 'COMMON.PHONE',
				style: { width: '15%', 'text-align': 'center' }
			},
			{
				field: 'sex', header: 'Gender', headerKey: 'COMMON.GENDER', type: 'user',
				style: { width: '5%', 'text-align': 'center' }
			},
			{
				field: 'status', header: 'Status', headerKey: 'COMMON.STATUS', type: 'string',
				style: { width: '5%', 'text-align': 'center' }
			}
		];

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
		this.employees = null;
	}

	edit(employeeId: number) {
		try {
			const navigationExtras: NavigationExtras = {
				queryParams: {
					'employeeId': employeeId,
				}
			};
			this.router.navigate(['/admin/employeeDetails'], navigationExtras);
		} catch (e) {
			console.log(e);
		}
	}

	delete(employeeId: number) {
		try {
			const navigationExtras: NavigationExtras = {
				queryParams: {
					'employeeId': employeeId,
				}
			};
			this.router.navigate(['/admin/employeeDetails'], navigationExtras);
		} catch (e) {
			console.log(e);
		}
	}

	search() {

		const parameters: string[] = [];

		if (this.searchCriteria.lastName != null && this.searchCriteria.lastName.length > 0) {
			parameters.push('e.user.lastName like |lastName|' + '%' + this.searchCriteria.lastName + '%' + '|String');
		}
		if (this.searchCriteria.firstName != null && this.searchCriteria.firstName.length > 0) {
			parameters.push('e.user.firstName like |firstName|' + '%' + this.searchCriteria.firstName + '%' + '|String');
		}
		if (this.searchCriteria.department != null && this.searchCriteria.department.id > 0) {
			parameters.push('e.department.id = |departmentId|' + this.searchCriteria.department.id + '|Long');
		}

		if (parameters.length === 0) {
			this.translate.get(['MESSAGE.NO_CRITERIA_SET', 'COMMON.SEARCH']).subscribe(res => {
				this.messages.push({
					severity: Constants.ERROR, summary: res['COMMON.SEARCH'],
					detail: res['MESSAGE.NO_CRITERIA_SET']
				});
			});
			this.employees = [];
			return false;
		}

		this.genericService.getAllByCriteria('Employee', parameters)
			.subscribe((data: Employee[]) => {
				this.employees = data;
			},
				error => console.log(error),
				() => console.log('Get all Employees complete'));
	}

	getStatusDesc(employee: Employee): string {
		let statusDesc = '';
		if (employee.status === 0) {
			statusDesc = 'Actif';
		} else if (employee.status === 1) {
			statusDesc = 'Inactif';
		}
		return statusDesc;
	}
}
