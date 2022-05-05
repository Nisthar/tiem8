const commerce = require('./lib/commerce');
const { db, detectIntent } = require('./lib/firebase');

const { WebhookClient } = require('dialogflow-fulfillment');
const { nanoid } = require('nanoid');

// Require the framework and instantiate it

// expressjs server
const express = require('express');
const bodyParser = require('body-parser');
const { Payload } = require('dialogflow-fulfillment');
const app = express();
const port = 1337;
const appUrl = 'http://localhost:1337';
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/status', function (req, res) {
	return res.json('Server is running');
});

app.get('/api/welcome', async (req, res) => {
	const sessionId = nanoid();

	res.send('Hello World!');
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

let productType,
	budgetLimit,
	brand,
	specifications = {},
	lastProductIndex = 0,
	matchingProducts = [];
app.post('/api/webhook', async (req, res) => {
	const agent = new WebhookClient({ request: req, response: res });

	async function captureUserBudget(agent) {
		const budget = agent.context.get('awaitingbudget');
		console.log(budget);
		budgetLimit = agent.parameters.budget;
		if (productType && budgetLimit) {
			const data = await commerce.products.list({ query: productType });
			const products = data?.data;
			const regex = /(\d+)GB\s(?:ram|memory).*(\d{3,})GB\s(?:ssd|hdd|storage)/gim;
			if (!products) return agent.add("Sorry, we don't have any products of that type");
			//loop through each product and find the one with the lowest price
			let cheapestProduct = products[0];
			//map through products and find the cheapest one
			for (let k = 0; k < products.length; k++) {
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
					return specValue.amount == matchSpecs?.[i + 1];
				});
				if (isMatching) {
					matchingProducts.push(product);
				}
			}

			agent.add(
				new Payload(
					agent.UNSPECIFIED,
					makeCardRes({
						title: matchingProducts[0].name,
						subtitle: matchingProducts[0].price.raw.toString(),
						imageUrl: matchingProducts[0].image.url,
						buttons: [{ text: 'Buy', postback: 'Buy' }]
					}),
					{ sendAsMessage: true, rawPayload: true }
				)
			);
		}
	}

	function captureProductType(agent) {
		matchingProducts = [];
		productType = agent.parameters.product;

		if (productType === 'laptop' || productType === 'mobile') {
			agent.add(`What brand ${productType} do you want to buy?`);
		}
	}

	function askForBrand(agent) {
		brand = agent.query;
		console.log(brand);
		if (brand) agent.add(`What specifications do you need? (eg. ram, storage, processor etc)`);
	}
	function askForSpecifications(agent) {
		for (let i = 0; i < agent.parameters.specifications.length; i++) {
			const spec = agent.parameters.specifications[i];
			const unit = agent.parameters['unit-information'][i];

			specifications[spec] = unit;
		}

		agent.add(`What is your total budget?`);
	}

	function nextProduct(agent) {
		lastProductIndex++;
		if (matchingProducts.length > lastProductIndex) {
			agent.add(
				new Payload(
					agent.UNSPECIFIED,
					makeCardRes({
						title: matchingProducts[lastProductIndex].name,
						subtitle: matchingProducts[lastProductIndex].price.raw.toString(),
						imageUrl: matchingProducts[lastProductIndex].image.url,
						buttons: [{ text: 'Buy', postback: 'Buy' }]
					}),
					{ sendAsMessage: true, rawPayload: true }
				)
			);
		} else {
			agent.add('No more products');
		}
	}
	try {
		let intentMap = new Map();
		// intentMap.set("get user budget", captureUserBudget);
		intentMap.set('askForBrand', askForBrand);
		intentMap.set('askForSpecifications', askForSpecifications);
		intentMap.set('captureUserBudget', captureUserBudget);
		intentMap.set('product.search', captureProductType);
		intentMap.set('product.next', nextProduct);
		agent.handleRequest(intentMap);
	} catch (error) {
		console.log(error);
	}
});

function makeCardRes({ title, subtitle, imageUrl, buttons }) {
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
							image: {
								src: {
									rawUrl: 'https://example.com/images/logo.png'
								}
							},
							link: `${appUrl}/buy`
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
		app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
start();
