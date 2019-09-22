import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Patient,  } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager } from '../../services';
import { RoleDetails } from '../authorization/roleDetails';
import { RoleList } from '../authorization/roleList';
import { ResourceDetails } from '../authorization/resourceDetails';
import { ResourceList } from '../authorization/resourceList';
import { MenuItemDetails } from '../authorization/menuItemDetails';
import { MenuItemList } from '../authorization/menuItemList';

@Component({
  selector: 'app-admin-authorization',
  templateUrl: '../../pages/admin/adminAuthorization.html',
  providers: [GenericService ]
})
export class AdminAuthorization implements OnInit {
  [x: string]: any;

  @ViewChild(RoleDetails) roleDetails: RoleDetails;
  @ViewChild(RoleList) roleList: RoleList;
  @ViewChild(ResourceDetails) resourceDetails: ResourceDetails;
  @ViewChild(ResourceList) resourceList: ResourceList;
  @ViewChild(MenuItemDetails) menuItemDetails: MenuItemDetails;
  @ViewChild(MenuItemList) menuItemList: MenuItemList;
  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  pageAccessResources = ['roles', 'resources'];

  constructor (
    private genericService: GenericService,
    private globalEventsManager: GlobalEventsManager
  ) {
    
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

  checkPermission(resource: string) {
    //return this.pageAccessResources.findIndex(x => x === resource) !== -1;
    return true; 
  }

}
