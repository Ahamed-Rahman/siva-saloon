const chatbotResponses = [
  {
    keywords: ['service price', 'cost', 'how much', 'rate'],
    response: `
Here are our service prices:
- Hair Cut: Rs. 1000
- Beard Trim: Rs. 600
- Hair Steamer: Rs. 1200
- Facial: Rs. 1500
- Piercing: Rs. 2000

If you need help booking a service, just ask!
    `
  },

  {
    keywords: ['hair cut', 'haircut'],
    response: `The price for a Hair Cut is Rs. 1000.`,
  },
  {
    keywords: ['beard trim'],
    response: `The price for a Beard Trim is Rs. 600.`,
  },
  {
    keywords: ['hair steamer'],
    response: `The price for a Hair Steamer is Rs. 1200.`,
  },
  {
    keywords: ['facial'],
    response: `The price for a Facial is Rs. 1500.`,
  },
  {
    keywords: ['piercing'],
    response: `The price for a Piercing is Rs. 2000.`,
  },

  {
    keywords: ['stylist', 'barber', 'hairdresser', 'available stylists'],
    response: `
We have 2 experienced stylists:
1. **Mr. Suresh** – Specialist in hair styling, beard trims, and facials. 5+ years experience.
2. **Ms. Shakeeka** – Expert in piercing, hair steaming, and skincare. Friendly and professional.

You can choose your stylist during booking.
    `
  },
  {
    // Specific lookup for Suresh
    keywords: ['suresh'],
    response: `
Yes! Mr. Suresh is one of our top stylists.  
He’s great at haircuts, beard trims & facials—5+ years experience.
    `
  },
  {
    // Specific lookup for Shakeeka
    keywords: ['siva'],
    response: `
Absolutely—Mr. siva is our piercing & skincare expert with a friendly touch.
He also does hair steaming and styling beautifully.
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
    response: `You can book an appointment by visiting the "Services" section and selecting your preferred stylist and time slot.`
  },
  {
    keywords: ['help', 'support'],
    response: `Sure! How can I assist you today? You can ask about pricing, stylists, or booking help.`
  },
  {
    keywords: ['hello', 'hi'],
    response: `Hi there! 👋 I’m your salon assistant. Ask me anything about services, prices, or bookings!`
  }
];

export default chatbotResponses;
