const stripe = require("stripe")("sk_test_51Nx50fSAVSGvUYLHg8Cs0Ubd0cv95OmzNrEnem5aNdUeWRBhamLi2OQ6V14nJLtfn7jrTL30edVJzl95OTAN8B9S00GvalbWEB");
const { result } = require("lodash");
const { v4: uuidv4 } = require("uuid");

exports.makepayment = async(req, res) => {
  const { products } = req.body;
  const lineItems = products.map((product) => ({
    price_data:{
      currency:"inr",
      product_data:{
        name:"chair"
      },
      unit_amount:product.price * 100
    },
    quantity:product.quantity
  }))
 const session = await stripe.checkout.sessions.create({
  payment_method_types:["card"],
  line_items:lineItems,
  mode:"payment",
  success_url:"http://localhost:3001/order",
  cancel_url:"http://localhost:3001/RecycleOrder"
  
 })
 return res.json({url:session.url})
  // let amount = 0;
  // products.map(p => {
  //   amount = amount + p.price;
  // });

  // const idempotencykey = uuidv4();

  // return stripe.customers
  //   .create({
  //     email: token.email,
  //     source: token.id,
  //   })
  //   .then(customer => {
  //     stripe.charges
  //       .create(
  //         {
  //           amount: amount,
  //           currency: "usd",
  //           customer: customer.id,
  //           receipt_email: token.email,
  //           description: "a test account",
  //           shipping: {
  //             name: token.card.name,
  //             address: {
  //               line1: token.card.address_line1,
  //               line2: token.card.address_line2,
  //               city: token.card.address_city,
  //               country: token.card.address_country,
  //               postal_code: token.card.address_zip,
  //             },
  //           },
  //         },
  //         { idempotencykey }
  //       )
  //       .then(result => res.status(200).json(result))
  //       .catch(err => console.log(err));
  //   });
};
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
// const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');
// const express = require('express');
// const app = express();
// app.use(express.static('public'));

// const YOUR_DOMAIN = 'http://localhost:4242';

// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: '{{PRICE_ID}}',
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     success_url: `${YOUR_DOMAIN}/success.html`,
//     cancel_url: `${YOUR_DOMAIN}/cancel.html`,
//   });

//   res.redirect(303, session.url);
// });

// app.listen(4242, () => console.log('Running on port 4242'));