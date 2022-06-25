const commerce = require('./lib/commerce');
const { db, detectIntent } = require('./lib/firebase');
const axios = require('axios').default;

const { WebhookClient } = require('dialogflow-fulfillment');
const { nanoid } = require('nanoid');
const amazonScraper = require('amazon-buddy');
// Require the framework and instantiate it

// expressjs server
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Payload } = require('dialogflow-fulfillment');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.get('/', (req, res) => {
	return res.sendFile(path.join(__dirname, './../build/index.html'));
});
app.use(express.static(path.join(__dirname, './../build')));
app.get('/status', function (req, res) {
	return res.json('Server is running');
});

app.get('/api/welcome', async (req, res) => {
	const sessionId = nanoid();

	res.send('Hello World!');
});

app.get('/api/test', async (req, res) => {
	const products = await amazonScraper.products({
		keyword: 'Dell inspiron',
		number: 50,
		country: 'IN'
	});
	console.log(products);
	return res.json(products);
});

app.get('/api/products', async (req, res) => {
	const products = await commerce.products.list();
	return res.json({
		products: products
	});
});

//handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.error(err);
});

let productType = ``,
	budgetLimit,
	brand = ``,
	specifications = ``,
	lastProductIndex = 2,
	products = [];
app.post('/api/webhook', async (req, res) => {
	const agent = new WebhookClient({ request: req, response: res });

	async function captureUserBudget(agent) {
		const budget = agent.context.get('awaitingbudget');
		console.log(budget);
		budgetLimit = agent.parameters.budget;
		if (!productType || !budgetLimit) {
			return agent.add(`Sorry please refresh the page and try again`);
		}
		const data = await commerce.products.list({ query: productType });
		const reformedProductKeyword = `${productType} ${brand} ${specifications}`;
		products = await amazonScraper.products({
			keyword: reformedProductKeyword,
			number: 10,
			country: 'IN',
			sponsored: false
		});
		products = products?.result;
		const regex = /(\d+)GB\s(?:ram|memory|primary).*(\d{3,})GB\s(?:ssd|hdd|storage)/gim;
		if (!products) return agent.add("Sorry, we don't have any products of that type");
		//loop through each product and find the one with the lowest price
		let currentProduct = products[lastProductIndex];
		//map through products and find the cheapest one
		/* for (let k = 0; k < products.length; k++) {
			const product = products[k];

			const matchSpecs = regex.exec(product.name);

			if (
				product.name.toLowerCase().indexOf(brand.toLowerCase()) == -1 &&
				product.price.raw > budgetLimit
			) {
				continue;
			}

			const isMatching = Object.keys(specifications).every((spec, i) => {
				const specValue = Object.values(specifications)[i];
				return specValue.amount >= matchSpecs?.[i + 1];
			});
			if (isMatching) {
				matchingProducts.push(product);
			}
		} */

		// if (matchingProducts.length === 0) {
		// 	return agent.add("Sorry, we don't have any products that match your specifications");
		// }

		agent.add(
			new Payload(
				agent.UNSPECIFIED,
				makeCardRes({
					title: currentProduct.title,
					subtitle: currentProduct.price.current_price.toString(),
					imageUrl: currentProduct.thumbnail
					// buyLink: matchingProducts[0].checkout_url?.checkout
				}),
				{ sendAsMessage: true, rawPayload: true }
			)
		);
	}

	function captureProductType(agent) {
		matchingProducts = [];
		productType = agent.parameters.product;

		// if (productType === 'laptop' || productType === 'mobile') {
		agent.add(`What brand ${productType} do you want to buy?`);
		// }
	}

	function askForBrand(agent) {
		brand = agent.query;
		console.log(brand);
		if (brand) agent.add(`What specifications do you need?`);
	}
	function askForSpecifications(agent) {
		// for (let i = 0; i < agent.parameters.specifications.length; i++) {
		// 	const spec = agent.parameters.specifications[i];
		// 	const unit = agent.parameters['unit-information'][i];

		// 	specifications[spec] = unit;
		// }
		specifications = agent.query;

		agent.add(`What is your total budget?`);
	}

	function nextProduct(agent) {
		lastProductIndex++;
		if (products.length > lastProductIndex) {
			agent.add(
				new Payload(
					agent.UNSPECIFIED,
					makeCardRes({
						title: products[lastProductIndex].title,
						subtitle: products[lastProductIndex].price.current_price.toString(),
						imageUrl: products[lastProductIndex].thumbnail,
						buttons: [{ text: 'Buy', postback: 'Buy' }]
					}),
					{ sendAsMessage: true, rawPayload: true }
				)
			);
		} else {
			agent.add('No more products');
		}
	}

	async function buyProduct(agent) {
		const currentProduct = products[lastProductIndex];
		const productId = await createProduct({
			title: currentProduct.title,
			sku: currentProduct.asin,
			price: currentProduct.price?.current_price?.toString(),
			thumbnail: currentProduct?.thumbnail
		});
		const assetId = await createAsset(currentProduct.thumbnail);
		const isSuccess = await setAssetForProduct(productId, assetId);
		console.log(isSuccess);
		agent.add(
			`Follow the link to buy the ${productType}: ${buyingProduct?.checkout_url?.checkout}`
		);
	}
	try {
		let intentMap = new Map();
		// intentMap.set("get user budget", captureUserBudget);
		intentMap.set('askForBrand', askForBrand);
		intentMap.set('askForSpecifications', askForSpecifications);
		intentMap.set('captureUserBudget', captureUserBudget);
		intentMap.set('product.search', captureProductType);
		intentMap.set('product.next', nextProduct);
		intentMap.set('product.buy', buyProduct);
		agent.handleRequest(intentMap);
	} catch (error) {
		console.log(error);
	}
});

