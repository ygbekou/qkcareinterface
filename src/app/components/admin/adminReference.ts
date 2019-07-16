import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { Patient, User, UserGroup } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from '../../app.constants';
import { GenericService, GlobalEventsManager } from '../../services';
import { CategoryDropdown } from '../dropdowns';
import { HospitalLocationDetails } from './hospitalLocationDetails';
import { HospitalLocationList } from './hospitalLocationList';
import { LabTestDetails } from './labTestDetails';
import { LabTestList } from './labTestList';
import { MedicineDetails } from './medicineDetails';
import { ReferenceDetails } from './referenceDetails';
import { ReferenceList } from './referenceList';
import { ReferenceWithCategoryDetails } from './referenceWithCategoryDetails';
import { ReferenceWithCategoryList } from './referenceWithCategoryList';
import { DepartmentDetails } from './departmentDetails';
import { DepartmentList } from './departmentList';
import { MedicineList } from './medicineList';

@Component({
  selector: 'app-admin-reference',
  templateUrl: '../../pages/admin/adminReference.html',
  providers: [GenericService ]
})
// tslint:disable-next-line:component-class-suffix
export class AdminReference implements OnInit, OnDestroy {
  [x: string]: any;

  @ViewChild(DepartmentDetails) departmentDetails: DepartmentDetails;
  @ViewChild(DepartmentList) departmentList: DepartmentList;
  @ViewChild(ReferenceDetails) referenceDetails: ReferenceDetails;
  @ViewChild(ReferenceList) referenceList: ReferenceList;
  @ViewChild(ReferenceWithCategoryDetails) referenceWithCategoryDetails: ReferenceWithCategoryDetails;
  @ViewChild(ReferenceWithCategoryList) referenceWithCategoryList: ReferenceWithCategoryList;
  @ViewChild(MedicineDetails) medicineDetails: MedicineDetails;
  @ViewChild(MedicineList) medicineList: MedicineList;
  @ViewChild(LabTestDetails) labTestDetails: LabTestDetails;
  @ViewChild(LabTestList) labTestList: LabTestList;
  @ViewChild(HospitalLocationDetails) hospitalLocationDetails: HospitalLocationDetails;
  @ViewChild(HospitalLocationList) hospitalLocationtList: HospitalLocationList;

  public user: User;
  public patient: Patient;
  public activeTab = 0;
  currentUser: User = JSON.parse(Cookie.get('user'));

  ABSENCES: string = Constants.ABSENCES;
  constructor (
    private genericService: GenericService,
    private globalEventsManager: GlobalEventsManager,
    private categoryDropdown: CategoryDropdown,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    this.user = new User();
    this.patient = new Patient();
  }


  ngOnInit() {
    this.globalEventsManager.currentPatientId.subscribe(patientId => this.patient.id = patientId);
    this.globalEventsManager.selectedParentId = 3;

    if (this.currentUser == null) {
      this.currentUser = new User();
    }
    this.globalEventsManager.selectedReferenceType = 'Category';

    setTimeout(() => {
        this.referenceList.updateCols('SYMPTOM_GROUP');
      }, 0);

  }

  ngOnDestroy () {
    this.departmentDetails = null;
    this.departmentList = null;
    this.referenceDetails = null;
    this.referenceList = null;
    this.referenceWithCategoryDetails = null;
    this.referenceWithCategoryList = null;
    this.medicineDetails = null;
    this.labTestDetails = null;
    this.labTestList = null;
    this.hospitalLocationDetails = null;
    this.hospitalLocationtList = null;
  }

  onDepartmentSelected($event) {
    const departmentId = $event;
    this.departmentDetails.getDepartment(departmentId);
  }

  onDepartmentSaved($event) {
	this.departmentList.updateTable($event);
  }

  onReferenceSelected($event, referenceType) {
    const referenceId = $event;
    this.referenceDetails.getReference(referenceId, referenceType);
  }

  onReferenceSaved($event) {
	this.referenceList.updateTable($event);
  }

   onReferenceWithCategorySelected($event, referenceWithCategoryType) {
    const referenceWithCategoryId = $event;
    this.referenceWithCategoryDetails.getReferenceWithCategory(referenceWithCategoryId, referenceWithCategoryType);
  }

  onReferenceWithCategorySaved($event) {
	this.referenceWithCategoryList.updateTable($event);
  }

  onMedicineSelected($event) {
    const medicineId = $event;
    this.medicineDetails.getMedicine(medicineId);
  }

  onLabTestSelected($event) {
    const labTestId = $event;
    this.labTestDetails.getLabTest(labTestId);
  }

