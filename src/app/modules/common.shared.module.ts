import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightboxModule } from 'angular2-lightbox';
import { HttpModule } from '@angular/http';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import {
  TabViewModule, EditorModule, SharedModule, FieldsetModule, ProgressBarModule,
  FileUploadModule, StepsModule, InputTextareaModule, SpinnerModule,
  GrowlModule, ChartModule, PasswordModule, ToggleButtonModule, CarouselModule,
  DataListModule, CheckboxModule, InputTextModule, SelectButtonModule,
  CalendarModule, RadioButtonModule, DropdownModule, InputMaskModule, OverlayPanelModule,
  AutoCompleteModule, DataTableModule, DialogModule, ListboxModule, AccordionModule,
  GalleriaModule, MessagesModule, TreeModule, TreeNode, OrganizationChartModule, ConfirmDialogModule,
  DataGridModule, PanelModule, UIChart, PickListModule, ScheduleModule, ToolbarModule, Message, MessageModule, ScrollPanelModule
} from 'primeng/primeng';

@NgModule({
  declarations: [],

  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, HttpModule, ToggleButtonModule, FieldsetModule,
    TabViewModule, EditorModule, SharedModule, FileUploadModule, InputMaskModule, SpinnerModule, OverlayPanelModule,
    StepsModule, InputTextareaModule, GrowlModule, ChartModule, SelectButtonModule, OrganizationChartModule,
    PasswordModule, DataListModule, CheckboxModule, InputTextModule, ListboxModule, CarouselModule,
    CalendarModule, RadioButtonModule, DropdownModule, AutoCompleteModule, ScheduleModule, ProgressBarModule,
    DataTableModule, DialogModule, GalleriaModule, MessagesModule, TreeModule, AccordionModule, ConfirmDialogModule,
    DataGridModule, PanelModule, ScheduleModule, LightboxModule, TableModule, ToolbarModule, MessageModule,
    CardModule, ScrollPanelModule
  ],

  exports: [
    // angular exports
    CommonModule, FormsModule, ReactiveFormsModule, HttpModule,

    // primeng exports
    TabViewModule, EditorModule, SharedModule, FileUploadModule, ToggleButtonModule, SpinnerModule, FieldsetModule, ProgressBarModule,
    StepsModule, InputTextareaModule, GrowlModule, ChartModule, SelectButtonModule, ListboxModule, AccordionModule, LightboxModule,
    PasswordModule, DataListModule, CheckboxModule, InputTextModule, InputMaskModule, ScheduleModule, CarouselModule, OverlayPanelModule,
    CalendarModule, RadioButtonModule, DropdownModule, AutoCompleteModule, UIChart, PickListModule, OrganizationChartModule,
    DataTableModule, DialogModule, GalleriaModule, MessagesModule, TreeModule, DataGridModule, PanelModule, ScheduleModule, TableModule,
    ToolbarModule, MessageModule, ConfirmDialogModule, CardModule, ScrollPanelModule
  ],
})

export class CommonSharedModule {

}
