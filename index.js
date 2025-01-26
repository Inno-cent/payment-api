require('dotenv').config()

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const coinbaseCommerce = require('coinbase-commerce-node');

const { Client, Charge } = coinbaseCommerce;
const app = express();

// Replace with your own Coinbase Commerce API key
Client.init('YOUR_COINBASE_COMMERCE_API_KEY');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to create a charge (payment request)
app.post('/create-charge', async (req, res) => {
    try {
        const chargeData = {
            name: 'Test Product',
            description: 'This is a sample product for sale',
            local_price: {
                amount: '10.00',
                currency: 'USD',
            },
            pricing_type: 'fixed_price',
            metadata: {
                customer_name: 'John Doe',
                customer_email: 'johndoe@example.com',
            },
        };

        const charge = await Charge.create(chargeData);

        // Send the charge URL (for the customer to complete payment)
        res.json({ charge_url: charge.hosted_url });
    } catch (error) {
        console.error('Error creating charge:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Webhook route to listen for payment status updates
app.post('/webhook', (req, res) => {
    const sigHeader = req.headers['x-cc-webhook-signature'];
    const payload = req.body;

    // Verify the webhook signature (Coinbase sends a signature to ensure data integrity)
    if (Client.verifyWebhook(payload, sigHeader)) {
        const event = payload.event;

        if (event.type === 'charge:confirmed') {
            console.log('Payment confirmed for charge:', event.data);
            // Handle successful payment (e.g., update order status)
        }

        // Respond to Coinbase Commerce to acknowledge receipt of webhook
        res.status(200).send('Webhook received');
    } else {
        res.status(400).send('Invalid webhook signature');
    }
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