function makeCardRes({ title, subtitle, imageUrl, buyLink }) {
	return (response = {
		richContent: [
			[
				{
					type: 'image',
					rawUrl: imageUrl,
					accessibilityText: title
				},
				{
					type: 'accordion',
					title: title,
					subtitle: subtitle,
					image: {
						src: {
							rawUrl: imageUrl
						}
					}
				},
				{
					type: 'chips',
					options: [
						{
							text: 'Buy now',
							// image: {
							// 	src: {
							// 		rawUrl: 'https://example.com/images/logo.png'
							// 	}
							// },
							link: `${buyLink}`
						}
					]
				}
			]
		]
	});
}

app.post('/api/sendMsg', async (request, res) => {
	let { msg, sessionId } = request.body;
	console.log(msg);
	if (!sessionId) sessionId = nanoid();
	const insert = await db.collection('messages').doc(sessionId).create({
		msg,
		createdAt: new Date()
	});

	const responses = await detectIntent(sessionId, msg, null, 'en');
	// console.log(responses);

	// let productType = responses.queryResult?.parameters?.fields?.product?.stringValue;
	// if(!productType){
	//   agent.add("Sorry I can't understand you");
	//   return;
	// }

	// let products = await commerce.products.list({
	//   query: productType
	// })

	return res.json({
		msg
	});
});

// Run the server!
const start = async () => {
	try {
		app.listen(process.env.PORT || 3000, () => {
			console.log(`Server started on port ${process.env.PORT || 3000}`);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
start();
const commerceKey = `sk_test_40922175938e8db0b5b5c92eadb5538c05ca41fd68bbd`;
let buyingProduct = {};
async function createProduct(data) {
	const product = {
		name: data.title,
		sku: data.sku,
		price: data.price,
		image: data.thumbnail,
		quantity: 1,
		pay_what_you_want: false,
		tax_exempt: false,
		active: true
	};
	var options = {
		method: 'POST',
		url: 'https://api.chec.io/v1/products',
		headers: { 'X-Authorization': commerceKey, 'Content-Type': 'application/json' },
		data: {
			product,
			collect: { billing: true, fullname: true },

			extra_field: [{ name: 'Thank you message', required: true }]

			//   assets: [{id: 'ast_VNplJa1EaYwL60'}],
			//   categories: [{id: 'cat_1ypbroE658n4ea'}],
			//   related_products: ['prod_VNplJa1EaYwL60'],
			//   attributes: [{id: 'attr_7RqEv5xOoZz4jA', value: 'Ohio'}]
		}
	};

	const response = await axios.request(options);
	console.log(response.data);
	buyingProduct = response.data;
	if (response.data?.id) {
		createProductDb(data.sku, product);
		return response.data?.id;
	}
}

async function createProductDb(sku, product) {
	const insert = await db.collection('products').doc(sku).set({
		product,
		createdAt: new Date()
	});
	return insert;
}

async function createAsset(url) {
	var options = {
		method: 'POST',
		url: 'https://api.chec.io/v1/assets',
		headers: {
			'X-Authorization': commerceKey,
			'Content-Type': 'application/json'
		},
		data: {
			filename: `${nanoid()}.jpg`,
			url
		}
	};

	const response = await axios.request(options);

	console.log(response.data);
	if (response.data?.id) return response.data.id;
}

async function setAssetForProduct(productId, assetId) {
	var options = {
		method: 'PUT',
		url: `https://api.chec.io/v1/products/${productId}/assets`,
		headers: { 'X-Authorization': commerceKey, 'Content-Type': 'application/json' },
		data: { assets: [{ id: assetId }] }
	};

	const response = await axios.request(options);

	console.log(response.data);
	if (response.data?.success) {
		return true;
	}
}
