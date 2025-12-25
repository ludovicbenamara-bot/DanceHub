
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { amount = 5000 } = req.body || {}; // Default 50.00 EUR

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};
