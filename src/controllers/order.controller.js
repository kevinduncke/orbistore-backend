import Order from '../models/order.model.js';

// CREATE NEW ORDER
export const createOrder = async (req, res) => {
    const { items, total } = req.body;

    try {
        const order = await Order.create({
            user: req.user._id,
            items,
            total,
            paymentStatus: 'pending',
            paymentIntentId: null,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({
            createdAt: -1
        });

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// GET ALL ORDERS 
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE ORDER PAYMENT STATUS
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: req.body.paymentStatus },
            { new: true }
        );

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};