import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Patient,  } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager } from '../../services';
import { RoleDetails } from '../authorization/roleDetails';
import { RoleList } from '../authorization/roleList';
import { ResourceDetails } from '../authorization/resourceDetails';
import { ResourceList } from '../authorization/resourceList';

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
  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

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

  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index === 0) {
      this.activeTab = 0;
    } else if (evt.index === 1) {
      this.activeTab = 1;
    }
  }

  processReference(categoryNumber: number, referenceType: string, listLabel: string) {
    this.globalEventsManager.selectedParentId = categoryNumber;
    this.globalEventsManager.selectedReferenceType = referenceType;
    setTimeout(() => {
      this.referenceList.updateCols(listLabel);
    }, 0);
    this.referenceList.getAll();
  }

}
