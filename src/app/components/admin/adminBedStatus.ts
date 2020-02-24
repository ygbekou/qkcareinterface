import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Patient,  } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { BedDetails } from './bedDetails';
import { FloorDetails } from './floorDetails';
import { ReferenceDetails } from './referenceDetails';
import { ReferenceList } from './referenceList';
import { RoomDetails } from './roomDetails';
import { Constants } from '../../app.constants';
import { FloorList } from './floorList';
import { RoomList } from './roomList';
import { BedList } from './bedList';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-bed-status',
  templateUrl: '../../pages/admin/adminBedStatus.html',
  providers: [ ]
})
export class AdminBedStatus extends BaseComponent implements OnInit {
  [x: string]: any;

  @ViewChild(ReferenceDetails, {static: false}) referenceDetails: ReferenceDetails;
  @ViewChild(ReferenceList, {static: false}) referenceList: ReferenceList;
  @ViewChild(FloorDetails, {static: false}) floorDetails: FloorDetails;
  @ViewChild(FloorList, {static: false}) floorList: FloorList;
  @ViewChild(RoomDetails, {static: false}) roomDetails: RoomDetails;
  @ViewChild(RoomList, {static: false}) roomList: RoomList;
  @ViewChild(BedDetails, {static: false}) bedDetails: BedDetails;
  @ViewChild(BedList, {static: false}) bedList: BedList;
  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  ABSENCES: string = Constants.ABSENCES;
  constructor (
    public genericService: GenericService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    public confirmationService: ConfirmationService, 
    private globalEventsManager: GlobalEventsManager
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
    this.processReference(null, 'Ward', 'WARD');
    
  }

  onReferenceSelected($event, referenceType) {
    const referenceId = $event;
    this.referenceDetails.getReference(referenceId, referenceType);
  }
  onReferenceSaved($event) {
	this.referenceList.updateTable($event);
  }

  onFloorSelected($event) {
    const floorId = $event;
    this.floorDetails.getFloor(floorId);
  }
  onFloorSaved($event) {
	this.floorList.updateTable($event);
  }

  onRoomSelected($event) {
    const roomId = $event;
    this.roomDetails.getRoom(roomId);
  }
  onRoomSaved($event) {
	this.roomList.updateTable($event);
  }

  onBedSelected($event) {
    const bedId = $event;
    this.bedDetails.getBed(bedId);
  }
  onBedSaved($event) {
	this.bedList.updateTable($event);
  }
  
  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index === 0) {
      this.processReference(null, 'Ward', 'WARD');
    } else if (evt.index === 1) {
      this.processReference(Constants.CATEGORY_BED, 'Category', 'BED_CATEGORY');
    } else if (evt.index === 2) {
      this.processReference(null, 'Building', 'BUILDING');
    } else if (evt.index === 3) {
      this.activeTab = 3;
    } else if (evt.index === 4) {
      this.activeTab = 4;
    } else if (evt.index === 5) {
      this.activeTab = 5;
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
