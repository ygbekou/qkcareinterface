import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/primeng';
import { AppComponent } from './app.component';
import { TokenStorage, AuthenticationService, GlobalEventsManager } from './services';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-menu',
  template: `
        <ul app-submenu [item]="model" root="true" class="layout-menu"
            [reset]="reset" visible="true" parentActive="true"></ul>
    `
})
export class AppMenuComponent implements OnInit {

  @Input() reset: boolean;

  model: any[];
  lang = 'fr';
  constructor(
    private globalEventsManager: GlobalEventsManager,
    public app: AppComponent) { }

  ngOnInit() {
    if (Cookie.get('lang')) {
      this.lang = Cookie.get('lang');
    }
    this.globalEventsManager.showNavBar.subscribe((data: boolean) => {
    }, error => console.log(error));

    this.model = [
      { label: 'Dashboard', icon: 'fa fa-fw fa-home', routerLink: ['/admin/dashboard'], displayList: '1,2,3,4,5,6,20' },
      {
        label: 'Patients', icon: 'fa fa-wheelchair', displayList: '1,2,3',
        items: [
          {
            label: this.lang === 'fr' ? 'Ajouter un patient' : 'Add a patient',
            icon: 'fa fa-plus', routerLink: ['/admin/patientDetails'], displayList: '1,2,3'
          },
          {
            label: this.lang === 'fr' ? 'Liste des patients' : 'List patients',
            icon: 'fa fa-search', routerLink: ['/admin/patientList'], displayList: '1,2,3'
          }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Personnel' : 'Employees', icon: 'fa fa-user-md', displayList: '1,2',
        items: [
          {
            label: this.lang === 'fr' ? 'Ajouter un personnel' : 'Add employee',
            icon: 'fa fa-plus', routerLink: ['/admin/employeeDetails'], displayList: '1,2'
          },
          {
            label: this.lang === 'fr' ? 'Liste du personnel' : 'List employees',
            icon: 'fa fa-search', routerLink: ['/admin/employeeList'], displayList: '1,2'
          }
        ]
      },
      {
        label: 'Admission', icon: 'fa fa-ambulance',
        items: [
          { label: this.lang === 'fr' ? 'Admettre un patient' : 'Admit a patient', icon: 'fa fa-plus', routerLink: ['/admin/admissionDetails'], displayList: '1,2' },
          { label: this.lang === 'fr' ? 'Liste des admissions' : 'List admissions', icon: 'fa fa-search', routerLink: ['/admin/admissionList'], displayList: '1,2,20' },
          { label: this.lang === 'fr' ? 'Changer de lit' : 'Change bed', icon: 'fa fa-edit', url: ['#/admin/bedTransfer?transferType=BED'], displayList: '1,2' },
          { label: this.lang === 'fr' ? 'Changer de médecin' : 'Change doctor', icon: 'fa fa-edit', url: ['#/admin/bedTransfer?transferType=DOCTOR'], displayList: '1,2' }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Rendez-vous' : 'Appointment', icon: 'fa fa-calendar',
        items: [
          { label: this.lang === 'fr' ? 'Ajouter un horaire' : 'Add schedule', icon: 'fa fa-plus', routerLink: ['/admin/scheduleDetails'], displayList: '1' },
          { label: this.lang === 'fr' ? 'Liste des horaires' : 'List schedules', icon: 'fa fa-search', routerLink: ['/admin/scheduleList'], displayList: '1' },
          { label: this.lang === 'fr' ? 'Les Rendez-vous' : 'Appointments', icon: 'fa fa-calendar-check-o', routerLink: ['/admin/appointmentScheduler'], displayList: '1,2' }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Visites' : 'Visits', icon: 'fa fa-user-md',
        items: [
          { label: this.lang === 'fr' ? 'Ajouter une visite' : 'Add a visit', icon: 'fa fa-plus', routerLink: ['/admin/visitDetails'] },
          { label: this.lang === 'fr' ? 'Liste des visites' : 'List visits', icon: 'fa fa-search', routerLink: ['/admin/visitList'] },
          { label: this.lang === 'fr' ? "Liste d'attente" : 'Wait list', icon: 'fa fa-search', routerLink: ['/admin/waitingList'] },
        ]
      },
      {
        label: this.lang === 'fr' ? 'Laboratoire' : 'Lab', icon: 'fa fa-stethoscope',
        items: [
          { label: this.lang === 'fr' ? 'Ajouter un test' : 'Add a test', icon: 'fa fa-plus', routerLink: ['/admin/investigationDetails'] },
          { label: this.lang === 'fr' ? 'Liste des tests' : 'List tests', icon: 'fa fa-search', routerLink: ['/admin/investigationList'] }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Facturation' : 'Billing', icon: 'fa fa-money',
        items: [
          { label: this.lang === 'fr' ? 'Nouvelle facture' : 'Add a bill', icon: 'fa fa-plus', routerLink: ['/admin/billDetails'] },
          { label: this.lang === 'fr' ? 'Anciennes Factures' : 'List bills', icon: 'fa fa-search', routerLink: ['/admin/billList'] },
          { label: this.lang === 'fr' ? 'Ajouter un tarif' : 'Add Tarif', icon: 'fa fa-plus', routerLink: ['/admin/serviceDetails'] },
          { label: this.lang === 'fr' ? 'Liste des tarifs' : 'List Tarifs', icon: 'fa fa-search', routerLink: ['/admin/serviceList'] },
          { label: this.lang === 'fr' ? 'Ajouter un paquet' : 'Add a paquet', icon: 'fa fa-plus', routerLink: ['/admin/packageDetails'] },
          { label: this.lang === 'fr' ? 'Liste des paquets' : 'List paquets', icon: 'fa fa-search', routerLink: ['/admin/packageList'] }
        ]
      },
      { 
        label: this.lang === 'fr' ? 'Pharmacie' : 'Pharmacy', icon: 'fa fa-ambulance',
        items: [
          { label: this.lang === 'fr' ? 'Commander médicament' : 'Order medication', icon: 'fa fa-plus', routerLink: ['/admin/purchaseOrderDetails'] },
          { label: this.lang === 'fr' ? 'Liste des commandes' : 'Order list', icon: 'fa fa-search', routerLink: ['/admin/purchaseOrderList'] },
          { label: this.lang === 'fr' ? 'Réception de commande' : 'Receive Order', icon: 'fa fa-plus', routerLink: ['/admin/receiveOrderDetails'] },
          { label: this.lang === 'fr' ? 'Liste des receptions' : 'List Order receipts', icon: 'fa fa-search', routerLink: ['/admin/receiveOrderList'] },
          { label: this.lang === 'fr' ? 'Ajouter une vente' : 'Sell medication', icon: 'fa fa-plus', routerLink: ['/admin/patientSaleDetails'] },
          { label: this.lang === 'fr' ? 'Liste des ventes' : 'List sales', icon: 'fa fa-search', routerLink: ['/admin/patientSaleList'] },
          { label: this.lang === 'fr' ? 'Ajouter un retour achat' : 'Add return', icon: 'fa fa-plus', routerLink: ['/admin/saleReturnDetails'] },
          { label: this.lang === 'fr' ? 'Liste des retours' : 'List returns', icon: 'fa fa-search', routerLink: ['/admin/saleReturnList'] }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Activités' : 'Hospital activities', icon: 'fa fa-hospital-o',
        items: [
          { label: this.lang === 'fr' ? 'Déclarer une naissance' : 'Add birth', icon: 'fa fa-plus', routerLink: ['/admin/birthReportDetails'] },
          { label: this.lang === 'fr' ? 'Liste des naissances' : 'List births', icon: 'fa fa-search', routerLink: ['/admin/birthReportList'] },
          { label: this.lang === 'fr' ? 'Declarer un décès' : 'Declare death', icon: 'fa fa-plus', routerLink: ['/admin/deathReportDetails'] },
          { label: this.lang === 'fr' ? 'Liste des décès' : 'List deaths', icon: 'fa fa-search', routerLink: ['/admin/deathReportList'] },
          { label: this.lang === 'fr' ? 'Ajouter une requête' : 'Add a request', icon: 'fa fa-plus', routerLink: ['/admin/enquiryDetails'], displayList: '1,2,3,20' },
          { label: this.lang === 'fr' ? 'Liste des requêtes' : 'List requests', icon: 'fa fa-plus', routerLink: ['/admin/enquiryList'], displayList: '1,2,3,20' },

		]
      },
      {
        label: this.lang === 'fr' ? 'Configuration' : 'Configuration', icon: 'fa fa-cogs',
        items: [
          { label: this.lang === 'fr' ? 'Chambres et lits' : 'Room and beds', icon: 'fa fa-bed', routerLink: ['/admin/adminBedStatus'] },
          { label: this.lang === 'fr' ? 'config. des Références' : 'Reference config.', icon: 'fa fa-fw fa-paint-brush', routerLink: ['/admin/adminReference'] },
          { label: this.lang === 'fr' ? 'config. du site web' : 'Website config.', icon: 'fa fa-fw fa-globe', routerLink: ['/admin/adminWebsite'] }
        ]
      },
      {
        label: this.lang === 'fr' ? 'Réglage Affichage' : 'Display settings', icon: 'fa fa-fw fa-paint-brush',
        items: [
          {
            label: this.lang === 'fr' ? 'Couleurs' : 'Colors',
            icon: 'fa fa-fw fa-paint-brush',
            items: [
              {
                label: 'Blue', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('blue', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('blue', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('blue', 'gradient')
                  }
                ]
              },
              {
                label: 'Cyan', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('cyan', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('cyan', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('cyan', 'gradient')
                  }
                ]
              },
              {
                label: 'Green', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('green', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('green', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('green', 'gradient')
                  }
                ]
              },
              {
                label: 'Yellow', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('yellow', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('yellow', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('yellow', 'gradient')
                  }
                ]
              },
              {
                label: 'Purple', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('purple', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('purple', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('purple', 'gradient')
                  }
                ]
              },
              {
                label: 'Pink', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('pink', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('pink', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('pink', 'gradient')
                  }
                ]
              },
              {
                label: 'Blue Grey', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('bluegrey', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('bluegrey', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('bluegrey', 'gradient')
                  }
                ]
              },
              {
                label: 'Teal', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('teal', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('teal', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('teal', 'gradient')
                  }
                ]
              },
              {
                label: 'Orange', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('orange', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('orange', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('orange', 'gradient')
                  }
                ]
              },
              {
                label: 'Grey', icon: 'fa fa-fw fa-paint-brush',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('grey', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('grey', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('grey', 'gradient')
                  }
                ]
              }
            ]
          },
          {
            label: 'Special',
            icon: 'fa fa-fw fa-paint-brush',
            items: [
              {
                label: 'Cappuccino', icon: 'fa fa-fw fa-picture-o',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('cappuccino', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('cappuccino', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('cappuccino', 'gradient')
                  }
                ]
              },
              {
                label: 'Montreal', icon: 'fa fa-fw fa-picture-o',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('montreal', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('montreal', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('montreal', 'gradient')
                  }
                ]
              },
              {
                label: 'Hollywood', icon: 'fa fa-fw fa-picture-o',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('hollywood', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('hollywood', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('hollywood', 'gradient')
                  }
                ]
              },
              {
                label: 'Peak', icon: 'fa fa-fw fa-picture-o',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('peak', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('peak', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('peak', 'gradient')
                  }
                ]
              },
              {
                label: 'Alive', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('alive', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('alive', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('alive', 'gradient')
                  }
                ]
              },
              {
                label: 'Emerald', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('emerald', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('emerald', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('emerald', 'gradient')
                  }
                ]
              },
              {
                label: 'Ash', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('ash', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('ash', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('ash', 'gradient')
                  }
                ]
              },
              {
                label: 'Noir', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('noir', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('noir', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('noir', 'gradient')
                  }
                ]
              },
              {
                label: 'Mantle', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('mantle', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('mantle', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('mantle', 'gradient')
                  }
                ]
              },
              {
                label: 'Predawn', icon: 'fa fa-fw fa-certificate',
                items: [
                  {
                    label: 'Light', icon: 'fa fa-fw fa-square-o',
                    command: (event) => this.changeTheme('predawn', 'light')
                  },
                  {
                    label: 'Dark', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('predawn', 'dark')
                  },
                  {
                    label: 'Gradient', icon: 'fa fa-fw fa-square',
                    command: (event) => this.changeTheme('predawn', 'gradient')
                  }
                ]
              },
            ]
          },
          {
            label: this.lang === 'fr' ? 'Position Menu' : 'Menu position', icon: 'fa fa-fw fa-bars',
            items: [
              { label: this.lang === 'fr' ? 'Afficher Menu' : 'Display menu', icon: 'fa fa-fw fa-bars', command: () => this.app.layoutMode = 'static' },
              { label: this.lang === 'fr' ? 'Cacher Menu' : 'Hide menu', icon: 'fa fa-fw fa-bars', command: () => this.app.layoutMode = 'overlay' }
            ]
          },
          {
            label: this.lang === 'fr' ? 'Prosition Profile' : 'Profile position', icon: 'fa fa-fw fa-user',
            items: [
              { label: this.lang === 'fr' ? 'Profile a gauche' : 'Profile on the left', icon: 'fa fa-sun-o fa-fw', command: () => this.app.profileMode = 'inline' },
              { label: this.lang === 'fr' ? 'Profile en haut' : 'Profile at the top', icon: 'fa fa-moon-o fa-fw', command: () => this.app.profileMode = 'top' }
            ]
          }
        ]
      },
      { label: 'Documentation', icon: 'fa fa-fw fa-book', routerLink: ['/documentation'] }
    ];
  }

  changeTheme(theme: string, scheme: string) {
    const layoutLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('layout-css');
    layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';

    const themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.href = 'assets/theme/theme-' + theme + '.css';

    this.app.menuMode = scheme;
  }


}

@Component({
  /* tslint:disable:component-selector */
  selector: '[app-submenu]',
  /* tslint:enable:component-selector */
  template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}" [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)"
                   class="ripplelink" *ngIf="!child.routerLink && shouldDisplay(child.displayList)"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                </a>

                <a (click)="itemClick($event,child,i)" class="ripplelink" *ngIf="child.routerLink && shouldDisplay(child.displayList)"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon"></i><span>{{child.label}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down layout-menuitem-toggler" *ngIf="child.items"></i>
                </a>
                <div class="submenu-arrow" *ngIf="child.items"></div>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset" [parentActive]="isActive(i)"
                    [@children]=" isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
  animations: [
    trigger('children', [
      state('hiddenAnimated', style({
        height: '0px',
        opacity: 0
      })),
      state('visibleAnimated', style({
        height: '*',
        opacity: 1
      })),
      transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
      transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class AppSubMenuComponent {

  @Input() item: MenuItem;

  @Input() root: boolean;

  @Input() visible: boolean;

  _reset: boolean;

  _parentActive: boolean;

  activeIndex: number;

  constructor(public app: AppComponent, private authService: AuthenticationService, private tokenStorage: TokenStorage) { }

  itemClick(event: Event, item: MenuItem, index: number) {

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    // activate current item and deactivate active sibling if any
    this.activeIndex = (this.activeIndex === index) ? null : index;

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    // prevent hash change
    if (item.items || (!item.url && !item.routerLink)) {
      setTimeout(() => {
        this.app.layoutMenuScrollerViewChild.moveBar();
      }, 450);
      event.preventDefault();
    }

    // hide menu
    if (!item.items) {
      this.app.overlayMenuActive = false;
      this.app.staticMenuMobileActive = false;
    }
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }

  @Input() get reset(): boolean {
    return this._reset;
  }

  set reset(val: boolean) {
    this._reset = val;

    if (this._reset) {
      this.activeIndex = null;
    }
  }

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }

  set parentActive(val: boolean) {
    this._parentActive = val;

    if (!this._parentActive) {
      this.activeIndex = null;
    }
  }

  shouldDisplay(displayList: string) {
    return this.authService.shouldDisplay(displayList, this.tokenStorage.getRole());
  }

}