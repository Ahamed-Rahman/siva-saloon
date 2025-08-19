import OpenAI from 'openai';
import axios from 'axios';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Stylist from '../models/Stylist.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 1) Define function schemas for GPT
export const functions = [
  {
    name: 'getServiceInfo',
    description: 'Fetch details (price/duration) for a named service',
    parameters: {
      type: 'object',
      properties: {
        serviceName: { type: 'string', description: 'e.g. Hair Cut' }
      },
      required: ['serviceName']
    }
  },
  {
    name: 'listAvailableTimes',
    description: 'List unavailable 15-min slots for a stylist on a date',
    parameters: {
      type: 'object',
      properties: {
        stylistId: { type: 'string' },
        date: { type: 'string', description: 'YYYY-MM-DD' }
      },
      required: ['stylistId','date']
    }
  }
];

// 2) Implementations
export async function getServiceInfo({ serviceName }) {
  const svc = await Service.findOne({ name: new RegExp(`^${serviceName}$`, 'i') });
  if (!svc) return { error: 'Service not found' };
  return {
    name: svc.name,
    price: svc.price,
    durationMin: svc.durationMin,
    durationMax: svc.durationMax
  };
}

export async function listAvailableTimes({ stylistId, date }) {
  // call your existing unavailable-times endpoint
  const { data } = await axios.post(
    'http://localhost:' + process.env.PORT + '/api/bookings/unavailable',
    { stylistId, date }
  );
  return { unavailableTimes: data.unavailableTimes };
}

// 3) Dispatch helper
export async function handleChat(message) {
  // 1. Ask GPT which function (if any)
  const res1 = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `You are Siva Salon’s virtual assistant.` },
      { role: 'user', content: message }
    ],
    functions,
    function_call: 'auto'
  });

  const choice = res1.choices[0].message;
  // 2. If GPT wants a function
  if (choice.function_call) {
    const { name, arguments: argsJSON } = choice.function_call;
    const args = JSON.parse(argsJSON);
    let fnResult;
    if (name === 'getServiceInfo') fnResult = await getServiceInfo(args);
    if (name === 'listAvailableTimes') fnResult = await listAvailableTimes(args);

    // 3. Send function result back for final natural answer
    const res2 = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are Siva Salon’s virtual assistant.` },
        { role: 'user', content: message },
        choice,
        { role: 'function', name, content: JSON.stringify(fnResult) }
      ]
    });
    return res2.choices[0].message.content;
  }

  // 4. Or just normal reply
  return choice.content;
}
