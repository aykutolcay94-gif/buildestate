import React, { createContext, useContext, useState, useEffect } from 'react';

// Dil çevirileri
const translations = {
  tr: {
    // Navbar
    home: 'Ana Sayfa',
    properties: 'Emlaklar',
    about: 'Hakkımızda',
    contact: 'İletişim',
    login: 'Giriş Yap',
    signup: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    profile: 'Profil',
    savedProperties: 'Kayıtlı Emlaklar',
    signIn: 'Giriş Yap',
    signOut: 'Çıkış Yap',
    welcomeHome: 'Hoş geldiniz',
    
    // Hero Section
    findYourDreamHome: 'Hayalinizdeki Evi Bulun',
    discoverExceptionalProperties: 'Prime lokasyonlarda istisnai emlakları keşfedin',
    searchProperties: 'Emlak Ara',
    apartments: 'Daireler',
    houses: 'Evler',
    villas: 'Villalar',
    studios: 'Stüdyolar',
    happyCustomers: 'Mutlu Müşteri',
    propertiesListed: 'Listelenen Emlak',
    averageRating: 'Ortalama Puan',
    verifiedProperties: 'Doğrulanmış Emlak',
    
    // Features
    perfectHome: 'mükemmel ev',
    dreamHome: 'Hayalinizdeki Ev?',
    joinThousands: 'Premium özelliklerimiz ve kişiselleştirilmiş hizmetimizle mükemmel evini bulan binlerce memnun müşteriye katılın.',
    browseProperties: 'Emlakları İncele',
    contactExpert: 'Uzmanla İletişim',
    
    // Properties
    exploreProperties: 'Emlakları Keşfedin',
    featuredProperties: 'Öne Çıkan Emlaklar',
    handpickedSelection: 'Yaşam tarzı ihtiyaçlarınıza uygun premium emlakların özenle seçilmiş koleksiyonunu keşfedin',
    allProperties: 'Tüm Emlaklar',
    noPropertiesAvailable: 'Emlak mevcut değil',
    noPropertiesFound: 'Bu kategoride emlak bulunamadı.',
    viewAllProperties: 'Tüm Emlakları Görüntüle',
    browseAllProperties: 'Tüm Emlakları İncele',
    discoverComplete: 'Premium emlakların tam koleksiyonunu keşfedin',
    
    // Steps
    howItWorks: 'Nasıl Çalışır',
    
    // Testimonials
    discoverWhy: 'Binlerce ev sahibinin mükemmel emlakını bulmak için BuildEstate\'e neden güvendiğini keşfedin.',
    
    // Blog
    joinReaders: 'Emlak trendleri hakkında bilgi sahibi olan binlerce okuyucuya katılın',
    
    // Footer
    trustedPartner: 'Mükemmel evi bulmanızda güvenilir ortağınız. Emlak avcılığını basit, verimli ve benzersiz ihtiyaçlarınıza uygun hale getiriyoruz.',
    quickLinks: 'Hızlı Bağlantılar',
    contactUs: 'Bize Ulaşın',
    
    // Contact
    haveQuestions: 'Emlaklar hakkında sorularınız mı var? Mükemmel evinizi bulma konusunda yardıma mı ihtiyacınız var?',
    
    // Auth
    signInToAccount: 'Güvenli hesabınıza giriş yapın',
    signingIn: 'Giriş yapılıyor...',
    backToLogin: 'Girişe geri dön',
    returnToLogin: 'Girişe dön',
    
    // Property Details
    backToProperties: 'Emlaklar\'a Geri Dön',
    contactDetails: 'İletişim Detayları',
    
    // AI Agent
    backHome: 'Ana Sayfaya Dön',
    backToHome: 'Ana Sayfaya Dön',
    searchingForProperties: 'Emlaklar aranıyor...',
    findProperties: 'Emlak Bul',
    
    // Not Found
    pageNotFound: 'Sayfa Bulunamadı',
    oopsPageNotFound: 'Oops! Sayfa Bulunamadı',
    pageNotFoundDescription: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.',
    returnHome: 'Ana Sayfaya Dön',
    goBack: 'Geri Dön',
    learnAboutUs: 'Hakkımızda Öğren',
    dontWorry: 'Merak etmeyin, eve dönüş yolunuzu bulmanıza yardımcı olacağız.',
    exploreOurProperties: 'Emlakları Keşfedin',
    contactSupport: 'Destek ile İletişim',
    searchOurSite: 'Sitemizi Arayın',
    orExplorePopularSections: 'Veya bu popüler bölümleri keşfedin:',
    
    // Loading
    loadingProperties: 'Emlaklar Yükleniyor',
    findingPerfectHomes: 'Tercihlerinize uygun mükemmel evleri buluyoruz...',
    pleaseWait: 'Sizin için emlakları seçerken lütfen bekleyin',
    
    // Errors
    failedToFetch: 'Emlaklar getirilemedi. Lütfen tekrar deneyin.',
    
    // Common
    loading: 'Yükleniyor...',
    search: 'Ara',
    filter: 'Filtrele',
    all: 'Tümü',
    
    // Property Types
    apartment: 'Daire',
    house: 'Ev',
    villa: 'Villa',
    studio: 'Stüdyo',
    
    // Buttons
    viewMore: 'Daha Fazla Görüntüle',
    learnMore: 'Daha Fazla Öğren',
    getStarted: 'Başlayın',
    tryAgain: 'Tekrar Dene',
    
    // Schedule Viewing
    pleaseLogin: 'Görüntüleme planlamak için lütfen giriş yapın',
    specificRequirements: 'Emlak hakkında özel gereksinimleriniz veya sorularınız...',
    agentContact: 'Acentelerimizden biri detayları onaylamak için sizinle iletişime geçecek.',
  },
  en: {
    // Navbar
    home: 'Home',
    properties: 'Properties',
    about: 'About Us',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    savedProperties: 'Saved Properties',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    welcomeHome: 'Welcome home',
    
    // Hero Section
    findYourDreamHome: 'Find Your Dream Home',
    discoverExceptionalProperties: 'Discover exceptional properties in prime locations with our',
    searchProperties: 'Search Properties',
    apartments: 'Daireler',
    houses: 'Evler',
    villas: 'Villalar',
    studios: 'Studios',
    happyCustomers: 'Happy Customers',
    propertiesListed: 'Properties Listed',
    averageRating: 'Average Rating',
    verifiedProperties: 'Verified Properties',
    
    // Features
    perfectHome: 'perfect home',
    dreamHome: 'Dream Home?',
    joinThousands: 'Join thousands of satisfied customers who found their perfect home with our premium features and personalized service.',
    browseProperties: 'Browse Properties',
    contactExpert: 'Contact Expert',
    
    // Properties
    exploreProperties: 'Mülkleri Keşfedin',
    featuredProperties: 'Öne Çıkan Mülkler',
    handpickedSelection: 'Yaşam tarzı ihtiyaçlarınıza uygun olarak tasarlanmış premium mülklerin özenle seçilmiş koleksiyonumuzu keşfedin',
    allProperties: 'Tüm Mülkler',
    noPropertiesAvailable: 'Mülk mevcut değil',
    noPropertiesFound: 'Bu kategoride mülk bulunamadı.',
    viewAllProperties: 'Tüm Mülkleri Görüntüle',
    browseAllProperties: 'Tüm Mülkleri İncele',
    discoverComplete: 'Premium mülklerin tam koleksiyonumuzu keşfedin',
    
    // Steps
    howItWorks: 'Nasıl Çalışır',
    
    // Testimonials
    discoverWhy: 'Discover why thousands of homeowners trust BuildEstate to find their perfect property.',
    
    // Blog
    joinReaders: 'Join thousands of readers staying informed about real estate trends',
    
    // Footer
    trustedPartner: 'Your trusted partner in finding the perfect home. We make property hunting simple, efficient, and tailored to your unique needs with cutting-edge technology and personalized service.',
    quickLinks: 'Quick Links',
    contactUs: 'Contact Us',
    
    // Contact
    haveQuestions: 'Have questions about our properties? Need assistance with finding your perfect home?',
    
    // Auth
    signInToAccount: 'Sign in to your secure account',
    signingIn: 'Signing in...',
    backToLogin: 'Back to login',
    returnToLogin: 'Return to Login',
    
    // Property Details
    backToProperties: 'Back to Properties',
    contactDetails: 'Contact Details',
    
    // AI Agent
    backHome: 'Back Home',
    backToHome: 'Back to Home',
    searchingForProperties: 'Searching for Properties...',
    findProperties: 'Find Properties',
    
    // Not Found
    pageNotFound: 'Page Not Found',
    oopsPageNotFound: 'Oops! Page Not Found',
    pageNotFoundDescription: 'The page you are looking for does not exist or may have been moved.',
    returnHome: 'Return Home',
    goBack: 'Go Back',
    learnAboutUs: 'Learn About Us',
    dontWorry: "Don't worry, we'll help you find your way back home.",
    exploreOurProperties: 'Explore Our Properties',
    contactSupport: 'Contact Support',
    searchOurSite: 'Search Our Site',
    orExplorePopularSections: 'Or explore these popular sections:',
    
    // Loading
    loadingProperties: 'Loading Properties',
    findingPerfectHomes: "We're finding the perfect homes that match your preferences...",
    pleaseWait: 'Please wait while we curate properties for you',
    
    // Errors
    noPropertiesFound: 'No properties found',
    failedToFetch: 'Failed to fetch properties. Please try again later.',
    
    // Common
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    
    // Property Types
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    studio: 'Studio',
    
    // Buttons
    viewMore: 'View More',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    tryAgain: 'Try Again',
    
    // Schedule Viewing
    pleaseLogin: 'Please login to schedule a viewing',
    specificRequirements: 'Any specific requirements or questions about the property...',
    agentContact: 'One of our agents will contact you to confirm the details.',
  }
};

// Language Context
const LanguageContext = createContext();

// Language Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Tarayıcı dilini kontrol et, varsayılan olarak Türkçe
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      return savedLanguage;
    }
    
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('tr')) {
      return 'tr';
    }
    return 'tr'; // Varsayılan olarak Türkçe
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isEnglish: language === 'en',
    isTurkish: language === 'tr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;