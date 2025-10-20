const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create Stripe payment intent
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { projectId, amount, currency = 'usd' } = req.body;

    if (!projectId || !amount) {
      return res.status(400).json({ message: 'Project ID and amount are required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get or create Stripe customer
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString()
        }
      });
      customerId = customer.id;
      
      // Save customer ID to user
      await User.findByIdAndUpdate(req.user._id, { stripeCustomerId: customerId });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata: {
        projectId: projectId,
        userId: req.user._id.toString()
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Update project with payment intent ID
    project.stripePaymentIntentId = paymentIntent.id;
    await project.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment and update project status
// @access  Private
router.post('/confirm', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Find project by payment intent ID
    const project = await Project.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update project payment status
    project.paymentStatus = 'paid';
    project.actualCost = paymentIntent.amount / 100; // Convert from cents
    await project.save();

    res.json({
      message: 'Payment confirmed successfully',
      project
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for user
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const projects = await Project.find({
      applicant: req.user._id,
      paymentStatus: { $in: ['paid', 'failed', 'refunded'] }
    })
    .select('title type paymentStatus actualCost stripePaymentIntentId updatedAt')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Project.countDocuments({
      applicant: req.user._id,
      paymentStatus: { $in: ['paid', 'failed', 'refunded'] }
    });

    res.json({
      payments: projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      
      // Update project payment status
      await Project.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { 
          paymentStatus: 'paid',
          actualCost: paymentIntent.amount / 100
        }
      );
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      
      // Update project payment status
      await Project.findOneAndUpdate(
        { stripePaymentIntentId: failedPayment.id },
        { paymentStatus: 'failed' }
      );
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
