import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { backendurl } from '../config/constants';
import { Upload, X } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';

const PROPERTY_TYPES = ['Ev', 'Apartman', 'Ofis', 'Villa', 'Arsa'];
const AVAILABILITY_TYPES = ['kiralık', 'satılık'];

// Arsa için özel alanlar
const ZONING_STATUS = ['İmarlı', 'İmarsız'];
const LAND_TYPES = ['Bahçe', 'Tarla', 'Zeytinlik', 'Bağ', 'Orman', 'Diğer'];
const DEED_STATUS = ['Kat Mülkiyeti', 'Kat İrtifakı', 'Arsa Tapusu'];

const PropertyForm = () => {
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
  const [newAmenity, setNewAmenity] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formdata = new FormData();
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
      formData.amenities.forEach((amenity, index) => {
        formdata.append(`amenities[${index}]`, amenity);
      });
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });

      const response = await axios.post(`${backendurl}/api/products/add`, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
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
          zoningStatus: '',
          landType: '',
          deedStatus: '',
          adaNumber: '',
          parcelNumber: '',
          buildingCoefficient: '',
          latitude: '',
          longitude: ''
        });
        setPreviewUrls([]);
        toast.success('Emlak başarıyla eklendi');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Yeni Emlak Ekle</h2>
        
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

            {/* Dinamik alanlar - Arsa değilse normal alanları göster */}
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
              /* Arsa için özel alanlar */
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zoningStatus" className="block text-sm font-medium text-gray-700">
                      İmar Durumu
                    </label>
                    <select
                      id="zoningStatus"
                      name="zoningStatus"
                      required
                      value={formData.zoningStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">İmar Durumu Seçin</option>
                      {ZONING_STATUS.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
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
                      required
                      value={formData.landType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Arsa Türü Seçin</option>
                      {LAND_TYPES.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="deedStatus" className="block text-sm font-medium text-gray-700">
                      Tapu Durumu
                    </label>
                    <select
                      id="deedStatus"
                      name="deedStatus"
                      required
                      value={formData.deedStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Tapu Durumu Seçin</option>
                      {DEED_STATUS.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="buildingCoefficient" className="block text-sm font-medium text-gray-700">
                      İmar Katsayısı
                    </label>
                    <input
                      type="number"
                      id="buildingCoefficient"
                      name="buildingCoefficient"
                      step="0.1"
                      min="0"
                      value={formData.buildingCoefficient}
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
              </>
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
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${index}`}
                    name="amenities"
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor={`amenity-${index}`} className="ml-2 block text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Yeni olanak ekle"
                className="mt-1 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Ekle
              </button>
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
              {loading ? 'Gönderiliyor...' : 'Emlak Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;