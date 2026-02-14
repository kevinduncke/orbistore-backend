import Stripe from 'stripe';
import Order from '../models/order.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;

        console.log('Order ID received for payment intent: ', orderId);

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found.' });
        } else {
            console.log('Order found for payment intent: ', order._id);
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: order.total * 100,
            currency: 'usd',
        });

        console.log('Stripe payment intent created: ', paymentIntent.id);

        order.paymentIntentId = paymentIntent.id;
        await order.save();

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// STRIPE WEBHOOK TO HANDLE PAYMENT INTENT
export const stripeWebhook = async (req, res) => {
    let event;

    try {
        const signature = req.headers['stripe-signature'];

        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log(`Webhook signature verification failed: ${error.message}`);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    // PAYMENT SUCCEEDED
    if (event.type === 'payment_intent.succeeded') {
        console.log('Payment succeeded webhook received');
        const intent = event.data.object;

        try {
            const updated = await Order.findOneAndUpdate(
                { paymentIntentId: intent.id },
                { paymentStatus: 'paid' },
                { returnDocument: 'after' }
            );

            if (updated) {
                console.log('Order updated to PAID: ', updated._id);
                console.log('With intent ID: ', intent.id);
            } else {
                console.error('Order not found with paymentIntentId: ', intent.id);
            }
        } catch (error) {
            console.error('Error updating order payment status: ', error);
        }

        console.log('Order ID updated to paid from webhook: ', intent.id);
    }

    // PAYMENT FAILED
    if (event.type === 'payment_intent.payment_failed') {
        console.log('Payment failed webhook not received');
        const intent = event.data.object;

        try {
            const updatedOrder = await Order.findOneAndUpdate(
                { paymentIntentId: intent.id },
                { paymentStatus: 'failed' },
                { returnDocument: 'after' }
            );

            if (updatedOrder) {
                console.log('Order updated to FAILED: ', updatedOrder._id);
                console.log('With intent ID: ', intent.id);
            } else {
                console.error('Order not found with paymentIntentId: ', intent.id);
            }
        } catch (error) {
            console.error('Error updating order payment status: ', error);
        }
    }

    res.json({ received: true });
};