import { Component, OnDestroy } from '@angular/core';
import { AppComponent } from './app.component';
import { BreadcrumbService } from './breadcrumb.service';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { TokenStorage } from './services';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './app.breadcrumb.component.html'
})
export class AppBreadcrumbComponent implements OnDestroy {

	subscription: Subscription;

	items: MenuItem[];

	constructor(public breadcrumbService: BreadcrumbService,
		public tokenStorage: TokenStorage,
		private router: Router) {
		this.subscription = breadcrumbService.itemsHandler.subscribe(response => {
			this.items = response;
		});
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	logOut() {
		this.tokenStorage.signOut();
		this.router.navigate(['/']);
		window.location.reload();
	}
}
