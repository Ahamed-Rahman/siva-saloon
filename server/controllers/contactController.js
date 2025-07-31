import Contact from '../models/Contact.js'; // ⬅️ Import the model

export const submitContactForm = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Create and save new contact
    const contact = new Contact({
      name,
      phone,
      email,
      subject,
      message,
    });

    await contact.save(); // ⬅️ Save to MongoDB

    res.status(200).json({ success: true, message: 'Message saved successfully!' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ success: false, message: 'Failed to save contact' });
  }
};
