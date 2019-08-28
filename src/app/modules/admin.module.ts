import { TokenInterceptor } from '../app.interceptor';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AdminMain } from '../components/admin/adminMain';
import { AdminAppointment } from '../components/admin/adminAppointment';
import { DocumentDetails } from '../components/admin/documentDetails';
import { DocumentList } from '../components/admin/documentList';
import { ScheduleDetails } from '../components/admin/scheduleDetails';
import { ScheduleList } from '../components/admin/scheduleList';
import { AppointmentScheduler } from '../components/admin/appointmentScheduler';
import { AppointmentDetails } from '../components/admin/appointmentDetails';
import { AppointmentList } from '../components/admin/appointmentList';
import { EmployeeDetails } from '../components/admin/employeeDetails';
import { EmployeeList } from '../components/admin/employeeList';
import { AdminMenu } from '../components/menu/adminMenu';
import { CommonSharedModule } from './common.shared.module';
import { FileUploader } from '../components/admin/fileUploader';
import { PatientDetails } from '../components/admin/patientDetails';
import { PatientList } from '../components/admin/patientList';
import { CaseStudyDetails } from '../components/admin/caseStudyDetails';
import { CaseStudyList } from '../components/admin/caseStudyList';
import { ReferenceDetails } from '../components/admin/referenceDetails';
import { ReferenceList } from '../components/admin/referenceList';
import { ReferenceWithCategoryDetails } from '../components/admin/referenceWithCategoryDetails';
import { ReferenceWithCategoryList } from '../components/admin/referenceWithCategoryList';
import { MedicineDetails } from '../components/admin/medicineDetails';
import { MedicineList } from '../components/admin/medicineList';
import { PrescriptionDetails } from '../components/admin/prescriptionDetails';
import { PrescriptionList } from '../components/admin/prescriptionList';
import { AccountDetails } from '../components/admin/accountDetails';
import { AccountList } from '../components/admin/accountList';
import { InvoiceDetails } from '../components/admin/invoiceDetails';
import { InvoiceList } from '../components/admin/invoiceList';
import { PaymentDetails } from '../components/admin/paymentDetails';
import { PaymentList } from '../components/admin/paymentList';
import { InsuranceDetails } from '../components/admin/insuranceDetails';
import { InsuranceList } from '../components/admin/insuranceList';
import { PackageDetails } from '../components/admin/packageDetails';
import { PackageList } from '../components/admin/packageList';
import { ServiceDetails } from '../components/admin/serviceDetails';
import { ServiceList } from '../components/admin/serviceList';
import { BillDetails } from '../components/admin/billDetails';
import { BillList } from '../components/admin/billList';
import { VitalSignDetails } from '../components/admin/vitalSignDetails';
import { VitalSignList } from '../components/admin/vitalSignList';
import { DoctorOrderDetails } from '../components/admin/doctorOrderDetails';
import { DoctorOrderList } from '../components/admin/doctorOrderList';
import { AdmissionDetails } from '../components/admin/admissionDetails';
import { AdmissionList } from '../components/admin/admissionList';
import { BedTransfer } from '../components/admin/bedTransfer';
import { FloorDetails } from '../components/admin/floorDetails';
import { FloorList } from '../components/admin/floorList';
import { RoomDetails } from '../components/admin/roomDetails';
import { RoomList } from '../components/admin/roomList';
import { BedDetails } from '../components/admin/bedDetails';
import { BedList } from '../components/admin/bedList';
import { RadExamDetails } from '../components/admin/radExamDetails';
import { RadExamList } from '../components/admin/radExamList';
import { AdminBedStatus } from '../components/admin/adminBedStatus';
import { AdmissionDiagnoses } from '../components/admin/admissionDiagnoses';
import { PatientServiceDetails } from '../components/admin/patientServiceDetails';
import { AdminReference } from '../components/admin/adminReference';
import { CategoryDropdown, PackageDropdown, DoctorDropdown, ServiceDropdown, LabTestDropdown, 
			ProductDropdown, ModalityDropdown, RadExamDropdown, ExamStatusDropdown, RadiologyTechDropdown } from '../components/dropdowns';
