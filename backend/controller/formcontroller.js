import Form from '../models/formmodel.js';

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body; // Debugging log

    const newForm = new Form({
      name,
      email,
      phone,
      message,
    });

    const savedForm = await newForm.save();
    

    res.json({ message: 'Form başarıyla gönderildi' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};