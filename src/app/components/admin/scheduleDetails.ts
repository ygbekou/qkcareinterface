import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Department, Schedule, Employee, UserGroup, User } from '../../models';
import { Constants } from '../../app.constants';
import { EditorModule } from 'primeng/editor';
import { DoctorDropdown, WeekdayDropdown, HospitalLocationDropdown } from '../dropdowns';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { InputTextareaModule, CheckboxModule, MultiSelectModule, CalendarModule } from 'primeng/primeng';
import { GenericService, UserService } from '../../services';
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import { Message } from 'primeng/api';


@Component({
  selector: 'app-schedule-details',
  templateUrl: '../../pages/admin/scheduleDetails.html',
  providers: [GenericService, DoctorDropdown, WeekdayDropdown, HospitalLocationDropdown]
})
export class ScheduleDetails implements OnInit, OnDestroy {
  
  schedule: Schedule = new Schedule();
  messages: Message[] = [];
  
  SELECT_OPTION: string = Constants.SELECT_OPTION;
  
  constructor
    (
      private genericService: GenericService,
      private userService: UserService,
      private translate: TranslateService,
      public doctorDropdown: DoctorDropdown,
      public weekdayDropdown: WeekdayDropdown,
      public hospitalLocationDropdown: HospitalLocationDropdown,
      private changeDetectorRef: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router
    ) {

  }

  ngOnInit(): void {

    let scheduleId = null;
    this.route
        .queryParams
        .subscribe(params => {          
          
          scheduleId = params['scheduleId'];
          
          if (scheduleId != null) {
              this.genericService.getOne(scheduleId, 'Schedule')
                  .subscribe(result => {
                if (result.id > 0) {
                  this.schedule = result
                }
                else {
                  
                }
              })
          } else {
              
          }
        });
    
  }
  
  ngOnDestroy() {
    this.schedule = null;
  }

  clear() {
    this.schedule = new Schedule();
  }
  
  save() {
    this.messages = [];
    try {
      this.genericService.save(this.schedule, "Schedule")
        .subscribe(result => {
          if (result.errors.length == 0) {
            this.schedule = result
            this.messages.push({severity:Constants.SUCCESS, summary:Constants.SAVE_LABEL, detail:Constants.SAVE_SUCCESSFUL});
          }
          else {
            this.translate.get(['COMMON.SAVE', 'MESSAGE.' + result.errors[0]]).subscribe(res => {
              this.messages.push({severity:Constants.ERROR, summary:res['COMMON.SAVE'], detail:res['MESSAGE.' + result.errors[0]]});
            });
          }
        })
    }
    catch (e) {
      console.log(e);
    }
  }
  
  delete() {
    
  }

 }
