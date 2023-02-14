import { Component } from '@angular/core';
import {Cart, CartItem} from "src/app/models/cart.model";
import {CartService} from "src/app/services/cart.service"
import { HttpClient } from '@angular/common/http'; 
import {loadStripe} from "@stripe/stripe-js";

@Component({
  selector: 'app-cart',
  templateUrl: `cart.component.html`,
  styles: [
  ]
})
export class CartComponent {
	cart : Cart = {items: [{
		product: "https://via.placeholder.com/150",
		name: "Sneakers",
		price: 150,
		quantity: 1,
		id: 1,
	},
	{
		product: "https://via.placeholder.com/150",
		name: "Sneakers",
		price: 150,
		quantity:3,
		id: 1,
	},
	{
		product: "https://via.placeholder.com/150",
		name: "Sneakers",
		price: 150,
		quantity: 1,
		id: 1,
	}
	
	]};
	
	dataSource: Array<CartItem> = [];
	displayColumns: Array<string> = ["product", 
	"name",
	"price", 
	"quantity",
	"total",
	"action"
	]
	
	ngOnInit(): void{
		this.cartService.cart.subscribe((_cart: Cart)=>{
			this.cart = _cart;
			this.dataSource = this.cart.items;

		});
	}
	constructor(private cartService: CartService, private httpClient: HttpClient){}
	
	getTotal(items: Array<CartItem> ): number{
		return this.cartService.getTotal(items);
	}
	
	clearCart(): void{
		this.cartService.onClearCart();
	}
	onRemoveFromCart(item: CartItem): void{
		this.cartService.removeFromCart(item);
	}
	onAddQuantity(item: CartItem): void{
		this.cartService.addToCart(item);
	}
	onRemoveQuantity(item: CartItem): void{
		this.cartService.decreaseQuantity(item);
	}
	onCheckout(): void{
		this.httpClient.post(`http://localhost:4242/checkout`,{
			items: this.cart.items,
			method: 'POST',
			headers: {
				"Content-Type": 'application/json'
      }
		}).subscribe(async(res: any)=>{
			let stripe = await loadStripe("pk_test_51MWhGWI5bYMqrrjfB221kO8Py3EZ6aHYfMysE7MtdzK6t9EmucDrXtfkmsRPpnmYMYgk73Ra3lMVZghwYGYqOgL5009kRgKGtp");
			stripe?.redirectToCheckout({
				sessionId: res.id
			});
		});
	}
}
