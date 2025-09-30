import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactInfoItem from './InfoItem';

const contactInfo = [
  {
    icon: Phone,
    title: 'Telefon',
    content: '+1 (234) 567-890',
    link: 'tel:+1234567890',
  },
  {
    icon: Mail,
    title: 'E-posta',
    content: 'support@buildestate.com',
    link: 'mailto:support@buildestate.com',
  },
  {
    icon: MapPin,
    title: 'Adres',
    content: '123 Ana Cadde, Şehir, Ülke',
    link: '#map',
  },
  {
    icon: Clock,
    title: 'Çalışma Saatleri',
    content: 'Pzt-Cum: 09:00 - 18:00',
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-2xl shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-8">Ofisimiz</h2>
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <ContactInfoItem key={index} {...info} />
        ))}
      </div>
    </motion.div>
  );
}