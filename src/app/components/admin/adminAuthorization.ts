import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Patient,  } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { RoleDetails } from '../authorization/roleDetails';
import { RoleList } from '../authorization/roleList';
import { ResourceDetails } from '../authorization/resourceDetails';
import { ResourceList } from '../authorization/resourceList';
import { MenuItemDetails } from '../authorization/menuItemDetails';
import { MenuItemList } from '../authorization/menuItemList';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-authorization',
  templateUrl: '../../pages/admin/adminAuthorization.html',
  providers: [ ]
})
export class AdminAuthorization extends BaseComponent implements OnInit {
  [x: string]: any;

  @ViewChild(RoleDetails, {static: false}) roleDetails: RoleDetails;
  @ViewChild(RoleList, {static: false}) roleList: RoleList;
  @ViewChild(ResourceDetails, {static: false}) resourceDetails: ResourceDetails;
  @ViewChild(ResourceList, {static: false}) resourceList: ResourceList;
  @ViewChild(MenuItemDetails, {static: false}) menuItemDetails: MenuItemDetails;
  @ViewChild(MenuItemList, {static: false}) menuItemList: MenuItemList;
  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  constructor (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    private globalEventsManager: GlobalEventsManager,
    public tokenStorage: TokenStorage
  ) {
    super(genericService, translate, confirmationService, tokenStorage);
    this.user = new User();
    this.patient = new Patient();
  }
  
  
  ngOnInit() {
    this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId);
    this.globalEventsManager.selectedParentId = 2;
    
    if (this.currentUser == null) {
      this.currentUser = new User();
    }
    
  }

  onRoleSelected($event) {
    const roleId = $event;
    this.roleDetails.getRole(roleId);
  }

  onRoleSaved($event) {
	  this.roleList.updateTable($event);
  }
  
  onResourceSelected($event) {
    const resourceId = $event;
    this.resourceDetails.getResource(resourceId);
  }

  onResourceSaved($event) {
	  this.resourceList.updateTable($event);
  }

  onMenuItemSelected($event) {
    const menuItemId = $event;
    this.menuItemDetails.getMenuItem(menuItemId);
  }

  onMenuItemSaved($event) {
	  this.menuItemList.updateTable($event);
  }

  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index === 0) {
      this.activeTab = 0;
    } else if (evt.index === 1) {
      this.activeTab = 1;
    }
  }

  
}
