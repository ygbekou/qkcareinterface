import { EventEmitter, Injectable} 	from "@angular/core";
import { User } 					from '../models/user';
import { TokenStorage } from './token.storage';
import { BehaviorSubject } from 'rxjs';

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
  
    constructor(private token: TokenStorage) {
      if (this.token.getToken() != null) {
        this.showMenu = true;
      }
    }
  
    changeModuleName(moduleName: string) {
      this.moduleNameSource.next(moduleName)
    }
  
    changePatientId(patientId: number) {
      this.patientIdSource.next(patientId)
    }
}