import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Eye,
  Moon,
  Sun,
  Globe,
  Mail,
  Phone,
  Lock,
  Trash2,
  Save,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('notifications');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    propertyAlerts: true,
    priceDropAlerts: true,
    newListingAlerts: false,
    marketingEmails: false,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', // 'public', 'private', 'friends'
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    dataCollection: true,
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light', // 'light', 'dark', 'auto'
    language: 'tr', // 'tr', 'en'
    currency: 'TRY', // 'TRY', 'USD', 'EUR'
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30, // minutes
  });

  const handleNotificationChange = (key, value) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would save settings to backend
      const settingsData = {
        notifications,
        privacy,
        appearance,
        security
      };
      
      console.log('Saving settings:', settingsData);
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      toast.error('Ayarlar kaydedilirken hata oluştu');
      console.error('Settings save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Hesabınız silme işlemi başlatıldı');
      logout();
    } catch (error) {
      toast.error('Hesap silinirken hata oluştu');
      console.error('Account deletion error:', error);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Eye },
    { id: 'appearance', label: 'Görünüm', icon: appearance.theme === 'dark' ? Moon : Sun },
    { id: 'security', label: 'Güvenlik', icon: Shield },
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bildirim Tercihleri</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">E-posta Bildirimleri</label>
              <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
            </div>
            <ToggleSwitch
              checked={notifications.emailNotifications}
              onChange={(value) => handleNotificationChange('emailNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Bildirimleri</label>
              <p className="text-sm text-gray-500">Acil durumlar için SMS alın</p>
            </div>
            <ToggleSwitch
              checked={notifications.smsNotifications}
              onChange={(value) => handleNotificationChange('smsNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Push Bildirimleri</label>
              <p className="text-sm text-gray-500">Tarayıcı bildirimleri alın</p>
            </div>
            <ToggleSwitch
              checked={notifications.pushNotifications}
              onChange={(value) => handleNotificationChange('pushNotifications', value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emlak Bildirimleri</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Emlak Uyarıları</label>
              <p className="text-sm text-gray-500">Kayıtlı emlaklar hakkında güncellemeler</p>
            </div>
            <ToggleSwitch
              checked={notifications.propertyAlerts}
              onChange={(value) => handleNotificationChange('propertyAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Fiyat Düşüş Uyarıları</label>
              <p className="text-sm text-gray-500">Takip ettiğiniz emlakların fiyatı düştüğünde</p>
            </div>
            <ToggleSwitch
              checked={notifications.priceDropAlerts}
              onChange={(value) => handleNotificationChange('priceDropAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Yeni İlan Uyarıları</label>
              <p className="text-sm text-gray-500">Arama kriterlerinize uygun yeni ilanlar</p>
            </div>
            <ToggleSwitch
              checked={notifications.newListingAlerts}
              onChange={(value) => handleNotificationChange('newListingAlerts', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Pazarlama E-postaları</label>
              <p className="text-sm text-gray-500">Özel teklifler ve kampanyalar</p>
            </div>
            <ToggleSwitch
              checked={notifications.marketingEmails}
              onChange={(value) => handleNotificationChange('marketingEmails', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil Gizliliği</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profil Görünürlüğü</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="public">Herkese Açık</option>
              <option value="private">Özel</option>
              <option value="friends">Sadece Arkadaşlar</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">E-posta Adresini Göster</label>
              <p className="text-sm text-gray-500">Diğer kullanıcılar e-posta adresinizi görebilir</p>
            </div>
            <ToggleSwitch
              checked={privacy.showEmail}
              onChange={(value) => handlePrivacyChange('showEmail', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Telefon Numarasını Göster</label>
              <p className="text-sm text-gray-500">Diğer kullanıcılar telefon numaranızı görebilir</p>
            </div>
            <ToggleSwitch
              checked={privacy.showPhone}
              onChange={(value) => handlePrivacyChange('showPhone', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Mesaj Almaya İzin Ver</label>
              <p className="text-sm text-gray-500">Diğer kullanıcılar size mesaj gönderebilir</p>
            </div>
            <ToggleSwitch
              checked={privacy.allowMessages}
              onChange={(value) => handlePrivacyChange('allowMessages', value)}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Veri Toplama</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Analitik Veri Toplama</label>
              <p className="text-sm text-gray-500">Hizmetlerimizi geliştirmek için kullanım verilerini topla</p>
            </div>
            <ToggleSwitch
              checked={privacy.dataCollection}
              onChange={(value) => handlePrivacyChange('dataCollection', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tema</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Açık', icon: Sun },
            { value: 'dark', label: 'Koyu', icon: Moon },
            { value: 'auto', label: 'Otomatik', icon: SettingsIcon },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleAppearanceChange('theme', value)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                appearance.theme === value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dil ve Bölge</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dil</label>
            <select
              value={appearance.language}
              onChange={(e) => handleAppearanceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Para Birimi</label>
            <select
              value={appearance.currency}
              onChange={(e) => handleAppearanceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TRY">Türk Lirası (₺)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Güvenliği</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">İki Faktörlü Doğrulama</label>
              <p className="text-sm text-gray-500">Hesabınız için ekstra güvenlik katmanı</p>
            </div>
            <ToggleSwitch
              checked={security.twoFactorAuth}
              onChange={(value) => handleSecurityChange('twoFactorAuth', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Giriş Uyarıları</label>
              <p className="text-sm text-gray-500">Yeni cihazdan giriş yapıldığında bildirim al</p>
            </div>
            <ToggleSwitch
              checked={security.loginAlerts}
              onChange={(value) => handleSecurityChange('loginAlerts', value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Oturum Zaman Aşımı</label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 dakika</option>
              <option value={30}>30 dakika</option>
              <option value={60}>1 saat</option>
              <option value={120}>2 saat</option>
              <option value={0}>Hiçbir zaman</option>
            </select>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Şifre ve Hesap</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Lock className="w-4 h-4" />
            <span>Şifreyi Değiştir</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hesabı Sil</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ayarlar</h1>
          <p className="text-lg text-gray-600">Hesap tercihlerinizi ve ayarlarınızı yönetin</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'privacy' && renderPrivacyTab()}
              {activeTab === 'appearance' && renderAppearanceTab()}
              {activeTab === 'security' && renderSecurityTab()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Hesabı Sil</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecek.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Evet, Sil</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>İptal</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;