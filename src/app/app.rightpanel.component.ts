import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AppComponent } from './app.component';
import { ScrollPanel } from 'primeng/primeng';
import { Router } from '@angular/router';
import { TokenStorage } from './services';
@Component({
	selector: 'app-rightpanel',
	templateUrl: './app.rightpanel.component.html'
})
export class AppRightPanelComponent implements AfterViewInit {

	@ViewChild('scrollRightPanel') rightPanelMenuScrollerViewChild: ScrollPanel;

	constructor(public app: AppComponent,
		public tokenStorage: TokenStorage,
		private router: Router) { }


	ngAfterViewInit() {
		setTimeout(() => { this.rightPanelMenuScrollerViewChild.moveBar(); }, 100);
	}

	onTabChange(event) {
		setTimeout(() => { this.rightPanelMenuScrollerViewChild.moveBar(); }, 450);
	}

	logOut() {
		this.tokenStorage.signOut();
		this.router.navigate(['/']);
		window.location.reload();
	}

	onTabChange(){
		
	}
}
