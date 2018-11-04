import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


import {AdminMain} from '../components/adminMain';
import {AdminAppointment} from '../components/adminAppointment';
import {DocumentDetails} from '../components/documentDetails';
import {DocumentList} from '../components/documentList';
import {ScheduleDetails} from '../components/scheduleDetails';
import {ScheduleList} from '../components/scheduleList';
import {AppointmentScheduler} from '../components/appointmentScheduler';
import {AppointmentDetails} from '../components/appointmentDetails';
import {AppointmentList} from '../components/appointmentList';
import {EmployeeDetails} from '../components/employeeDetails';
import {EmployeeList} from '../components/employeeList';
import {AdminMenu} from '../components/menu/adminMenu';
import {CommonSharedModule} from './common.shared.module';
import {FileUploader} from '../components/fileUploader';
import {PatientDetails} from '../components/patientDetails';
import {PatientList} from '../components/patientList';
import {CaseStudyDetails} from '../components/caseStudyDetails';
import {CaseStudyList} from '../components/caseStudyList';
import {ReferenceDetails} from '../components/referenceDetails';
import {ReferenceList} from '../components/referenceList';
import {ReferenceWithCategoryDetails} from '../components/referenceWithCategoryDetails';
import {ReferenceWithCategoryList} from '../components/referenceWithCategoryList';
import {MedicineDetails} from '../components/medicineDetails';
import {MedicineList} from '../components/medicineList';
import {PrescriptionDetails} from '../components/prescriptionDetails';
import {PrescriptionList} from '../components/prescriptionList';
import {AccountDetails} from '../components/accountDetails';
import {AccountList} from '../components/accountList';
import {InvoiceDetails} from '../components/invoiceDetails';
import {InvoiceList} from '../components/invoiceList';
import {PaymentDetails} from '../components/paymentDetails';
import {PaymentList} from '../components/paymentList';
import {InsuranceDetails} from '../components/insuranceDetails';
import {InsuranceList} from '../components/insuranceList';
import {PackageDetails} from '../components/packageDetails';
import {PackageList} from '../components/packageList';
import {ServiceDetails} from '../components/serviceDetails';
import {ServiceList} from '../components/serviceList';
import {BillDetails} from '../components/billDetails';
import {BillList} from '../components/billList';
import {VitalSignDetails} from '../components/vitalSignDetails';
import {VitalSignList} from '../components/vitalSignList';
import {DoctorOrderDetails} from '../components/doctorOrderDetails';
import {DoctorOrderList} from '../components/doctorOrderList';
import {AdmissionDetails} from '../components/admissionDetails';
import {AdmissionList} from '../components/admissionList';
import {BedTransfer} from '../components/bedTransfer';
import {FloorDetails} from '../components/floorDetails';
import {FloorList} from '../components/floorList';
import {RoomDetails} from '../components/roomDetails';
import {RoomList} from '../components/roomList';
import {BedDetails} from '../components/bedDetails';
import {BedList} from '../components/bedList';
import {AdminBedStatus} from '../components/adminBedStatus';
import {AdmissionDiagnoses} from '../components/admissionDiagnoses';
import {AdminReference} from '../components/adminReference';
import {CategoryDropdown, PackageDropdown} from '../components/dropdowns';


import {AdminPatient} from '../components/adminPatient';
import {VisitDetails} from '../components/visitDetails';
import {VisitList} from '../components/visitList';
import {AllergyDetails} from '../components/allergyDetails';
import {SymptomDetails} from '../components/symptomDetails';
import {MedicalHistoryDetails} from '../components/medicalHistoryDetails';
import {SocialHistoryDetails} from '../components/socialHistoryDetails';
import {VaccineDetails} from '../components/vaccineDetails';
import {DischargeDetails} from '../components/dischargeDetails';
import {LabTestDetails} from '../components/labTestDetails';
import {LabTestList} from '../components/labTestList';

