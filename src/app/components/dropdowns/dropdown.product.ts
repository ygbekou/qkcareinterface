import { Injectable, OnInit } from '@angular/core';
import { DropdownUtil } from './dropdown.util';
import { GenericService } from '../../services/generic.service';
import { Product } from '../../models/product';
 
@Injectable()
export class ProductDropdown {
  
  filteredProducts : Product[];
  products : Product[] = []; 
  
  constructor(
    private genericService: GenericService) {
    this.getAllProducts();
  }
  
  filter(event) {
    this.filteredProducts = DropdownUtil.filter(event, this.products);
  }
  
  handleDropdownClick(event) {
    setTimeout(() => {
      this.filteredProducts = this.products;
    }, 10)
  }
  
  public getAllProducts(): void {
    this.genericService.getAll('Product')
      .subscribe((data: any[]) => {
        this.products = data
      },
        
      error => console.log(error),
      () => console.log('Get All Products Complete'));
  }
  
}