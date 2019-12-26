import {Component, OnInit, ViewChild} from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {User} from '../../models/user';
import {Constants} from '../../app.constants';
import {GenericService} from '../../services/generic.service';
import {UserService} from '../../services/user.service';
import { AdminAppointment } from './adminAppointment';
import {CountryDropdown} from './../dropdowns/dropdown.country';
import {Router, NavigationExtras} from "@angular/router";
@Component({
  selector: 'admin-main',
  templateUrl: '../../pages/admin/adminMain.html',
  providers: [Constants, UserService, CountryDropdown],
  styles: [` 
* { 
  margin: 0; 
  padding: 0;
}`]
})
export class AdminMain implements OnInit {
  public loggedInUser: User;
  public user: User = new User();
  searchText: string;
  public users: User[];
  @ViewChild(AdminAppointment, {static: false}) adminAppointment: AdminAppointment;

  
  constructor(private baseService: GenericService, private userService: UserService,
    private router: Router,
    private cDropdown: CountryDropdown) {
    this.loggedInUser = JSON.parse(Cookie.get('user'));
    this.user.firstName = '';
    this.user.lastName = '';
    
  }
  
  ngOnInit() {
    this.loggedInUser = JSON.parse(Cookie.get('user'));
  }


  public navigate(moduleName, moduleLink) {
    
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "moduleName": moduleName,
        }
      }
      this.router.navigate([moduleLink], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }
}
