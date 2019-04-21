import {Component, OnInit, Output, EventEmitter, NgZone} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {GenericService} from '../../services';
import {Constants} from '../../app.constants';
import {User} from '../../models/user';
import {GlobalEventsManager} from '../../services/globalEventsManager';
import {Message } from 'primeng/primeng';
import { SectionItem } from '../../models/website';
import { Employee } from '../../models/employee';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'user-aboutUs-form',
  templateUrl: '../../pages/website/aboutUs.html',
  providers: [Constants, GenericService]
})

// tslint:disable-next-line:component-class-suffix
export class AboutUs implements OnInit {

    managers: Employee [] = [];

  constructor(
    private router: Router,
    private globalEventsManager: GlobalEventsManager,
    private genericService: GenericService,
    private route: ActivatedRoute) {
        this.globalEventsManager.showMenu = false;

  }

  ngOnInit() {
    const parameters = [];
    parameters.push('e.managing = |managing|0|Integer');
    this.genericService.getAllByCriteria('Employee', parameters)
         .subscribe((data: Employee[]) => {
        this.managers = data;
    },
    error => console.log(error),
    () => console.log('Get all Managers complete'));
  }

  setDefaults() {

  }
}
