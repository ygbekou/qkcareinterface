import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Employee } from '../../models/employee';
import { UserGroup } from '../../models/userGroup';
import { UserGroupDropdown, CountryDropdown, DepartmentDropdown } from '../dropdowns';
import { User } from '../../models/user';
import { GenericService, UserService, GlobalEventsManager, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-employee-details',
  templateUrl: '../../pages/admin/employeeDetails.html',
  providers: [GenericService, UserService, UserGroupDropdown, CountryDropdown, DepartmentDropdown]
})
// tslint:disable-next-line:component-class-suffix
export class EmployeeDetails extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('picture', {static: false}) picture: ElementRef;
  formData = new FormData();

  public error: String = '';
  displayDialog: boolean;
  employee: Employee = new Employee();
  messages: Message[] = [];
  pictureUrl: any = '';
  constructor
    (
      public genericService: GenericService,
      private userService: UserService,
	    public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      public globalEventsManager: GlobalEventsManager,
      public countryDropdown: CountryDropdown,
      public departmentDropdown: DepartmentDropdown,
      public userGroupDropdown: UserGroupDropdown,
      private route: ActivatedRoute,
  ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.employee.user = new User();
  }

  ngOnInit(): void {

    let employeeId = null;
    this.route
      .queryParams
      .subscribe(params => {

        this.employee.user = new User();
        this.employee.user.userGroup = new UserGroup();
        employeeId = params['employeeId'];

        if (employeeId != null) {
          this.genericService.getOne(employeeId, 'Employee')
            .subscribe(result => {
              if (result.id > 0) {
                this.employee = result;
                if (this.employee.user.birthDate != null) {
                  this.employee.user.birthDate = new Date(this.employee.user.birthDate);
                }
              } else {
                this.error = Constants.SAVE_UNSUCCESSFUL;
                this.displayDialog = true;
              }
            });
        } else {
        }
      });

  }

  ngOnDestroy() {
    this.employee = null;
  }

  save() {
    this.messages = [];
    this.formData = new FormData();
    let inputEl;
    if (this.picture) {
      inputEl = this.picture.nativeElement;

      if (inputEl && inputEl.files && (inputEl.files.length > 0)) {
        const files: FileList = inputEl.files;
        for (let i = 0; i < files.length; i++) {
          this.formData.append('file', files[i], files[i].name);
        }
      } else {
        //this.formData.append('file', null, null);
      }
    }

    try {
      this.error = '';
      if (inputEl && inputEl.files && (inputEl.files.length > 0)) {
        this.userService.saveUserWithPicture('Employee', this.employee, this.formData)
          .subscribe(result => {
            this.processResult(result, this.employee, this.messages, this.pictureUrl);
          });
      } else {
        this.userService.saveUserWithoutPicture('Employee', this.employee)
          .subscribe(result => {
            this.processResult(result, this.employee, this.messages, this.pictureUrl);
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  clear() {
    this.employee = new Employee();
  }

  delete() {
    alert('To Do');
  }

  getEmployee(employeeId: number) {
    this.messages = [];
    this.genericService.getOne(employeeId, 'Employee')
      .subscribe(result => {
        if (result.id > 0) {
          this.employee = result;
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages.push({
              severity:
                Constants.ERROR, summary:
                res['COMMON.READ'], detail:
                res['MESSAGE.READ_FAILED']
            });
          });
        }
      });
  }

  readUrl(event: any) {

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (event1: ProgressEvent) => {
        this.pictureUrl = (<FileReader>event1.target).result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }

    this.employee.user.picture = '';
  }

  clearPictureFile() {
    this.employee.user.picture = '';
    this.pictureUrl = '';
    this.picture.nativeElement.value = '';
  }

}
