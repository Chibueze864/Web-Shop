const cors = require("cors");
const bodyParser = require("body-parser");
const express = require('express');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors({origin: true, credentials: true}));

const stripe = require('stripe')('sk_test_51MWhGWI5bYMqrrjftUxc0JoCqU3ZzJtOOLJjp0eyJ1SKOrcuU5ia0dT8wjohpaZQRRXD62LDKSSw7b9z0S6l9Ttr00nYCOHdXV');





app.post('/checkout', async (req, res, next) => {
	try{
		
		const session = await stripe.checkout.sessions.create({
			shipping_address_collection: {allowed_countries: ['US', 'CA']},
			  shipping_options: [
				{
				  shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: {amount: 0, currency: 'usd'},
					display_name: 'Free shipping',
					delivery_estimate: {
					  minimum: {unit: 'business_day', value: 5},
					  maximum: {unit: 'business_day', value: 7},
					},
				  },
				},
			],
			
			line_items: req.body.items.map((item)=>({
				// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
				price_data: {
					currency: "usd",
					product_data:{
						name: item.name,
						images: [item.product]
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			})),
			mode: "payment",
			success_url: "http://localhost:4242/success.html",
			cancel_url: "http://localhost:4242/cancel.html",
			
		});
		res.status(200).json(session);
	}catch (error){
		next(error);
	}

});

app.listen(4242, () => console.log('Running on port 4242'));