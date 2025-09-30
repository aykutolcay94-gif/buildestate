import React from 'react';
import { motion } from 'framer-motion';
import { Home, Globe, Headphones, List } from 'lucide-react';

const benefits = [
  {
    icon: Home,
    title: 'Doğrulanmış Emlaklar',
    description: 'Her emlak kalite ve güvenlik açısından kapsamlı şekilde doğrulanır.',
  },
  {
    icon: Globe,
    title: 'Kullanıcı Dostu Platform',
    description: 'Sezgisel navigasyon ve sorunsuz emlak yönetimi.',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Tüm sorularınız için günün her saati yardım.',
  },
  {
    icon: List,
    title: 'Kapsamlı İlanlar',
    description: 'Her ihtiyaç ve bütçeye uygun geniş emlak yelpazesi.',
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Neden BuildEstate'i Seçmelisiniz?</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Kapsamlı emlak çözümlerimizle farkı deneyimleyin
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:rotate-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-lg">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
