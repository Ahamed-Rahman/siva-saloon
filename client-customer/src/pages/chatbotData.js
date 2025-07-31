const chatbotResponses = [
  {
    keywords: ['price', 'cost', 'how much', 'rate'],
    response: `
Here are our service prices:
- Hair Cut: Rs. 1000
- Beard Trim: Rs. 600
- Hair Steamer: Rs. 1200
- Facial: Rs. 1500
- Piercing: Rs. 2000
\nIf you need help booking a service, just ask!
    `
  },
  {
    keywords: ['stylist', 'barber', 'hairdresser', 'available stylists'],
    response: `
We have 2 experienced stylists:
1. **Mr. Suresh** – Specialist in hair styling, beard trims, and facials. 5+ years experience.
2. **Ms. Shakeeka** – Expert in piercing, hair steaming, and skincare. Friendly and professional.
\nYou can choose your stylist during booking.
    `
  },

  {
  keywords: ['service', 'services', 'what services', 'available services'],
  response: `
We offer the following services:
- Hair Cut ✂️
- Beard Trim 🧔
- Hair Steamer 💨
- Facial 💆
- Piercing 💎

You can view more details and book under the "Services" page.
  `
},

  {
    keywords: ['booking', 'appointment'],
    response: 'You can book an appointment by visiting the "Services" section and selecting your preferred stylist and time slot.'
  },
  {
    keywords: ['help', 'support'],
    response: 'Sure! How can I assist you today? You can ask about pricing, stylists, or booking help.'
  },
  {
    keywords: ['hello', 'hi'],
    response: 'Hi there! 👋 I’m your salon assistant. Ask me anything about services, prices, or bookings!'
  }
];

export default chatbotResponses;
