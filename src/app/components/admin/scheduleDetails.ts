import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Schedule } from '../../models';
import { Constants } from '../../app.constants';
import { DoctorDropdown, WeekdayDropdown, HospitalLocationDropdown } from '../dropdowns';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Message, ConfirmationService } from 'primeng/api';
import { BaseComponent } from './baseComponent';


@Component({
	selector: 'app-schedule-details',
	templateUrl: '../../pages/admin/scheduleDetails.html',
	providers: [GenericService, DoctorDropdown, WeekdayDropdown, HospitalLocationDropdown]
})
export class ScheduleDetails extends BaseComponent implements OnInit, OnDestroy {

	schedule: Schedule = new Schedule();
	messages: Message[] = [];

	SELECT_OPTION: string = Constants.SELECT_OPTION;

	constructor
		(
			public genericService: GenericService,
			public translate: TranslateService,
			public confirmationService: ConfirmationService, 
			public tokenStorage: TokenStorage, 
			public doctorDropdown: DoctorDropdown,
			public weekdayDropdown: WeekdayDropdown,
			public hospitalLocationDropdown: HospitalLocationDropdown,
			private route: ActivatedRoute) {
		super(genericService, translate, confirmationService, tokenStorage);
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
								this.schedule = result;
							} else {

							}
						});
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
			this.genericService.save(this.schedule, 'Schedule')
				.subscribe(result => {
					console.log(result);
					if (result.errors === null || result.errors.length === 0) {
						//this.schedule = result
						this.clear();
						this.messages.push({ severity: Constants.SUCCESS, summary: Constants.SAVE_LABEL, detail: Constants.SAVE_SUCCESSFUL });
					} else {
						this.translate.get(['COMMON.SAVE', 'MESSAGE.' + result.errors[0]]).subscribe(res => {
							this.messages.push({ severity: Constants.ERROR, summary: res['COMMON.SAVE'], detail: res['MESSAGE.' + result.errors[0]] });
						});
					}
				});
		} catch (e) {
			console.log(e);
		}
	}

	delete() {

	}

}