import {InvestigationDetails} from '../components/investigationDetails';
import {InvestigationList} from '../components/investigationList';

import {PurchaseOrderDetails} from '../components/stocks/purchaseOrderDetails';
import {PurchaseOrderList} from '../components/stocks/purchaseOrderList';
import {ReceiveOrderDetails} from '../components/stocks/receiveOrderDetails';
import {ReceiveOrderList} from '../components/stocks/receiveOrderList';
import {PatientSaleDetails} from '../components/stocks/patientSaleDetails';
import {PatientSaleList} from '../components/stocks/patientSaleList';
import {SaleReturnDetails} from '../components/stocks/saleReturnDetails';
import {SaleReturnList} from '../components/stocks/saleReturnList';

import {BirthReportDetails} from '../components/activities/birthReportDetails';
import {BirthReportList} from '../components/activities/birthReportList';
import {DeathReportDetails} from '../components/activities/deathReportDetails';
import {DeathReportList} from '../components/activities/deathReportList';
import {HospitalLocationDetails} from '../components/hospitalLocationDetails';
import {HospitalLocationList} from '../components/hospitalLocationList';
import {HospitalDetails} from '../components/hospitalDetails';

import {PatientLookup} from '../components/includes/patientLookup';
import {PatientSaleLookup} from '../components/includes/patientSaleLookup';
import {VisitAdmLookup} from '../components/includes/visitAdmLookup';
import {PurchaseOrderLookup} from '../components/includes/purchaseOrderLookup';

import {EnquiryDetails} from '../components/enquiryDetails';
import {EnquiryList} from '../components/enquiryList';

