import { Component, OnInit, Input } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { User } from '../../models/user';
import { Constants } from '../../app.constants';
import { UserService } from '../../services/user.service';
import { GlobalEventsManager } from '../../services/globalEventsManager';
import { ActivatedRoute } from '@angular/router';
import { DoctorDropdown, DepartmentDropdown } from '../dropdowns';

@Component({
	selector: 'admin-appointment',
	templateUrl: '../../pages/admin/adminAppointment.html',
	providers: [Constants, UserService],
	styles: [` 
* { 
  margin: 0; 
  padding: 0; 
}`]
})
export class AdminAppointment implements OnInit {
	public loggedInUser: User;
	public user: User = new User();

	@Input() moduleName: string;

	constructor(
		public doctorDropdown: DoctorDropdown,
		public departmentDropdown: DepartmentDropdown,
		private route: ActivatedRoute,
		private globalEventsManager: GlobalEventsManager
	) {
		this.loggedInUser = JSON.parse(Cookie.get('user'));
		this.route
			.queryParams
			.subscribe(params => {
				this.moduleName = params['moduleName'];
				this.globalEventsManager.changeModuleName(params['moduleName']);
			});
	}

	ngOnInit() {
		this.loggedInUser = JSON.parse(Cookie.get('user'));

	}

	setModuleName(moduleName: string) {
		this.moduleName = moduleName;
	}

}
