import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  Trash2, 
  Filter,
  Search,
  SortAsc,
  Grid,
  List,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const SavedProperties = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'price', 'name'
  const [filterType, setFilterType] = useState('all'); // 'all', 'sale', 'rent'

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchSavedProperties = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock saved properties data
        const mockData = [
          {
            id: 1,
            title: "Lüks Villa - Deniz Manzaralı",
            location: "Antalya, Konyaaltı",
            price: 2500000,
            type: "sale",
            bedrooms: 4,
            bathrooms: 3,
            area: 250,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
            savedDate: "2024-01-15",
            description: "Deniz manzaralı lüks villa, özel havuz ve bahçe ile."
          },
          {
            id: 2,
            title: "Modern Daire - Şehir Merkezi",
            location: "İstanbul, Şişli",
            price: 8500,
            type: "rent",
            bedrooms: 2,
            bathrooms: 1,
            area: 120,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            savedDate: "2024-01-10",
            description: "Şehir merkezinde modern daire, metro yakını."
          },
          {
            id: 3,
            title: "Bahçeli Müstakil Ev",
            location: "Ankara, Çankaya",
            price: 1800000,
            type: "sale",
            bedrooms: 3,
            bathrooms: 2,
            area: 180,
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
            savedDate: "2024-01-05",
            description: "Geniş bahçeli müstakil ev, sakin mahalle."
          }
        ];
        
        setSavedProperties(mockData);
      } catch (error) {
        toast.error('Kayıtlı emlaklar yüklenirken hata oluştu');
        console.error('Error fetching saved properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleRemoveProperty = async (propertyId) => {
    try {
      // Simulate API call to remove property
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSavedProperties(prev => prev.filter(property => property.id !== propertyId));
      toast.success('Emlak kayıtlı listesinden kaldırıldı');
    } catch (error) {
      toast.error('Emlak kaldırılırken hata oluştu');
      console.error('Error removing property:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredAndSortedProperties = savedProperties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || property.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.savedDate) - new Date(a.savedDate);
      }
    });

  const PropertyCard = ({ property, isListView = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isListView ? 'flex' : ''
      }`}
    >
      <div className={`relative ${isListView ? 'w-64 flex-shrink-0' : ''}`}>
        <img
          src={property.image}
          alt={property.title}
          className={`w-full object-cover ${isListView ? 'h-full' : 'h-48'}`}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
            property.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
          </span>
        </div>
        <button
          onClick={() => handleRemoveProperty(property.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            {property.type === 'rent' && (
              <div className="text-sm text-gray-500">/ay</div>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.area} m²</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Kaydedilme: {formatDate(property.savedDate)}</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/properties/single/${property.id}`}
              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Görüntüle</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kayıtlı Emlaklar</h1>
          <p className="text-lg text-gray-600">
            Beğendiğiniz {savedProperties.length} emlak burada
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Emlak ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                <option value="sale">Satılık</option>
                <option value="rent">Kiralık</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Kayıt Tarihi</option>
                <option value="price">Fiyat</option>
                <option value="name">İsim</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Properties Grid/List */}
        {filteredAndSortedProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'Arama kriterlerinize uygun emlak bulunamadı' : 'Henüz kayıtlı emlak yok'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Farklı arama kriterleri deneyebilirsiniz'
                : 'Beğendiğiniz emlakları kaydetmek için kalp ikonuna tıklayın'
              }
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Emlakları Keşfet
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredAndSortedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PropertyCard property={property} isListView={viewMode === 'list'} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;