import { AdminPatient } from '../components/admin/adminPatient';
import { VisitDetails } from '../components/admin/visitDetails';
import { VisitList } from '../components/admin/visitList';
import { AllergyDetails } from '../components/admin/allergyDetails';
import { SymptomDetails } from '../components/admin/symptomDetails';
import { MedicalHistoryDetails } from '../components/admin/medicalHistoryDetails';
import { SocialHistoryDetails } from '../components/admin/socialHistoryDetails';
import { VaccineDetails } from '../components/admin/vaccineDetails';
import { DischargeDetails } from '../components/admin/dischargeDetails';
import { LabTestDetails } from '../components/admin/labTestDetails';
import { LabTestList } from '../components/admin/labTestList';
import { InvestigationDetails } from '../components/admin/investigationDetails';
import { InvestigationList } from '../components/admin/investigationList';
import { RadInvestigationDetails } from '../components/admin/radInvestigationDetails';
import { RadInvestigationList } from '../components/admin/radInvestigationList';
import { PurchaseOrderDetails } from '../components/stocks/purchaseOrderDetails';
import { PurchaseOrderList } from '../components/stocks/purchaseOrderList';
import { ReceiveOrderDetails } from '../components/stocks/receiveOrderDetails';
import { ReceiveOrderList } from '../components/stocks/receiveOrderList';
import { PatientSaleDetails } from '../components/stocks/patientSaleDetails';
import { PatientSaleList } from '../components/stocks/patientSaleList';
import { SaleReturnDetails } from '../components/stocks/saleReturnDetails';
import { SaleReturnList } from '../components/stocks/saleReturnList';
import { BirthReportDetails } from '../components/activities/birthReportDetails';
import { BirthReportList } from '../components/activities/birthReportList';
import { DeathReportDetails } from '../components/activities/deathReportDetails';
import { DeathReportList } from '../components/activities/deathReportList';
import { HospitalLocationDetails } from '../components/admin/hospitalLocationDetails';
import { HospitalLocationList } from '../components/admin/hospitalLocationList';
import { HospitalDetails } from '../components/admin/hospitalDetails';
import { PatientLookup } from '../components/includes/patientLookup';
import { PatientSaleLookup } from '../components/includes/patientSaleLookup';
import { VisitAdmLookup } from '../components/includes/visitAdmLookup';
import { PurchaseOrderLookup } from '../components/includes/purchaseOrderLookup';
import { WaitingList } from '../components/admin/waitingList';
import { EnquiryDetails } from '../components/admin/enquiryDetails';
import { EnquiryList } from '../components/admin/enquiryList';
import { SearchComponent } from '../components/includes/search';
import { BillingService, VisitService, TokenStorage, LoggedInGuard } from '../services';
import { SectionDetails } from '../components/admin/sectionDetails';
import { SectionList } from '../components/admin/sectionList';
import { SectionItemDetails } from '../components/admin/sectionItemDetails';
import { SectionItemList } from '../components/admin/sectionItemList';
import { AdminWebsite } from '../components/admin/adminWebsite';
import { DepartmentDetails } from '../components/admin/departmentDetails';
import { DepartmentList } from '../components/admin/departmentList';
import { AdminHeader } from '../components/admin/adminHeader';
import { SliderDetails } from '../components/admin/sliderDetails';
import { SliderList } from '../components/admin/sliderList';
import { SliderTextList } from '../components/admin/sliderTextList';
import { SliderTextDetails } from '../components/admin/sliderTextDetails';
import { CompanyDetails } from '../components/admin/companyDetails';
import { CompanyList } from '../components/admin/companyList';
import { ContactDetails } from '../components/admin/contactDetails';
import { ContactList } from '../components/admin/contactList';
import { Dashboard } from '../components/admin/dashboard';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ConfirmationService } from 'primeng/api';
import { PatientMedicineList } from '../components/admin/patientMedicineList';
import { AdminRadiologyConfig } from '../components/admin/adminRadiologyConfig';
import { RadInvestigationService } from '../services';

