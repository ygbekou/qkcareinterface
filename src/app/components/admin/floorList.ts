import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Floor } from '../../models';
import { ConfirmationService } from 'primeng';
import { GenericService, TokenStorage } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './baseComponent';

@Component({
  selector: 'app-floor-list',
  templateUrl: '../../pages/admin/floorList.html',
  providers: [GenericService]
})
export class FloorList extends BaseComponent implements OnInit, OnDestroy {

  floors: Floor[] = [];
  cols: any[];

  hiddenMenu: boolean = true;
  @Output() floorIdEvent = new EventEmitter<string>();

  constructor
    (
      public genericService: GenericService,
      public translate: TranslateService,
      public confirmationService: ConfirmationService,
      public tokenStorage: TokenStorage,
      private route: ActivatedRoute,
      private router: Router,
  ) {
	  super(genericService, translate, confirmationService, tokenStorage);
  }

  ngOnInit(): void {
    this.cols = [
	  { field: 'buildingName', header: 'Building', headerKey: 'COMMON.BUILDING', style: {width: '20%', 'text-align': 'center'} },
      { field: 'name', header: 'Name', headerKey: 'COMMON.NAME', style: {width: '20%', 'text-align': 'center'} },
      { field: 'description', header: 'Description', headerKey: 'COMMON.DESCRIPTION', style: {width: '40%', 'text-align': 'center'} },
      { field: 'statusDesc', header: 'Status', headerKey: 'COMMON.STATUS', style: {width: '10%', 'text-align': 'center'} }
    ];

    this.route
      .queryParams
      .subscribe(() => {


        this.genericService.getAll('Floor')
          .subscribe((data: Floor[]) => {
            this.floors = data;
          },
            error => console.log(error),
            () => console.log('Get all Floors complete'));
      });


    this.updateCols();
    this.translate.onLangChange.subscribe(() => {
      this.updateCols();
    });
  }


  updateCols() {
    for (var index in this.cols) {
      let col = this.cols[index];
      this.translate.get(col.headerKey).subscribe((res: string) => {
        col.header = res;
      });
    }
  }


  ngOnDestroy() {
    this.floors = null;
  }

  edit(floorId: number) {
    try {
      if (this.hiddenMenu) {
        this.floorIdEvent.emit(floorId + '');
      } else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            "floorId": floorId
          }
        }
        this.router.navigate(["/admin/floorDetails"], navigationExtras);
      }
    }
    catch (e) {
      console.log(e);
    }

  }

  updateTable(floor: Floor) {
		const index = this.floors.findIndex(x => x.id === floor.id);
		
		if (index === -1) {
			this.floors.push(floor);
		} else {
			this.floors[index] = floor;
		}

	}

}
