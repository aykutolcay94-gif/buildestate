import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Backendurl } from '../../App';

export default function useContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'İsim gereklidir';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Lütfen geçerli bir e-posta adresi girin';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${Backendurl}/api/forms/submit`, formData);
        toast.success('Form başarıyla gönderildi!');
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
      } catch (error) {
        toast.error('Form gönderilirken hata oluştu. Lütfen tekrar deneyin.');
        console.error('Error submitting form:', error);
      }
    } else {
      console.log('Validation errors:', errors); // Debugging log
    }
  };

  return { formData, errors, handleChange, handleSubmit };
}