const routes: Routes = [
  { path: 'adminMain', component: AdminMain },
  { path: 'adminAppointment', component: AdminAppointment },
  { path: 'employeeDetails', component: EmployeeDetails },
  { path: 'employeeList', component: EmployeeList },
  { path: 'patientDetails', component: PatientDetails },
  { path: 'patientList', component: PatientList },
  { path: 'documentDetails', component: DocumentDetails },
  { path: 'documentList', component: DocumentList },
  { path: 'scheduleDetails', component: ScheduleDetails },
  { path: 'scheduleList', component: ScheduleList },
  { path: 'appointmentScheduler', component: AppointmentScheduler },
  { path: 'appointmentDetails', component: AppointmentDetails },
  { path: 'appointmentList', component: AppointmentList },
  { path: 'caseStudyDetails', component: CaseStudyDetails },
  { path: 'caseStudyList', component: CaseStudyList },
  { path: 'referenceDetails', component: ReferenceDetails },
  { path: 'referenceList', component: ReferenceList },
  { path: 'medicineDetails', component: MedicineDetails },
  { path: 'medicineList', component: MedicineList },
  { path: 'prescriptionDetails', component: PrescriptionDetails },
  { path: 'prescriptionList', component: PrescriptionList },
  { path: 'accountDetails', component: AccountDetails },
  { path: 'accountList', component: AccountList },
  { path: 'invoiceDetails', component: InvoiceDetails },
  { path: 'invoiceList', component: InvoiceList },
  { path: 'paymentDetails', component: PaymentDetails },
  { path: 'paymentList', component: PaymentList },
  { path: 'insuranceDetails', component: InsuranceDetails },
  { path: 'insuranceList', component: InsuranceList },
  { path: 'serviceDetails', component: ServiceDetails },
  { path: 'serviceList', component: ServiceList },
  { path: 'packageDetails', component: PackageDetails },
  { path: 'packageList', component: PackageList },
  { path: 'billDetails', component: BillDetails },
  { path: 'billList', component: BillList },
  { path: 'vitalSignDetails', component: VitalSignDetails },
  { path: 'vitalSignList', component: VitalSignList },
  { path: 'doctorOrderDetails', component: DoctorOrderDetails },
  { path: 'doctorOrderList', component: DoctorOrderList },
  { path: 'admissionDetails', component: AdmissionDetails },
  { path: 'admissionList', component: AdmissionList },
  { path: 'bedTransfer', component: BedTransfer },
  { path: 'floorDetails', component: FloorDetails },
  { path: 'floorList', component: FloorList },
  { path: 'roomDetails', component: RoomDetails },
  { path: 'roomList', component: RoomList },
  { path: 'bedDetails', component: BedDetails },
  { path: 'bedList', component: BedList },
  { path: 'radExamDetails', component: RadExamDetails },
  { path: 'radExamList', component: RadExamList },
  { path: 'visitDetails', component: VisitDetails },
  { path: 'visitList', component: VisitList },
  { path: 'adminPatient', component: AdminPatient },
  { path: 'adminBedStatus', component: AdminBedStatus },
  { path: 'adminReference', component: AdminReference },
  { path: 'investigationDetails', component: InvestigationDetails },
  { path: 'investigationList', component: InvestigationList },
  { path: 'radInvestigationDetails', component: RadInvestigationDetails },
  { path: 'radInvestigationList', component: RadInvestigationList },
  { path: 'purchaseOrderDetails', component: PurchaseOrderDetails },
  { path: 'purchaseOrderList', component: PurchaseOrderList },
  { path: 'receiveOrderDetails', component: ReceiveOrderDetails },
  { path: 'receiveOrderList', component: ReceiveOrderList },
  { path: 'patientSaleDetails', component: PatientSaleDetails },
  { path: 'patientSaleList', component: PatientSaleList },
  { path: 'saleReturnDetails', component: SaleReturnDetails },
  { path: 'saleReturnList', component: SaleReturnList },
  { path: 'birthReportDetails', component: BirthReportDetails },
  { path: 'birthReportList', component: BirthReportList },
  { path: 'deathReportDetails', component: DeathReportDetails },
  { path: 'deathReportList', component: DeathReportList },
  { path: 'hospitalLocationDetails', component: HospitalLocationDetails },
  { path: 'hospitalLocationList', component: HospitalLocationList },
  { path: 'enquiryDetails', component: EnquiryDetails },
  { path: 'enquiryList', component: EnquiryList },
  { path: 'waitingList', component: WaitingList },
  { path: 'adminWebsite', component: AdminWebsite },
  { path: 'adminRadiologyConfig', component: AdminRadiologyConfig },
  { path: 'dashboard', component: Dashboard }
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    RouterModule.forChild(routes), CommonSharedModule, CurrencyMaskModule, 
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }
    )
  ],

  exports: [CommonSharedModule, TranslateModule],

  declarations: [SearchComponent, FileUploader, AdminMenu, AdminMain, AdminAppointment, DocumentDetails,
    DocumentList, EmployeeDetails, EmployeeList, PatientDetails, PatientList, ScheduleDetails, ScheduleList,
    AppointmentScheduler, AppointmentDetails, AppointmentList, CaseStudyDetails, CaseStudyList, ReferenceDetails,
    ReferenceList, ReferenceWithCategoryDetails, ReferenceWithCategoryList, MedicineDetails, MedicineList,
    PrescriptionDetails, PrescriptionList, AccountDetails, AccountList,
    InvoiceDetails, InvoiceList, PaymentDetails, PaymentList, InsuranceDetails, InsuranceList, ServiceDetails,
    ServiceList, PackageDetails, PackageList, BillDetails, BillList, VitalSignDetails, VitalSignList, AllergyDetails,
    MedicalHistoryDetails, SocialHistoryDetails, VaccineDetails, SymptomDetails, BedTransfer,
    DoctorOrderDetails, DoctorOrderList, AdmissionDetails, AdmissionList, FloorDetails, FloorList,
	RoomDetails, RoomList, BedDetails, BedList, RadExamDetails, RadExamList, AdminPatient, AdminBedStatus, 
	AdmissionDiagnoses, PatientServiceDetails, 
    AdminReference, VisitDetails, VisitList, DischargeDetails, LabTestDetails, LabTestList, InvestigationDetails,
	InvestigationList, RadInvestigationDetails, RadInvestigationList, PurchaseOrderDetails, PurchaseOrderList, 
	ReceiveOrderDetails, ReceiveOrderList,
    PatientSaleDetails, PatientSaleList, SaleReturnDetails, SaleReturnList, BirthReportDetails, BirthReportList,
    DeathReportDetails, DeathReportList, HospitalLocationDetails, HospitalLocationList, PatientLookup, VisitAdmLookup,
    PurchaseOrderLookup, PatientSaleLookup, HospitalDetails, EnquiryDetails, EnquiryList, WaitingList,
    SectionDetails, SectionList, SectionItemDetails, SectionItemList, DepartmentDetails,
    DepartmentList, AdminWebsite, AdminHeader, SliderDetails, SliderList, SliderTextList, SliderTextDetails,
    CompanyDetails, CompanyList, ContactDetails, ContactList, Dashboard, PatientMedicineList, AdminRadiologyConfig],

  providers: [
	CategoryDropdown, PackageDropdown, DoctorDropdown, TokenStorage, BillingService, VisitService, LoggedInGuard, 
	ConfirmationService, ServiceDropdown, LabTestDropdown, ProductDropdown, ModalityDropdown, RadExamDropdown, 
	RadInvestigationService, ExamStatusDropdown, RadiologyTechDropdown]
})

export class AdminModule { }