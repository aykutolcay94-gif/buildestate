import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { backendurl } from '../config/constants';
import { X, Upload } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const PROPERTY_TYPES = ['Ev', 'Apartman', 'Ofis', 'Villa', 'Arsa'];
const AVAILABILITY_TYPES = ['kiralık', 'satılık'];
const AMENITIES = ['Göl Manzarası', 'Şömine', 'Merkezi ısıtma ve klima', 'İskele', 'Havuz', 'Garaj', 'Bahçe', 'Spor Salonu', 'Güvenlik sistemi', 'Ana banyo', 'Misafir banyosu', 'Ev sineması', 'Egzersiz odası/spor salonu', 'Kapalı otopark', 'Yüksek hızlı internet hazır'];

// Arsa için özel sabitler
const ZONING_STATUS = ['İmarlı', 'İmarsız', 'Tarla', 'Bahçe'];
const LAND_TYPES = ['Tarla', 'Bahçe', 'Zeytinlik', 'Bağ', 'Orman', 'Mera'];
const DEED_STATUS = ['Tapulu', 'Tahsis', 'Hisseli', 'Kat Karşılığı'];

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    availability: '',
    amenities: [],
    images: [],
    // Arsa için özel alanlar
    zoningStatus: '',
    landType: '',
    deedStatus: '',
    adaNumber: '',
    parcelNumber: '',
    buildingCoefficient: '',
    // Koordinat alanları
    latitude: '',
    longitude: ''
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ID doğrulaması - demo ID'ler veya geçersiz ID'ler için yönlendirme
    if (!id || id === 'demo1' || id === 'demo2' || id.length < 24) {
      toast.error('Geçersiz ilan ID\'si. Ana sayfaya yönlendiriliyorsunuz.');
      navigate('/list');
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/products/single/${id}`);
        console.log('Response:', response); // Log the response
        if (response.data.success) {
          const property = response.data.property;
          setFormData({
            title: property.title,
            type: property.type,
            price: property.price,
            location: property.location,
            description: property.description,
            beds: property.beds,
            baths: property.baths,
            sqft: property.sqft,
            phone: property.phone,
            availability: property.availability,
            amenities: property.amenities,
            images: property.image,
            // Arsa için özel alanlar
            zoningStatus: property.zoningStatus || '',
            landType: property.landType || '',
            deedStatus: property.deedStatus || '',
            adaNumber: property.adaNumber || '',
            parcelNumber: property.parcelNumber || '',
            buildingCoefficient: property.buildingCoefficient || '',
            // Koordinat alanları
            latitude: property.latitude || '',
            longitude: property.longitude || ''
          });
          setPreviewUrls(property.image);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log('Error fetching property:', error); // Log the error
        toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    };

    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = useCallback((lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  }, []);

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setFormData((prev) => ({
      ...prev,
      images: files
    }));
  };

  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append('id', id);
      formdata.append('title', formData.title);
      formdata.append('type', formData.type);
      formdata.append('price', formData.price);
      formdata.append('location', formData.location);
      formdata.append('description', formData.description);
      formdata.append('beds', formData.beds);
      formdata.append('baths', formData.baths);
      formdata.append('sqft', formData.sqft);
      formdata.append('phone', formData.phone);
      formdata.append('availability', formData.availability);
      formdata.append('amenities', JSON.stringify(formData.amenities));
      
      // Koordinat alanları
      if (formData.latitude) formdata.append('latitude', formData.latitude);
      if (formData.longitude) formdata.append('longitude', formData.longitude);
      
      // Arsa için özel alanlar
      if (formData.type === 'Arsa') {
        formdata.append('zoningStatus', formData.zoningStatus);
        formdata.append('landType', formData.landType);
        formdata.append('deedStatus', formData.deedStatus);
        formdata.append('adaNumber', formData.adaNumber);
        formdata.append('parcelNumber', formData.parcelNumber);
        formdata.append('buildingCoefficient', formData.buildingCoefficient);
      }
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendurl}/api/products/update`, formdata);
      if (response.data.success) {
        toast.success('Emlak başarıyla güncellendi');
        navigate('/list');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Emlak Güncelle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Emlak Başlığı
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Emlak Türü
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Tür Seçin</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                  Müsaitlik
                </label>
                <select
                  id="availability"
                  name="availability"
                  required
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Müsaitlik Seçin</option>
                  {AVAILABILITY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Fiyat
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Konum
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Harita Konum Seçici */}
            <div className="col-span-2">
              <LocationPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Arsa değilse yatak odası ve banyo alanlarını göster */}
            {formData.type !== 'Arsa' ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
                    Yatak Odası
                  </label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    required
                    min="0"
                    value={formData.beds}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
                    Banyo
                  </label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    required
                    min="0"
                    value={formData.baths}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                    Metrekare
                  </label>
                  <input
                    type="number"
                    id="sqft"
                    name="sqft"
                    required
                    min="0"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              /* Arsa ise özel alanları göster */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zoningStatus" className="block text-sm font-medium text-gray-700">
                      İmar Durumu
                    </label>
                    <select
                      id="zoningStatus"
                      name="zoningStatus"
                      value={formData.zoningStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Seçiniz</option>
                      {ZONING_STATUS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="landType" className="block text-sm font-medium text-gray-700">
                      Arsa Türü
                    </label>
                    <select
                      id="landType"
                      name="landType"
                      value={formData.landType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Seçiniz</option>
                      {LAND_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="deedStatus" className="block text-sm font-medium text-gray-700">
                      Tapu Durumu
                    </label>
                    <select
                      id="deedStatus"
                      name="deedStatus"
                      value={formData.deedStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Seçiniz</option>
                      {DEED_STATUS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                      Metrekare
                    </label>
                    <input
                      type="number"
                      id="sqft"
                      name="sqft"
                      required
                      min="0"
                      value={formData.sqft}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="adaNumber" className="block text-sm font-medium text-gray-700">
                      Ada No
                    </label>
                    <input
                      type="text"
                      id="adaNumber"
                      name="adaNumber"
                      value={formData.adaNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="parcelNumber" className="block text-sm font-medium text-gray-700">
                      Parsel No
                    </label>
                    <input
                      type="text"
                      id="parcelNumber"
                      name="parcelNumber"
                      value={formData.parcelNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="buildingCoefficient" className="block text-sm font-medium text-gray-700">
                      İmar Katsayısı
                    </label>
                    <input
                      type="number"
                      id="buildingCoefficient"
                      name="buildingCoefficient"
                      step="0.01"
                      min="0"
                      value={formData.buildingCoefficient}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                İletişim Telefonu
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Olanaklar
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    formData.amenities.includes(amenity)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emlak Görselleri (Maksimum 4)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Önizleme ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Görsel yükle</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF 10MB'a kadar</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Güncelleniyor...' : 'Emlak Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;