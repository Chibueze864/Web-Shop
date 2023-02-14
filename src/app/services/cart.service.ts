import { Injectable } from '@angular/core';
import {Cart, CartItem} from "src/app/models/cart.model";
import {BehaviorSubject} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({ providedIn: 'root' })

export class CartService {
	
  cart = new BehaviorSubject<Cart>({items: []});
  constructor(private _snackBar: MatSnackBar) { 
  }
  
  addToCart(item: CartItem): void{
	  const items = [...this.cart.value.items];
	  
	  const itemInCart = items.find(_item=> _item.id === item.id);
	  if(itemInCart){
		  itemInCart.quantity += 1;
	  }else{
		  items.push(item);
	  }
	  this.cart.next({items});
	  this._snackBar.open("1 item added to cart", "Ok", {duration: 3000});
	  console.log(this.cart.value);
  }
  getTotal(items: Array<CartItem> ): number{
		return items.map((item)=> item.price *item.quantity).reduce((prev, current)=> prev + current, 0);
  }
  onClearCart(): void{
		this.cart.next({items: []});
		this._snackBar.open("Cart is cleared","ok", {duration: 3000})
  }
  removeFromCart(item: CartItem): void{
		const filteredItems = this.cart.value.items.filter(product => product.id !== item.id);
		this.cart.next({items: filteredItems});
		this._snackBar.open("Item Removed From Cart","Ok", {duration: 3000})

  }
  decreaseQuantity(item: CartItem): void{
	  
	  const itemInCart = this.cart.value.items.find(_item=> _item.id === item.id);
	  if(itemInCart && itemInCart.quantity !== 1){
		  itemInCart.quantity -= 1;
		  this._snackBar.open("Item Quantity Decreased","Ok", {duration: 3000});

	  }else if(itemInCart && itemInCart.quantity === 1){
		 	const filteredItems = this.cart.value.items.filter(product => product.id !== item.id);
			this.cart.next({items: filteredItems});
			this._snackBar.open("Item Removed From Cart","Ok", {duration: 3000})
  }}
}
