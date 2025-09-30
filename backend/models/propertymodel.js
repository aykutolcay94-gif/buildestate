import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: { 
    type: [String],
    required: true
 },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
    required: true,
  },
  sqft: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: Array,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  // Arsa için özel alanlar
  zoningStatus: {
    type: String,
    required: false, // Sadece arsa için gerekli
  },
  landType: {
    type: String,
    required: false, // Sadece arsa için gerekli
  },
  deedStatus: {
    type: String,
    required: false, // Sadece arsa için gerekli
  },
  adaNumber: {
    type: String,
    required: false, // Sadece arsa için gerekli
  },
  parcelNumber: {
    type: String,
    required: false, // Sadece arsa için gerekli
  },
  buildingCoefficient: {
    type: Number,
    required: false, // Sadece arsa için gerekli
  },
  // Harita koordinatları
  latitude: {
    type: Number,
    required: false, // Koordinat bilgisi opsiyonel
  },
  longitude: {
    type: Number,
    required: false, // Koordinat bilgisi opsiyonel
  },
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
