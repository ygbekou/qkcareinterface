import { Component } from '@angular/core';
import { AppComponent} from './app.component';
import { GenericService, TokenStorage } from './services';
import { Hospital } from './models';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    hospital: Hospital = new Hospital(); 
    constructor(private genericService: GenericService,
      public tokenStorage: TokenStorage,
        public app: AppComponent) {

        const parameters = [];
        this.genericService.getAllByCriteria('Hospital', parameters)
          .subscribe((data: Hospital[]) => {
         if (data.length > 0) {
           this.hospital = data[0];
         } else {
           this.hospital = new Hospital();
         }
       },
       error => console.log(error),
       () => console.log('Get Hospital complete'));
    }
}
