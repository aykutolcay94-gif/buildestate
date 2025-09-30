import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Amacımız</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold">Misyonumuz</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Tüm kullanıcılar için şeffaf ve verimli bir emlak kiralama deneyimi sağlamak. 
              Mükemmel evinizi bulma sürecini mümkün olduğunca sorunsuz hale getirmeye çalışırken, 
              en yüksek hizmet ve dürüstlük standartlarını koruyoruz.
            </p>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold">Vizyonumuz</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Milyonlarca kullanıcının mükemmel evini kolaylık ve güvenle bulmasını sağlamak. 
              Emlak aramasının sadece yaşayacak bir yer bulmakla ilgili olmadığı, 
              aynı zamanda ait olunacak bir topluluk keşfetmekle ilgili olduğu bir gelecek hayal ediyoruz.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}