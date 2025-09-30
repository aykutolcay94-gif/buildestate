import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = ({ className = "" }) => {
  const { language, toggleLanguage, isTurkish, isEnglish } = useLanguage();

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:text-blue-100"
        aria-label="Dil değiştir / Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {isTurkish ? 'TR' : 'EN'}
        </span>
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isTurkish ? 'bg-red-500' : 'bg-white/40'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isEnglish ? 'bg-blue-500' : 'bg-white/40'}`} />
        </div>
      </button>
    </motion.div>
  );
};

// Navbar için özel stil
export const NavbarLanguageSwitcher = () => {
  const { language, toggleLanguage, isTurkish, isEnglish } = useLanguage();

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 text-white hover:text-blue-100 shadow-lg"
        aria-label="Dil değiştir / Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {isTurkish ? 'TR' : 'EN'}
        </span>
        <div className="flex space-x-1">
          <motion.div 
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${isTurkish ? 'bg-red-500' : 'bg-white/40'}`}
            animate={{ scale: isTurkish ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div 
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${isEnglish ? 'bg-blue-500' : 'bg-white/40'}`}
            animate={{ scale: isEnglish ? 1.2 : 1 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </button>
    </motion.div>
  );
};

// Footer için özel stil
export const FooterLanguageSwitcher = () => {
  const { language, toggleLanguage, isTurkish, isEnglish } = useLanguage();

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:text-gray-200"
        aria-label="Dil değiştir / Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">
          {isTurkish ? 'Türkçe' : 'English'}
        </span>
        <div className="flex space-x-1">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isTurkish ? 'bg-red-500' : 'bg-white/40'}`} />
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isEnglish ? 'bg-blue-500' : 'bg-white/40'}`} />
        </div>
      </button>
    </motion.div>
  );
};

export default LanguageSwitcher;