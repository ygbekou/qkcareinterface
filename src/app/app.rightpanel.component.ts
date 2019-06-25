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
	public activeTab = 0;
	constructor(public app: AppComponent,
		public tokenStorage: TokenStorage,
		private router: Router) { }


	ngAfterViewInit() {
		setTimeout(() => { this.rightPanelMenuScrollerViewChild.moveBar(); }, 100);
	}

	onTabChange(evt) {

		setTimeout(() => {
			this.rightPanelMenuScrollerViewChild.moveBar();
			this.activeTab = evt.index;
			if (evt.index === 0) {
				this.activeTab = 0;
			} else if (evt.index === 1) {
				this.activeTab = 1;
			} else {
				this.activeTab = 1;
			}

		}, 450);
	}

	logOut() {
		this.tokenStorage.signOut();
		this.router.navigate(['/']);
		window.location.reload();
	}

}
