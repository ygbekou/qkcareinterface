import { Component, OnInit, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { Patient, User } from '../../models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from '../../app.constants';
import { GenericService, GlobalEventsManager, TokenStorage } from '../../services';
import { CategoryDropdown } from '../dropdowns';
import { HospitalLocationDetails } from './hospitalLocationDetails';
import { HospitalLocationList } from './hospitalLocationList';
import { LabTestDetails } from './labTestDetails';
import { LabTestList } from './labTestList';
import { MedicineDetails } from './medicineDetails';
import { ReferenceDetails } from './referenceDetails';
import { ReferenceList } from './referenceList';
import { ReferenceWithChildList } from './referenceWithChildList';
import { ReferenceWithCategoryDetails } from './referenceWithCategoryDetails';
import { ReferenceWithCategoryList } from './referenceWithCategoryList';
import { DepartmentDetails } from './departmentDetails';
import { DepartmentList } from './departmentList';
import { MedicineList } from './medicineList';
import { BaseComponent } from './baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { SummaryTypeDetails } from './summaryTypeDetails';
import { SummaryTypeList } from './summaryTypeList';
import { PhysicalExamTypeAssignmentDetails } from './physicalExamTypeAssignmentDetails';
import { PhysicalExamTypeAssignmentList } from './physicalExamTypeAssignmentList';
import { SummaryTypeTemplateDetails } from './summaryTypeTemplateDetails';
import { SummaryTypeTemplateList } from './summaryTypeTemplateList';
import { SystemReviewQuestionAssignmentDetails } from './systemReviewQuestionAssignmentDetails';
import { SystemReviewQuestionAssignmentList } from './systemReviewQuestionAssignmentList';

@Component({
  selector: 'app-admin-reference',
  templateUrl: '../../pages/admin/adminReference.html',
  providers: [GenericService ]
})
// tslint:disable-next-line:component-class-suffix
export class AdminReference extends BaseComponent implements OnInit, OnDestroy {
  [x: string]: any;

  @ViewChild(DepartmentDetails, {static: false}) departmentDetails: DepartmentDetails;
  @ViewChild(DepartmentList, {static: false}) departmentList: DepartmentList;
  @ViewChild(ReferenceDetails, {static: false}) referenceDetails: ReferenceDetails;
  @ViewChild(ReferenceList, {static: false}) referenceList: ReferenceList;
  @ViewChild(ReferenceWithChildList, {static: false}) referenceWithChildList: ReferenceWithChildList;
  @ViewChild(ReferenceWithCategoryDetails, {static: false}) referenceWithCategoryDetails: ReferenceWithCategoryDetails;
  @ViewChild(ReferenceWithCategoryList, {static: false}) referenceWithCategoryList: ReferenceWithCategoryList;
  @ViewChild(MedicineDetails, {static: false}) medicineDetails: MedicineDetails;
  @ViewChild(MedicineList, {static: false}) medicineList: MedicineList;
  @ViewChild(LabTestDetails, {static: false}) labTestDetails: LabTestDetails;
  @ViewChild(LabTestList, {static: false}) labTestList: LabTestList;
  @ViewChild(HospitalLocationDetails, {static: false}) hospitalLocationDetails: HospitalLocationDetails;
  @ViewChild(HospitalLocationList, {static: false}) hospitalLocationtList: HospitalLocationList;
  @ViewChild(SummaryTypeDetails, {static: false}) summaryTypeDetails: SummaryTypeDetails;
  @ViewChild(SummaryTypeList, {static: false}) summaryTypeList: SummaryTypeList;
  @ViewChild(PhysicalExamTypeAssignmentDetails, {static: false}) physicalExamTypeAssignmentDetails: PhysicalExamTypeAssignmentDetails;
  @ViewChild(PhysicalExamTypeAssignmentList, {static: false}) physicalExamTypeAssignmentList: PhysicalExamTypeAssignmentList;
  @ViewChild(SummaryTypeTemplateDetails, {static: false}) summaryTypeTemplateDetails: SummaryTypeTemplateDetails;
  @ViewChild(SummaryTypeTemplateList, {static: false}) summaryTypeTemplateList: SummaryTypeTemplateList;
  @ViewChild(SystemReviewQuestionAssignmentDetails, {static: false}) 
          systemReviewQuestionAssignmentDetails: SystemReviewQuestionAssignmentDetails;
  @ViewChild(SystemReviewQuestionAssignmentList, {static: false}) 
          systemReviewQuestionAssignmentList: SystemReviewQuestionAssignmentList;
  

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
    private globalEventsManager: GlobalEventsManager,
    public categoryDropdown: CategoryDropdown
  ) {
    super(genericService, translate, confirmationService, tokenStorage);
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

  onMedicineSaved($event) {
	this.medicineList.updateTable($event);
  }

  onLabTestSelected($event) {
    const labTestId = $event;
    this.labTestDetails.getLabTest(labTestId);
  }

  onLabTestSaved($event) {
	this.labTestList.updateTable($event);
  }

  onHospitalLocationSelected($event) {
    const hospitalLocationId = $event;
    this.hospitalLocationDetails.getHospitalLocation(hospitalLocationId);
  }

  onHospitalLocationSaved($event) {
	this.hospitalLocationtList.updateTable($event);
  }

  onSummaryTypeSelected($event) {
    const summaryTypeId = $event;
    this.summaryTypeDetails.getSummaryType(summaryTypeId);
  }

  onSummaryTypeSaved($event) {
	  this.summaryTypeList.updateTable($event);
  }

  onPhysicalExamTypeAssignmentSelected($event) {
    const physicalExamTypeAssignmentId = $event;
    this.physicalExamTypeAssignmentDetails.getPhysicalExamTypeAssignment(physicalExamTypeAssignmentId);
  }

  onPhysicalExamTypeAssignmentSaved($event) {
	  this.physicalExamTypeAssignmentList.updateTable($event);
  }

  onSummaryTypeTemplateSelected($event) {
    const summaryTypeTemplateId = $event;
    this.summaryTypeTemplateDetails.getSummaryTypeTemplate(summaryTypeTemplateId);
  }

  onSummaryTypeTemplateSaved($event) {
	  this.summaryTypeTemplateList.updateTable($event);
  }

  onSystemReviewQuestionAssignmentSelected($event) {
    const systemReviewQuestionAssignmentId = $event;
    this.systemReviewQuestionAssignmentDetails.getSystemReviewQuestionAssignment(systemReviewQuestionAssignmentId);
  }

  onSystemReviewQuestionAssignmentSaved($event) {
	  this.systemReviewQuestionAssignmentList.updateTable($event);
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
          //  Do Nothing
    } else if (evt.index === 12) {
			this.processReference(null, 'Manufacturer', 'MANUFACTURER');
    } else if (evt.index === 13) {
      this.processReference(Constants.CATEGORY_MEDICINE, 'Category', 'MEDICINE_TYPE');
    } else if (evt.index === 14) {
			this.processReferenceWithCategory(Constants.CATEGORY_MEDICINE, 'Product', 'MEDICINE');
    } else if (evt.index === 15) {
			this.processReference(Constants.CATEGORY_SERVICE_TARIF, 'Category', 'TARIF');
    } else if (evt.index === 16) {
			this.processReference(null, 'LabTestMethod', 'LAB_TEST_METHOD');
    } else if (evt.index === 17) {
			this.processReference(null, 'LabTestUnit', 'LAB_TEST_UNIT');
    } else if (evt.index === 18) {
      this.labTestList.getAllLabTests();
    } else if (evt.index === 19) {
      this.hospitalLocationtList.getAllHospitalLocations();
    } else if (evt.index === 20) {
      this.summaryTypeList.getList();
    } else if (evt.index === 21) {
      this.processReferenceWithChild(null, 'PhysicalExamSystem', 'PE_SYSTEM_TYPE');
    } else if (evt.index === 22) {
      this.physicalExamTypeAssignmentList.getList();
    } else if (evt.index === 23) {
      
    } else if (evt.index === 24) {
      this.processReferenceWithChild(null, 'SystemReviewQuestion', 'SYSTEM_REVIEW_QUESTION');
    } else if (evt.index === 25) {
      this.onSystemReviewQuestionList.getList();
    }

     }, 0);
  }


  processReferenceWithChild(categoryNumber: number, referenceType: string, listLabel: string) {
    this.globalEventsManager.selectedParentId = categoryNumber;
    this.globalEventsManager.selectedReferenceType = referenceType;
    setTimeout(() => {
      this.referenceWithChildList.updateCols(listLabel);
    }, 0);
    this.referenceWithChildList.getAll();
  }

  processReference(categoryNumber: number, referenceType: string, listLabel: string) {
    this.globalEventsManager.selectedParentId = categoryNumber;
    this.globalEventsManager.selectedReferenceType = referenceType;
    setTimeout(() => {
      this.referenceList.updateCols(listLabel);
    }, 0);
    this.referenceList.getAll();
  }


  processReferenceWithCategory(categoryNumber: number, referenceType: string, listLabel: string) {
    this.globalEventsManager.selectedParentId = categoryNumber;
    this.globalEventsManager.selectedReferenceWithCategoryType = referenceType;
    this.categoryDropdown.getAllCategories(categoryNumber);
    this.referenceWithCategoryList.updateCols(listLabel);
    this.referenceWithCategoryList.getAll();
  }

}
