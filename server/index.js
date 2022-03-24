const commerce = require("./lib/commerce");
const { db, detectIntent } = require("./lib/firebase");

const { WebhookClient } = require("dialogflow-fulfillment");
const { nanoid } = require("nanoid");

// Require the framework and instantiate it

// expressjs server
const express = require("express");
const bodyParser = require("body-parser");
const { Payload } = require("dialogflow-fulfillment");
const app = express();
const port = 1337;
const appUrl = "http://localhost:1337";
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/api/welcome", async (req, res) => {
  const sessionId = nanoid();

  res.send("Hello World!");
});

app.get("/api/products", async (req, res) => {
  const products = await commerce.products.list();
  return res.json({
    products: products,
  });
});

//handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(err);
});

let productType, budgetLimit;
app.post("/api/webhook", async (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  async function captureUserBudget(agent) {
    const budget = agent.context.get("awaitingBudget");
    console.log(budget);
    budgetLimit = agent.parameters.budget;
    if (productType && budgetLimit) {
      const data = await commerce.products.list({ query: productType });
      const products = data?.data;
      if(!products)
        return agent.add("Sorry, we don't have any products of that type");
      //loop through each product and find the one with the lowest price
      let cheapestProduct = products[0];
      products.forEach((product) => {
        if (product.price.raw < cheapestProduct.price.raw) {
          cheapestProduct = product;
        }
      });
      const cheapestProductPrice = cheapestProduct.price.raw;
      const cheapestProductTitle = cheapestProduct.name;
      const cheapestProductImage = cheapestProduct.image.url;

      agent.add(
        new Payload(
          agent.UNSPECIFIED,
          makeCardRes({
            title: cheapestProductTitle,
            subtitle: cheapestProductPrice,
            imageUrl: cheapestProductImage,
            buttons: [{ text: "Buy", postback: "Buy" }],
          }),
          { sendAsMessage: true, rawPayload: true }
        )
      );
    }
  }

  function captureProductType(agent) {
    productType = agent.parameters.product;
  }
  try {
    let intentMap = new Map();
    // intentMap.set("get user budget", captureUserBudget);
    intentMap.set("captureUserBudget", captureUserBudget);
    intentMap.set("product.search", captureProductType);
    agent.handleRequest(intentMap);
  } catch (error) {
    console.log(error);
  }
});

function makeCardRes({ title, subtitle, imageUrl, buttons }) {
  return (response = {
   
  "richContent": [
    [
      {
        "type": "image",
        "rawUrl": imageUrl,
        "accessibilityText": title
      },
      {
        "type": "accordion",
        "title": title,
        "subtitle": subtitle,
        "image": {
          "src": {
            "rawUrl": imageUrl
          }
        }
      },
      {
        "type": "chips",
        "options": [
          {
            "text": "Buy now",
            "image": {
              "src": {
                "rawUrl": "https://example.com/images/logo.png"
              }
            },
            "link": `${appUrl}/buy`
          },
          {
            "text": "Next",
            // "image": {
            //   "src": {
            //     "rawUrl": "https://example.com/images/logo.png"
            //   }
            // },
            "link": `${appUrl}/buy`
          }
        ]
      }
    ]
  ]


  });
}

app.post("/api/sendMsg", async (request, res) => {
  let { msg, sessionId } = request.body;
  console.log(msg);
  if (!sessionId) sessionId = nanoid();
  const insert = await db.collection("messages").doc(sessionId).create({
    msg,
    createdAt: new Date(),
  });

  const responses = await detectIntent(sessionId, msg, null, "en");
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
    msg,
  });
});

// Run the server!
const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
start();
