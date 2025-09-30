import React from 'react';
import useContactForm from './useContactform';

const ContactForm = () => {
  const { formData, errors, handleChange, handleSubmit } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name">Ad *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email">E-posta *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="message">Mesaj *</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && <p>{errors.message}</p>}
      </div>

      <button type="submit">Mesaj Gönder</button>
    </form>
  );
};

export default ContactForm;