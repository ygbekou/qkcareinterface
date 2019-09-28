import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Constants} from '../../app.constants';
import {Bed, BedAssignment, DoctorAssignment, Employee, Floor, 
  Patient, Admission, Reference, Room, User} from '../../models';
import {
  DoctorDropdown, PackageDropdown, InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown,
  CategoryDropdown, BedDropdown
} from '../dropdowns';
import {GenericService, GlobalEventsManager, AdmissionService, TokenStorage} from '../../services';
import { TranslateService} from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-admission-transfer',
  templateUrl: '../../pages/admin/admissionTransfer.html',
  providers: [GenericService, AdmissionService, DoctorDropdown, PackageDropdown,
    InsuranceDropdown, BuildingDropdown, FloorDropdown, RoomDropdown, CategoryDropdown, BedDropdown]
})
export class AdmissionTransfer extends BaseComponent implements OnInit, OnDestroy {

  admission: Admission = new Admission();

  transferType: string;
  messages: Message[] = [];


  constructor
    (
    public genericService: GenericService,
    private admissionService: AdmissionService,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    public confirmationService: ConfirmationService, 
    private globalEventsManager: GlobalEventsManager,
    private doctorDropdown: DoctorDropdown,
    private buildingDropdown: BuildingDropdown,
    private floorDropdown: FloorDropdown,
    private roomDropdown: RoomDropdown,
    private categoryDropdown: CategoryDropdown,
    private bedDropdown: BedDropdown,
    private route: ActivatedRoute,
    private router: Router
    ) {
      super(genericService, translate, confirmationService, tokenStorage);
      this.initilizePatientAdmission();
      this.initTansferBedData();
      this.categoryDropdown.getAllCategories(Constants.CATEGORY_BED);
  }

  initilizePatientAdmission() {
    this.admission.patient = new Patient();
    this.admission.patient.user = new User();

    this.admission.bedAssignment = new BedAssignment();
    this.admission.bedAssignment.bed = new Bed();
    this.admission.bedAssignment.bed.room = new Room();
    this.admission.bedAssignment.bed.room.floor = new Floor();
    this.admission.bedAssignment.bed.room.floor.building = new Reference();
    this.admission.bedAssignment.bed.category = new Reference();

    this.admission.doctorAssignment = new DoctorAssignment();
    this.admission.doctorAssignment.doctor = new Employee();

  }

  initTansferBedData() {
    this.admission.bedAssignment.transferBed = new Bed();
    this.admission.bedAssignment.transferBed.room = new Room();
    this.admission.bedAssignment.transferBed.room.floor = new Floor();
    this.admission.bedAssignment.transferBed.room.floor.building = new Reference();
    this.admission.bedAssignment.transferBed.category = new Reference();
  }

  ngOnInit(): void {
    this.transferType = 'BED';
  }

  ngOnDestroy() {
    this.admission = null;
  }

  transfer() {
    if (this.transferType === 'DOCTOR') {
      this.transferDoctor();
    } else if (this.transferType === 'BED') {
      this.transferBed();
    }
  }


  transferDoctor() {

    try {
      if (this.validateDoctorTransfer()) {
        this.admissionService.transferDoctor(this.admission.doctorAssignment)
          .subscribe(result => {
            if (result.id > 0) {
              this.admission.doctorAssignment = result;
               this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
               this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  transferBed() {

    try {
      if (this.validateBedTransfer()) {
        this.admissionService.transferBed(this.admission.bedAssignment)
          .subscribe(result => {
            if (result.id > 0) {
              this.admission.bedAssignment = result;
               this.messages.push({severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL});
            } else {
               this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_UNSUCCESSFUL});
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  validateDoctorTransfer() {
    this.messages = [];
    if (this.admission.doctorAssignment.transferDoctor != null
      && this.admission.doctorAssignment.doctor.id
      === this.admission.doctorAssignment.transferDoctor.id) {
        this.translate.get('MESSAGE.TRANFER_DOCTOR_FAILED').subscribe((res: string) => {
           this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: res});
        });
      return false;
    }
    if (this.admission.doctorAssignment.transferDate != null
      && this.admission.doctorAssignment.transferDate
      < this.admission.doctorAssignment.startDate) {
      this.translate.get('MESSAGE.TRANFER_DATE_FAILED').subscribe((res: string) => {
           this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: res});
        });
      return false;
    }

    return true;

  }

  validateBedTransfer() {
    this.messages = [];
    if (this.admission.bedAssignment.transferBed != null
      && this.admission.bedAssignment.bed.id
      === this.admission.bedAssignment.transferBed.id) {
       this.translate.get('MESSAGE.TRANFER_BED_FAILED').subscribe((res: string) => {
           this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: res});
        });
      return false;
    }
    if (this.admission.bedAssignment.transferDate != null
      && this.admission.bedAssignment.transferDate
      < this.admission.bedAssignment.startDate) {
      this.translate.get('MESSAGE.TRANFER_DATE_FAILED').subscribe((res: string) => {
           this.messages.push({severity: Constants.ERROR, summary: Constants.SAVE_LABEL, detail: res});
        });
      return false;
    }

    return true;

  }

  lookUpPatientAdmission() {
    const parameters: string[] = [];

    parameters.push('e.id = |patientAdmissionId|' + this.admission.admissionNumber + '|Long');
    const admissionNumber = this.admission.admissionNumber;
    this.admission = new Admission();
    this.initilizePatientAdmission();
    this.initTansferBedData();
    this.admission.admissionNumber = admissionNumber;

    this.admissionService.getAdmission(+this.admission.admissionNumber)
      .subscribe((data: Admission) => {
        if (data.id > 0) {
          this.admission = data;
          this.admission.doctorAssignment.startDate = new Date(this.admission.doctorAssignment.startDate);
          this.initTansferBedData();
        }
      },
      error => console.log(error),
      () => console.log('Get Patient Admission complete'));
  }

  populateFloorDropdown(event) {
    this.floorDropdown.buildingId = this.admission.bedAssignment.transferBed.room.floor.building.id;
    this.floorDropdown.getAllFloors();
  }

  populateRoomDropdown(event) {
    this.roomDropdown.floorId = this.admission.bedAssignment.transferBed.room.floor.id;
    this.roomDropdown.getAllRooms();
  }

  populateBedDropdown(event) {
    this.bedDropdown.roomId = this.admission.bedAssignment.transferBed.room.id;
    this.bedDropdown.categoryId = this.admission.bedAssignment.transferBed.category.id;
    this.bedDropdown.getAllBeds();
  }

  onTabChange(evt) {
		if (evt.index === 0) {
			this.transferType = 'BED';
		} else if (evt.index === 1) {
			this.transferType = 'DOCTOR';
		} 
	}
}
