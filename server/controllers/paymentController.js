import dotenv from 'dotenv';
import Stripe from 'stripe';
import moment from 'moment';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import sendEmail from '../utils/sendEmail.js'; // ✅ import email utility
import Stylist from '../models/Stylist.js';

dotenv.config();

const stripeInstance = new Stripe(process.env.STRIPE_SECRET || 'sk_test_...', {
  apiVersion: '2024-04-10',
});

// ✅ Create Stripe Checkout Session
export const createSession = async (req, res) => {
  const { serviceName, amount, bookingData } = req.body;

  if (!serviceName || !amount || !bookingData) {
    return res.status(400).json({ message: 'Missing required data' });
  }

  try {
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'lkr',
            product_data: { name: serviceName },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/payment-cancelled',
      metadata: {
        uid: bookingData.uid,
        stylistId: bookingData.stylistId,
        serviceId: bookingData.serviceId,
        date: bookingData.date,
        time: bookingData.time,
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return res.json({ id: session.id });
  } catch (err) {
    console.error('❌ Session creation error:', err);
    return res.status(500).json({ message: 'Failed to create payment session' });
  }
};

// ✅ Finalize Booking after Payment Success
export const finalizeBooking = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Missing session ID' });

    const alreadyBooked = await Booking.findOne({ sessionId });
    if (alreadyBooked) {
      console.log('🚫 Booking already finalized for session:', sessionId);
      return res.status(200).json({ message: 'Booking already exists', booking: alreadyBooked });
    }

    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    if (!session || !session.metadata) {
      return res.status(400).json({ message: 'Invalid session or metadata' });
    }

   const { uid, stylistId, serviceId, date: bookingDate, time } = session.metadata;
    if (!uid || !stylistId || !serviceId || !bookingDate || !time) {
      return res.status(400).json({ message: 'Incomplete booking data' });
    }

    // ✅ Find or create user
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        fullName: session.customer_details?.name || 'Guest',
        email: session.customer_details?.email || 'noemail@example.com',
      });
      console.log('👤 New user created:', user._id);
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const startTime = time;
    const endTime = moment(`${bookingDate} ${time}`, 'YYYY-MM-DD HH:mm')
      .add(service.durationMax, 'minutes')
      .format('HH:mm');

    const existing = await Booking.findOne({
      userId: user._id,
      stylistId,
      serviceId,
      date: bookingDate, 
      startTime,
      endTime,
    });

    if (existing) {
      console.log('🚫 Duplicate booking blocked');
      return res.status(200).json({ message: 'Booking already exists', booking: existing });
    }

    const clash = await Booking.findOne({
      stylistId,
      date: bookingDate,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });

    if (clash) {
      console.log('⛔ Time clash with booking:', clash._id);
      return res.status(409).json({ message: 'Time clash detected with another booking' });
    }

   

    const booking = new Booking({
      userId: user._id,
      stylistId,
      serviceId,
    
    date: bookingDate,
      startTime,
      endTime,
      price: service.priceMin,
      sessionId,
    });

    await booking.save();
    console.log('✅ Booking saved:', booking._id);


    const customerPhone = user.phoneNumber;
    // ✅ Send Confirmation Email
    try {
      await sendEmail(
        user.email,
        'Booking Confirmation – Siva Salon',
        `Hello ${user.fullName},

Your booking has been confirmed!

📅 Date: ${bookingDate }
⏰ Time: ${startTime} to ${endTime}
💇 Service: ${service.name}
💵 Fee: Rs. ${service.priceMin}

Thank you for booking with Siva Salon!

Best regards,
Siva Salon Team`
      );
      console.log('📧 Confirmation email sent to', user.email);
    } catch (emailErr) {
      console.error('❌ Failed to send email to customer:', emailErr.message);
    }

   // ———— send notification to stylist ————
   try {
     const stylist = await Stylist.findById(stylistId);
     if (stylist?.email) {
       await sendEmail(
         stylist.email,
         'New Booking Assigned – Siva Salon',
       `Hello ${stylist.name},

A new booking has just been confirmed for you:

📅 Date: ${bookingDate }
⏰ Time: ${startTime} to ${endTime}
💇 Service: ${service.name}
📞 Phone:   ${customerPhone}
👤 Customer: ${user.fullName} (${user.email})

Please prepare to welcome your client!

Best regards,
Siva Salon Team`
      );
       console.log('📧 Notification email sent to stylist', stylist.email);
     }
   } catch (stylistEmailErr) {
     console.error('❌ Failed to send email to stylist:', stylistEmailErr.message);
   }

    return res.status(201).json({ message: 'Booking confirmed', booking });

  } catch (err) {
    console.error('❌ Booking finalization error:', err.message);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};