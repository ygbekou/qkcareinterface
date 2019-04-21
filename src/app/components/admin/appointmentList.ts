import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Appointment } from '../../models/appointment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants } from '../../app.constants';
import { FileUploader } from './fileUploader';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DataTableModule, DialogModule, InputTextareaModule, CheckboxModule } from 'primeng/primeng';
import { User } from '../../models/user';  
import { GenericService } from '../../services';

@Component({
  selector: 'app-appointment-list',
  templateUrl: '../../pages/admin/appointmentList.html',
  providers: [GenericService]
})
export class AppointmentList implements OnInit, OnDestroy {
  
  public error: String = '';
  displayDialog: boolean;
  appointments: Appointment[] = [];
  cols: any[];
  
  DETAIL: string = Constants.DETAIL;
  ADD_IMAGE: string = Constants.ADD_IMAGE;
  ADD_LABEL: string = Constants.ADD_LABEL;  
  
  @Output() appointmentIdEvent = new EventEmitter<string>();
  
  constructor
    (
    private genericService: GenericService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    ) {

    
  }

  ngOnInit(): void {
    this.cols = [
            { field: 'appointmentDate', header: 'Date', type: 'Date' },
            { field: 'beginTime', header: 'Begin Time' },
            { field: 'endTime', header: 'End Time' },
            { field: 'doctorName', header: 'Doctor' },
            { field: 'departmentName', header: 'Department' }
        ];
    
      let patientId = null;
      this.route
        .queryParams
        .subscribe(params => {          
          
            patientId = params['patientId'];
          
            let parameters: string [] = []; 
            
            if (patientId != null) {
              parameters.push('e.patient.id = |patientId|' + patientId + '|Long')
            } 
            this.genericService.getAllByCriteria('Appointment', parameters)
              .subscribe((data: Appointment[]) => 
              { 
                this.appointments = data 
              },
              error => console.log(error),
              () => console.log('Get all Appointment complete'));
          });
  }
 
  
  ngOnDestroy() {
    this.appointments = null;
  }
  
  edit(appointmentId: string) {
    this.appointmentIdEvent.emit(appointmentId);
  }

  delete(patientId : number) {
    try {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "patientId": patientId,
        }
      }
      this.router.navigate(["/admin/patientDetails"], navigationExtras);
    }
    catch (e) {
      console.log(e);
    }
  }

 }
