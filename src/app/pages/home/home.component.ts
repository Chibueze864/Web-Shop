import { Component, OnInit, OnDestroy } from '@angular/core';
import {CartService} from "src/app/services/cart.service";
import {Product} from "src/app/models/product.model";
import {Subscription} from "rxjs";
import {StoreService} from "src/app/services/store.service";

const ROWS_HEIGHT:{[id: number]: number} = {1: 400, 3: 335, 4: 350};

@Component({
  selector: 'app-home',
  templateUrl: `home-component.html`,
  styles: [
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = "desc";
  count = "12";
  productSubscription: Subscription | undefined;
  
  onColumnsCountChange(colsNum: number){
    this.cols = colsNum;
	this.rowHeight = ROWS_HEIGHT[this.cols];
  }
  onShowCategory(newCategory: string){
	  this.category = newCategory;
	  this.getProducts();
  }
  onAddToCart(product: Product): void{
	  this.cartService.addToCart({
		  product: product.image,
		  name: product.title,
		  price: product.price,
		  quantity: 1,
		  id: product.id,
	  });
  }
  onSortChange(newSort: string): void{
	  this.sort = newSort;
	  this.getProducts();	
  }
  ngOnInit(): void{
	  this.getProducts();
  }
  
  ngOnDestroy(): void{
	  if(this.productSubscription){
		  this.productSubscription.unsubscribe();
	  }
  }
  getProducts(): void{
	 this.productSubscription =  this.storeService.getAllProducts(this.count, this.sort, this.category).subscribe((_products)=>{
		  this.products = _products;
	  });
  }
  constructor(private cartService: CartService, private storeService: StoreService){
	  
  }
  onItemsCountChange(newCount: number): void{
	  this.count = newCount.toString();
	  this.getProducts();
  }
}
