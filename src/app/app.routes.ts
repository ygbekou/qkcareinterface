import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {SampleDemoComponent} from './demo/view/sampledemo.component';
import {FormsDemoComponent} from './demo/view/formsdemo.component';
import {DataDemoComponent} from './demo/view/datademo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {Login} from './components/website/login';
import {Landing} from './components/website/landing';
import { LoggedInGuard } from './services/loggedIn.guard';
import { Industries } from './components/website/industries';
import { AboutUs } from './components/website/aboutUs';
import { Contact } from './components/website/contact';
import { SingleSection } from './components/website/singleSection';
import { Services} from './components/website/services'; 

export const routes: Routes = [
  {path: '', component: Landing, pathMatch: 'full'},
  {path: 'dashboard', component: DashboardDemoComponent},
  {path: 'sample', component: SampleDemoComponent},
  {path: 'forms', component: FormsDemoComponent},
  {path: 'data', component: DataDemoComponent},
  {path: 'panels', component: PanelsDemoComponent},
  {path: 'overlays', component: OverlaysDemoComponent},
  {path: 'menus', component: MenusDemoComponent},
  {path: 'messages', component: MessagesDemoComponent},
  {path: 'misc', component: MiscDemoComponent},
  {path: 'empty', component: EmptyDemoComponent},
  {path: 'charts', component: ChartsDemoComponent},
  {path: 'file', component: FileDemoComponent},
  {path: 'documentation', component: DocumentationComponent},
  {path: 'login', component: Login},
  {path: 'section', component: SingleSection},
  {path: 'services', component: Services},
  {path: 'industries', component: Industries},
  {path: 'about', component: AboutUs},
  {path: 'contact', component: Contact},
  {path: 'admin', loadChildren: './modules/admin.module#AdminModule', canActivate: [LoggedInGuard], }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
