import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GenericService, GlobalEventsManager } from '../../services';
import { SectionDetails } from './sectionDetails';
import { SectionList } from './sectionList';
import { SectionItemDetails } from './sectionItemDetails';
import { SectionItemList } from './sectionItemList';
import { EmployeeDetails } from '../admin/employeeDetails';
import { CompanyDetails } from '../admin/companyDetails';
import { ContactDetails } from '../admin/contactDetails';
import { SliderList } from './sliderList';
import { SliderDetails } from './sliderDetails';
import { SliderTextList } from './sliderTextList';
import { SliderTextDetails } from './sliderTextDetails';
@Component({
  selector: 'app-admin-website',
  templateUrl: '../../pages/admin/adminWebsite.html',
  providers: [GenericService ]
})
// tslint:disable-next-line:component-class-suffix
export class AdminWebsite implements OnInit, OnDestroy {
  [x: string]: any;

  @ViewChild(SectionDetails) sectionDetails: SectionDetails;
  @ViewChild(SectionList) sectionList: SectionList;
  @ViewChild(SliderDetails) sliderDetails: SliderDetails;
  @ViewChild(SliderList) sliderList: SliderList;
  @ViewChild(SliderTextDetails) sliderTextDetails: SliderTextDetails;
  @ViewChild(SliderTextList) sliderTextList: SliderTextList;
  @ViewChild(SectionItemDetails) sectionItemDetails: SectionItemDetails;
  @ViewChild(SectionItemList) sectionItemList: SectionItemList;
  @ViewChild(EmployeeDetails) employeeDetails: EmployeeDetails;
  @ViewChild(CompanyDetails) companyDetails: CompanyDetails;
  @ViewChild(ContactDetails) contactDetails: ContactDetails;
  public activeTab = 0;
  public activeEmployeeTab = 1;
  public activeCompanyTab = 1;
  public activeSliderTab = 0;

  constructor (
    private globalEventsManager: GlobalEventsManager,
  ) {

  }

  ngOnInit() {
    this.globalEventsManager.showMenu = true;
  }

  ngOnDestroy () {
    this.sectionDetails = null;
    this.sectionList = null;
    this.sectionItemDetails = null;
    this.sectionItemList = null;
  }

  onSectionSelected($event) {
      const sectionId = $event;
      this.sectionDetails.getSection(sectionId);
  }
  onSectionItemSelected($event) {
      const sectionItemId = $event;
      this.sectionItemDetails.getSectionItem(sectionItemId);
  }
  onEmployeeSelected($event) {
      this.activeEmployeeTab = 0;
      const employeeId = $event;
      this.employeeDetails.getEmployee(employeeId);

  }
  onCompanySelected($event) {
      this.activeCompanyTab = 0;
      const companyId = $event;
      this.companyDetails.getCompany(companyId);

  }

  onContactSelected($event) {
      const contactId = $event;
      this.contactDetails.getContact(contactId);
  }

  onSliderSelected($event) {
      const sliderId = $event;
      this.sliderDetails.getSlider(sliderId);
  }

  onSliderTextSelected($event) {
      const sliderTextId = $event;
      this.sliderTextDetails.getSliderText(sliderTextId);
  }

  onTabChange(evt) {
    this.activeTab = evt.index;
    setTimeout(() => {
        if (evt.index === 0) {
        } else if (evt.index === 1) {
        }
    }, 0);
  }

  onEmployeeTabChange(evt) {
    this.activeEmployeeTab = evt.index;
  }

   onCompanyTabChange(evt) {
    this.activeCompanyTab = evt.index;
  }

  onSliderTabChange(evt) {
    this.activeSliderTab = evt.index;
  }
}
