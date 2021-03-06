import { EventEmitter, Injectable } from '@angular/core';
import { TokenStorage } from './token.storage';
import { BehaviorSubject } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class GlobalEventsManager {
	public showNavBar: EventEmitter<Boolean> = new EventEmitter<Boolean>();
	public showMenu: Boolean = false;

	private moduleNameSource = new BehaviorSubject<string>('');
	private patientIdSource = new BehaviorSubject<number>(0);
	currentModuleName = this.moduleNameSource.asObservable();
	currentPatientId = this.patientIdSource.asObservable();
	currentLang = 'en';
	selectedReferenceType: string;
	selectedReferenceWithCategoryType: string;
	selectedParentId: number;
	selectedAppointmentId: number;
	selectedAdmissionId: number;

	public DATE_FORMAT = 'MM/dd/yyyy';
	public DATE_TIME_FORMAT = 'MM/dd/yyyy HH:mm';
	public CAL_DATE_FORMAT = 'mm/dd/yy';
	public LOCALE = 'en-US';

	constructor(private token: TokenStorage,
		private translate: TranslateService) {
		if (this.token.getToken() != null) {
			this.showMenu = true;
		}

		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			this.translate.get(['PROPERTY.CAL_DATE_FORMAT', 'PROPERTY.DATE_FORMAT', 'PROPERTY.LOCALE']).subscribe(res => {
				this.CAL_DATE_FORMAT = res['PROPERTY.CAL_DATE_FORMAT'];
				this.DATE_FORMAT = res['PROPERTY.DATE_FORMAT'];
				this.LOCALE = res['PROPERTY.LOCALE'];
			});
		});
	}

	changeModuleName(moduleName: string) {
		this.moduleNameSource.next(moduleName);
	}

	changePatientId(patientId: number) {
		this.patientIdSource.next(patientId);
	}
	changeAppointmentId(patientId: number) {
		this.selectedAppointmentId = patientId;
	}

	changeLanguage(selectLang: string) {
		this.currentLang = selectLang;
		this.translate.use(selectLang);
		Cookie.set('lang', selectLang);
		console.log('setting the language to: ' + selectLang);
		console.log('language in cookie=' + Cookie.get('lang'));
		window.location.reload();
	}
}
