import { EventEmitter, Injectable} 	from "@angular/core";
import { TokenStorage } from './token.storage';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import { Cookie } from "ng2-cookies/ng2-cookies";

@Injectable()
export class GlobalEventsManager {
    public showNavBar: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    public showMenu: Boolean = false;

    private moduleNameSource = new BehaviorSubject<string>("");
    private patientIdSource = new BehaviorSubject<number>(0);
    currentModuleName = this.moduleNameSource.asObservable();
    currentPatientId = this.patientIdSource.asObservable();
    currentLang = 'en';
    selectedReferenceType: string;
    selectedReferenceWithCategoryType: string;
    selectedParentId: number;
    selectedAdmissionId: number;
  
    constructor(private token: TokenStorage,
      private translate: TranslateService) {
      if (this.token.getToken() != null) {
        this.showMenu = true;
      }
    }
  
    changeModuleName(moduleName: string) {
      this.moduleNameSource.next(moduleName);
    }
  
    changePatientId(patientId: number) {
      this.patientIdSource.next(patientId)
    }

    
    changeLanguage(selectLang: string) {
        this.currentLang = selectLang;
        this.translate.use(selectLang);
        Cookie.set('lang',selectLang);
        console.log('setting the language to: '+selectLang);
        console.log('language in cookie='+Cookie.get('lang'));
        window.location.reload();
    }
}