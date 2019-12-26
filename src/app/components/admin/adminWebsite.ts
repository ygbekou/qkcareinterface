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
import { Section, SectionItem } from 'src/app/models/website';
@Component({
  selector: 'app-admin-website',
  templateUrl: '../../pages/admin/adminWebsite.html',
  providers: [GenericService]
})
// tslint:disable-next-line:component-class-suffix
export class AdminWebsite implements OnInit, OnDestroy {
  [x: string]: any;

  @ViewChild(SectionDetails, {static: false}) sectionDetails: SectionDetails;
  @ViewChild(SectionList, {static: false}) sectionList: SectionList;
  @ViewChild(SliderDetails, {static: false}) sliderDetails: SliderDetails;
  @ViewChild(SliderList, {static: false}) sliderList: SliderList;
  @ViewChild(SliderTextDetails, {static: false}) sliderTextDetails: SliderTextDetails;
  @ViewChild(SliderTextList, {static: false}) sliderTextList: SliderTextList;
  @ViewChild(SectionItemDetails, {static: false}) sectionItemDetails: SectionItemDetails;
  @ViewChild(SectionItemList, {static: false}) sectionItemList: SectionItemList;
  @ViewChild(EmployeeDetails, {static: false}) employeeDetails: EmployeeDetails;
  @ViewChild(CompanyDetails, {static: false}) companyDetails: CompanyDetails;
  @ViewChild(ContactDetails, {static: false}) contactDetails: ContactDetails;
  public activeTab = 0;
  public activeEmployeeTab = 1;
  public activeCompanyTab = 1;
  public activeSliderTab = 0;

  constructor(
    private globalEventsManager: GlobalEventsManager,
  ) {

  }

  ngOnInit() {
    this.globalEventsManager.showMenu = true;
  }

  ngOnDestroy() {
    this.sectionDetails = null;
    this.sectionList = null;
    this.sectionItemDetails = null;
    this.sectionItemList = null;
  }

  onSectionSelected($event) {
    const sectionId = $event;
    this.sectionDetails.getSection(sectionId);
  }
  onSectionSaved($event) {
    const aSection: Section = $event;
    this.sectionList.updateTable(aSection);
  }

  onSectionItemSaved($event) {
    const aSectionItem: SectionItem = $event;
    this.sectionItemList.updateTable(aSectionItem);
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