const routes: Routes = [
  {path: 'adminMain', component: AdminMain},
  {path: 'adminAppointment', component: AdminAppointment},
  {path: 'employeeDetails', component: EmployeeDetails},
  {path: 'employeeList', component: EmployeeList},
  {path: 'patientDetails', component: PatientDetails},
  {path: 'patientList', component: PatientList},
  {path: 'documentDetails', component: DocumentDetails},
  {path: 'documentList', component: DocumentList},
  {path: 'scheduleDetails', component: ScheduleDetails},
  {path: 'scheduleList', component: ScheduleList},
  {path: 'appointmentScheduler', component: AppointmentScheduler},
  {path: 'appointmentDetails', component: AppointmentDetails},
  {path: 'appointmentList', component: AppointmentList},
  {path: 'caseStudyDetails', component: CaseStudyDetails},
  {path: 'caseStudyList', component: CaseStudyList},
  {path: 'referenceDetails', component: ReferenceDetails},
  {path: 'referenceList', component: ReferenceList},
  {path: 'medicineDetails', component: MedicineDetails},
  {path: 'medicineList', component: MedicineList},
  {path: 'prescriptionDetails', component: PrescriptionDetails},
  {path: 'prescriptionList', component: PrescriptionList},
  {path: 'accountDetails', component: AccountDetails},
  {path: 'accountList', component: AccountList},
  {path: 'invoiceDetails', component: InvoiceDetails},
  {path: 'invoiceList', component: InvoiceList},
  {path: 'paymentDetails', component: PaymentDetails},
  {path: 'paymentList', component: PaymentList},
  {path: 'insuranceDetails', component: InsuranceDetails},
  {path: 'insuranceList', component: InsuranceList},
  {path: 'serviceDetails', component: ServiceDetails},
  {path: 'serviceList', component: ServiceList},
  {path: 'packageDetails', component: PackageDetails},
  {path: 'packageList', component: PackageList},
  {path: 'billDetails', component: BillDetails},
  {path: 'billList', component: BillList},
  {path: 'vitalSignDetails', component: VitalSignDetails},
  {path: 'vitalSignList', component: VitalSignList},
  {path: 'doctorOrderDetails', component: DoctorOrderDetails},
  {path: 'doctorOrderList', component: DoctorOrderList},
  {path: 'admissionDetails', component: AdmissionDetails},
  {path: 'admissionList', component: AdmissionList},
  {path: 'bedTransfer', component: BedTransfer},
  {path: 'floorDetails', component: FloorDetails},
  {path: 'floorList', component: FloorList},
  {path: 'roomDetails', component: RoomDetails},
  {path: 'roomList', component: RoomList},
  {path: 'bedDetails', component: BedDetails},
  {path: 'bedList', component: BedList},
  {path: 'visitDetails', component: VisitDetails},
  {path: 'visitList', component: VisitList},
  {path: 'adminPatient', component: AdminPatient},
  {path: 'adminBedStatus', component: AdminBedStatus},
  {path: 'adminReference', component: AdminReference},
  {path: 'investigationDetails', component: InvestigationDetails},
  {path: 'investigationList', component: InvestigationList},
  {path: 'purchaseOrderDetails', component: PurchaseOrderDetails},
  {path: 'purchaseOrderList', component: PurchaseOrderList},
  {path: 'receiveOrderDetails', component: ReceiveOrderDetails},
  {path: 'receiveOrderList', component: ReceiveOrderList},
  {path: 'patientSaleDetails', component: PatientSaleDetails},
  {path: 'patientSaleList', component: PatientSaleList},
  {path: 'saleReturnDetails', component: SaleReturnDetails},
  {path: 'saleReturnList', component: SaleReturnList},
  {path: 'birthReportDetails', component: BirthReportDetails},
  {path: 'birthReportList', component: BirthReportList},
  {path: 'deathReportDetails', component: DeathReportDetails},
  {path: 'deathReportList', component: DeathReportList},
  {path: 'hospitalLocationDetails', component: HospitalLocationDetails},
  {path: 'hospitalLocationList', component: HospitalLocationList},
  {path: 'enquiryDetails', component: EnquiryDetails},
  {path: 'enquiryList', component: EnquiryList},
];

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    RouterModule.forChild(routes), CommonSharedModule, 
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

  declarations: [FileUploader, AdminMenu, AdminMain, AdminAppointment, DocumentDetails,
    DocumentList, EmployeeDetails, EmployeeList, PatientDetails, PatientList, ScheduleDetails, ScheduleList,
    AppointmentScheduler, AppointmentDetails, AppointmentList, CaseStudyDetails, CaseStudyList, ReferenceDetails,
    ReferenceList, ReferenceWithCategoryDetails, ReferenceWithCategoryList, MedicineDetails, MedicineList,
    PrescriptionDetails, PrescriptionList, AccountDetails, AccountList,
    InvoiceDetails, InvoiceList, PaymentDetails, PaymentList, InsuranceDetails, InsuranceList, ServiceDetails,
    ServiceList, PackageDetails, PackageList, BillDetails, BillList, VitalSignDetails, VitalSignList, AllergyDetails,
    MedicalHistoryDetails, SocialHistoryDetails, VaccineDetails, SymptomDetails, BedTransfer,
    DoctorOrderDetails, DoctorOrderList, AdmissionDetails, AdmissionList, FloorDetails, FloorList,
    RoomDetails, RoomList, BedDetails, BedList, AdminPatient, AdminBedStatus, AdmissionDiagnoses,
    AdminReference, VisitDetails, VisitList, DischargeDetails, LabTestDetails, LabTestList, InvestigationDetails,
    InvestigationList, PurchaseOrderDetails, PurchaseOrderList, ReceiveOrderDetails, ReceiveOrderList,
    PatientSaleDetails, PatientSaleList, SaleReturnDetails, SaleReturnList, BirthReportDetails, BirthReportList,
    DeathReportDetails, DeathReportList, HospitalLocationDetails, HospitalLocationList, PatientLookup, VisitAdmLookup, 
    PurchaseOrderLookup, PatientSaleLookup, HospitalDetails, EnquiryDetails, EnquiryList],

  providers: [CategoryDropdown, PackageDropdown]
})

export class AdminModule {}