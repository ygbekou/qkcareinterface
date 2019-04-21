import {Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../app.constants';
import { Appointment } from '../../models/appointment';
import { Patient } from '../../models/patient';
import { EditorModule } from 'primeng/editor';
import { CountryDropdown, ReligionDropdown, OccupationDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService, UserService } from '../../services';

@Component({
  selector: 'app-appointment-details',
  templateUrl: '../../pages/admin/appointmentDetails.html',
  providers: [GenericService]
})
export class AppointmentDetails implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  appointment: Appointment = new Appointment();
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  COUNTRY: string = Constants.COUNTRY;
  ROLE: string = Constants.ROLE;
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  @ViewChild('uploadFile') input: ElementRef;
  formData = new FormData();
  
  constructor
    (
      private genericService: GenericService,
      private userService: UserService,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {

  }

  ngOnInit(): void {

    let appointmentId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          this.appointment = new Appointment(); 
          this.appointment.patient = new Patient();
          
          appointmentId = params['appointmentId'];
          
          if (appointmentId != null) {
              this.genericService.getOne(appointmentId, 'Appointment')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.appointment = result
                }
                else {
                  this.error = Constants.SAVE_UNSUCCESSFUL;
                  this.displayDialog = true;
                }
              })
          } 
        });
    
  }
  
  getAppointment(appointmentId: number) {
    this.genericService.getOne(appointmentId, 'Appointment')
        .subscribe(result => {
      if (result.id > 0) {
        this.appointment = result
      }
      else {
        this.error = Constants.SAVE_UNSUCCESSFUL;
        this.displayDialog = true;
      }
    })
  }
  
  ngOnDestroy() {
    this.appointment = null;
  }

  save() {
  }

 }
