import { Component,LOCALE_ID,OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { User, Patient, UserGroup,  } from '../../models';
import { PatientDetails } from './patientDetails';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, UserService, GlobalEventsManager } from '../../services';
import { AppointmentDetails } from './appointmentDetails';
import { BedDetails } from './bedDetails';
import { FloorDetails } from './floorDetails';
import { ReferenceDetails } from './referenceDetails';
import { ReferenceList } from './referenceList';
import { RoomDetails } from './roomDetails';
import { Constants } from '../../app.constants';

@Component({
  selector: 'app-admin-bedStatus',
  templateUrl: '../../pages/admin/adminBedStatus.html',
  providers: [GenericService ]
})
export class AdminBedStatus implements OnInit {
  [x: string]: any;

  @ViewChild(ReferenceDetails) referenceDetails: ReferenceDetails;
  @ViewChild(FloorDetails) floorDetails: FloorDetails;
  @ViewChild(RoomDetails) roomDetails: RoomDetails;
  @ViewChild(BedDetails) bedDetails: BedDetails;
  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  ABSENCES: string = Constants.ABSENCES;
  constructor (
    private genericService: GenericService,
    private globalEventsManager: GlobalEventsManager,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    
    this.user = new User();
    this.patient = new Patient();
  }
  
  
  ngOnInit() {
    this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId)
    this.globalEventsManager.selectedParentId = 2;
    
    if (this.currentUser == null) {
      this.currentUser = new User();
    }
    this.globalEventsManager.selectedReferenceType = "Ward";
    
  }

  onReferenceSelected($event, referenceType) {
    let referenceId = $event;
    this.referenceDetails.getReference(referenceId, referenceType);
  }
  onFloorSelected($event) {
    let floorId = $event;
    this.floorDetails.getFloor(floorId);
  }
  onRoomSelected($event) {
    let roomId = $event;
    this.roomDetails.getRoom(roomId);
  }
  onBedSelected($event) {
    let bedId = $event;
    this.bedDetails.getBed(bedId);
  }
  
  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index == 0) {
      this.activeTab = 0
      this.globalEventsManager.selectedReferenceType = "Ward";
    } else if (evt.index == 1) {
      this.activeTab = 1
      this.globalEventsManager.selectedReferenceType = "Category";
      this.globalEventsManager.selectedParentId = Constants.CATEGORY_BED;
    } else if (evt.index == 2) {
      this.activeTab = 2
      this.globalEventsManager.selectedReferenceType = "Building";
    } else if (evt.index == 3) {
      this.activeTab = 3
    } else if (evt.index == 4) {
      this.activeTab = 4
    } else if (evt.index == 5) {
      this.activeTab = 5
    } 
  }


}
