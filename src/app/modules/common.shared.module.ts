import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { LightboxModule } from 'angular2-lightbox';
import { HttpModule } from '@angular/http';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import {
  TabViewModule, EditorModule, SharedModule, FieldsetModule, ProgressBarModule,
  FileUploadModule, StepsModule, InputTextareaModule, SpinnerModule,
  ChartModule, PasswordModule, ToggleButtonModule, CarouselModule,
  CheckboxModule, InputTextModule, SelectButtonModule, FullCalendar, FullCalendarModule, 
  CalendarModule, RadioButtonModule, DropdownModule, InputMaskModule, OverlayPanelModule,
  AutoCompleteModule, DialogModule, ListboxModule, AccordionModule,
  GalleriaModule, MessagesModule, TreeModule, TreeNode, OrganizationChartModule, ConfirmDialogModule,
  PanelModule, UIChart, PickListModule, ToolbarModule, Message, MessageModule, ScrollPanelModule
} from 'primeng';

//import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],

  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, HttpModule, ToggleButtonModule, FieldsetModule,
    TabViewModule, EditorModule, SharedModule, FileUploadModule, InputMaskModule, SpinnerModule, OverlayPanelModule,
    StepsModule, InputTextareaModule, ChartModule, SelectButtonModule, OrganizationChartModule,
    PasswordModule, CheckboxModule, InputTextModule, ListboxModule, CarouselModule, FullCalendarModule,
    CalendarModule, RadioButtonModule, DropdownModule, AutoCompleteModule, ProgressBarModule,
    DialogModule, GalleriaModule, MessagesModule, TreeModule, AccordionModule, ConfirmDialogModule,
    PanelModule, TableModule, ToolbarModule, MessageModule,
    CardModule, ScrollPanelModule, //BrowserAnimationsModule, NoopAnimationsModule
  ],

  exports: [
    // angular exports
    CommonModule, FormsModule, ReactiveFormsModule, HttpModule,

    // primeng exports
    TabViewModule, EditorModule, SharedModule, FileUploadModule, ToggleButtonModule, SpinnerModule, FieldsetModule, ProgressBarModule,
    StepsModule, InputTextareaModule, ChartModule, SelectButtonModule, ListboxModule, AccordionModule,
    PasswordModule, CheckboxModule, InputTextModule, InputMaskModule, CarouselModule, OverlayPanelModule,
    CalendarModule, RadioButtonModule, DropdownModule, AutoCompleteModule, UIChart, PickListModule, OrganizationChartModule,
    DialogModule, GalleriaModule, MessagesModule, TreeModule, PanelModule, TableModule,
    ToolbarModule, MessageModule, ConfirmDialogModule, CardModule, ScrollPanelModule, FullCalendar, 
    FullCalendarModule, //BrowserAnimationsModule, NoopAnimationsModule
  ],
})

export class CommonSharedModule {

}
