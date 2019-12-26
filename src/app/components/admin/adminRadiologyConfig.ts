import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Patient,  } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { RadExamDetails } from './radExamDetails';
import { ReferenceDetails } from './referenceDetails';
import { ReferenceList } from './referenceList';
import { Constants } from '../../app.constants';
import { RadExamList } from './radExamList';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-radiologyConfig',
  templateUrl: '../../pages/admin/adminRadiologyConfig.html',
  providers: [ ]
})
export class AdminRadiologyConfig extends BaseComponent implements OnInit {
  [x: string]: any;

  @ViewChild(ReferenceDetails, {static: false}) referenceDetails: ReferenceDetails;
  @ViewChild(ReferenceList, {static: false}) referenceList: ReferenceList;
  @ViewChild(RadExamDetails, {static: false}) radExamDetails: RadExamDetails;
  @ViewChild(RadExamList, {static: false}) radExamList: RadExamList;

  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  ABSENCES: string = Constants.ABSENCES;
  constructor (
    public genericService: GenericService,
    public translate: TranslateService,
    public confirmationService: ConfirmationService,
    public tokenStorage: TokenStorage,
    private globalEventsManager: GlobalEventsManager
  ) {
    super(genericService, translate, confirmationService, tokenStorage);
    this.user = new User();
    this.patient = new Patient();
  }
  
  
  ngOnInit() {
    this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId)
    this.globalEventsManager.selectedParentId = 2;
    
    if (this.currentUser == null) {
      this.currentUser = new User();
    }
    this.processReference(null, 'Modality', 'MODALITY');
    
  }

  onReferenceSelected($event, referenceType) {
    const referenceId = $event;
    this.referenceDetails.getReference(referenceId, 'com.qkcare.model.imaging.' + referenceType);
  }
  onReferenceSaved($event) {
	this.referenceList.updateTable($event);
  }

  onExamSelected($event) {
    const imagingId = $event;
    this.radExamDetails.getExam(imagingId);
  }
  onExamSaved($event) {
	this.radExamList.updateTable($event);
  }

  
  onTabChange(evt) {
    this.activeTab = evt.index;
    if (evt.index === 0) {
      this.processReference(null, 'Modality', 'MODALITY');
    } else if (evt.index === 1) {
      this.processReference(null, 'BodyPart', 'BODY_PART');
    } else if (evt.index === 2) {
      this.processReference(null, 'Laterality', 'LATERALITY');
    } else if (evt.index === 3) {
      this.activeTab = 3
    } else if (evt.index === 4) {
      this.activeTab = 4
    } else if (evt.index === 5) {
      this.activeTab = 5
    } 
  }

  processReference(categoryNumber: number, referenceType: string, listLabel: string) {
	this.globalEventsManager.selectedParentId = categoryNumber;
	this.globalEventsManager.selectedReferenceType = 'com.qkcare.model.imaging.' + referenceType;
	setTimeout(() => {
		this.referenceList.updateCols(listLabel);
	}, 0);
	this.referenceList.getAll();
  }

}
