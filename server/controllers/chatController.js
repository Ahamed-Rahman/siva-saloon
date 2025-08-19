import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function chat(req, res) {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    // prepend a system prompt that teaches the bot your salon domain
    const system = {
      role: "system",
      content: `
You are the Siva Salon Assistant. You know:
- all our services and prices (Hair Cut: Rs.1000, Beard Trim: Rs.600, Hair Steamer: Rs.1200, Facial: Rs.1500, Piercing: Rs.2000)
- our stylists (Mr. Suresh, Ms. Shakeeka) and their skills
- how to describe available time‐slots (just say “You can check openings on our booking page”)
Answer user questions about services, prices, stylists, and booking times.
Be concise and helpful.
      `.trim()
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [ system, ...messages ]
    });

    const reply = completion.choices[0].message;
    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: err.message });
  }
}