  onHospitalLocationSelected($event) {
    const hospitalLocationId = $event;
    this.hospitalLocationDetails.getHospitalLocation(hospitalLocationId);
  }

  onTabChange(evt) {
	this.activeTab = evt.index;
    setTimeout(() => {
		console.log(this.activeTab);
        if (evt.index === 0) { 
		  	this.processReference(Constants.CATEGORY_SYMPTOM, 'Category', 'SYMPTOM_GROUP');
        } else if (evt.index === 1) {
			this.processReferenceWithCategory(Constants.CATEGORY_SYMPTOM, 'Symptom', 'SYMPTOM');
        } else if (evt.index === 2) {
			this.processReference(Constants.CATEGORY_ALLERGY, 'Category', 'ALLERGY_TYPE');
        } else if (evt.index === 3) {
			this.processReferenceWithCategory(Constants.CATEGORY_ALLERGY, 'Allergy', 'ALLERGY');
        } else if (evt.index === 4) {
          	this.processReference(null, 'Vaccine', 'VACCINE');
        } else if (evt.index === 5) {
			this.processReference(null, 'MedicalHistory', 'MEDICAL_HISTORY');
        }  else if (evt.index === 6) {
          	this.processReference(null, 'SocialHistory', 'SOCIAL_HISTORY');
        } else if (evt.index === 7) {
			this.processReference(null, 'PayerType', 'PAYER_TYPE');
        } else if (evt.index === 8) {
			this.processReference(null, 'DoctorOrderType', 'DOCTOR_ORDER_TYPE');
        } else if (evt.index === 9) {
			this.processReference(null, 'DoctorOrderPriority', 'DOCTOR_ORDER_PRIORITY');
        } else if (evt.index === 10) {
			this.processReference(null, 'DoctorOrderKind', 'DOCTOR_ORDER_KIND');
        } else if (evt.index === 11) {
          // this.globalEventsManager.selectedReferenceType = 'Department';
          // this.referenceList.updateCols('DEPARTMENT');
        } else if (evt.index === 12) {
          this.globalEventsManager.selectedParentId = Constants.CATEGORY_MEDICINE;
          this.globalEventsManager.selectedReferenceType = 'Category';
          this.referenceDetails.parentId = Constants.CATEGORY_MEDICINE;
          this.referenceList.updateCols('MANUFACTURER');
        } else if (evt.index === 13) {
          this.globalEventsManager.selectedParentId = Constants.CATEGORY_MEDICINE;
          this.categoryDropdown.getAllCategories(Constants.CATEGORY_MEDICINE);
          this.referenceList.updateCols('MEDICINE_TYPE');
        } else if (evt.index === 14) {
          this.globalEventsManager.selectedParentId = Constants.CATEGORY_MEDICINE;
          this.globalEventsManager.selectedReferenceWithCategoryType = 'Product';
		  this.categoryDropdown.getAllCategories(Constants.CATEGORY_MEDICINE);
		  
        } else if (evt.index === 15) {
          this.globalEventsManager.selectedParentId = Constants.CATEGORY_SERVICE_TARIF;
          this.globalEventsManager.selectedReferenceType = 'Category';
          this.referenceDetails.parentId = Constants.CATEGORY_MEDICINE;
          this.referenceList.updateCols('SERVICE');
        } else if (evt.index === 16) {
          this.globalEventsManager.selectedReferenceType = 'LabTestMethod';
          this.referenceList.updateCols('LAB_TEST_METHOD');
        } else if (evt.index === 17) {
          this.globalEventsManager.selectedReferenceType = 'LabTestUnit';
          this.referenceList.updateCols('LAB_TEST_UNIT');
        } else if (evt.index === 18) {
          this.labTestList.getAllLabTests();
        } else if (evt.index === 19) {
          this.hospitalLocationtList.getAllHospitalLocations();
        } else if (evt.index === 20) {
        }

     }, 0);
  }


  processReference(categoryNumber: number, referenceType: string, listLabel: string) {
	this.globalEventsManager.selectedParentId = categoryNumber;
	this.globalEventsManager.selectedReferenceType = referenceType;
	this.referenceList.updateCols(listLabel);
	this.referenceList.ngOnInit();
  }


  processReferenceWithCategory(categoryNumber: number, referenceType: string, listLabel: string) {
	this.globalEventsManager.selectedParentId = categoryNumber;
	this.globalEventsManager.selectedReferenceWithCategoryType = referenceType;
	this.categoryDropdown.getAllCategories(categoryNumber);
	this.referenceWithCategoryList.updateCols(listLabel);
	this.referenceWithCategoryList.getAll();
  }

}
