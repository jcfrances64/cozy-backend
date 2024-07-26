const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors')

// Middleware to parse JSON
app.use(express.json());

app.use(cors())

app.post('/create-checkout-session', async (req, res) => {
  console.log(req.body);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        }
      }),
      mode: "payment",
      success_url: `${req.headers.origin}/success=true`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    res.json({ sessionId: session.id })
    // res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: true, message: err.message })
  }
}); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});