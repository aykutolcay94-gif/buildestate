import fs from "fs";
import mongoose from "mongoose";
import imagekit from "../config/imagekit.js";
import Property from "../models/propertymodel.js";

// Demo mode storage for properties
let demoPropertiesStorage = [];

const addproperty = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, zoningStatus, landType, deedStatus, adaNumber, parcelNumber, buildingCoefficient, latitude, longitude } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit if available, otherwise save locally
        let imageUrls = [];
        
        if (imagekit && images.length > 0) {
            try {
                imageUrls = await Promise.all(
                    images.map(async (item) => {
                        const result = await imagekit.upload({
                            file: fs.readFileSync(item.path),
                            fileName: item.originalname,
                            folder: "Property",
                        });
                        fs.unlink(item.path, (err) => {
                            if (err) console.log("Error deleting the file: ", err);
                        });
                        return result.url;
                    })
                );
            } catch (error) {
                console.log("ImageKit upload error:", error);
                // Save locally if ImageKit fails
                imageUrls = images.map(item => {
                    const fileName = `${Date.now()}_${item.originalname}`;
                    const newPath = `uploads/${fileName}`;
                    
                    // Move file to uploads directory
                    fs.renameSync(item.path, newPath);
                    
                    return `http://localhost:4000/${newPath}`;
                });
            }
        } else {
            // Save images locally when ImageKit is not available
            if (images.length > 0) {
                imageUrls = images.map(item => {
                    const fileName = `${Date.now()}_${item.originalname}`;
                    const newPath = `uploads/${fileName}`;
                    
                    // Move file to uploads directory
                    fs.renameSync(item.path, newPath);
                    
                    return `http://localhost:4000/${newPath}`;
                });
            } else {
                // Use placeholder images only if no images are uploaded
                imageUrls = [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ];
            }
        }

        // Create a new product
        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            amenities,
            image: imageUrls,
            phone,
            // Arsa için özel alanlar (sadece type "Arsa" ise dolu olacak)
            zoningStatus,
            landType,
            deedStatus,
            adaNumber,
            parcelNumber,
            buildingCoefficient,
            // Harita koordinatları
            latitude,
            longitude
        });

        // Check if MongoDB is connected
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            // Save the product to the database
            await product.save();
            res.json({ message: "Ürün başarıyla eklendi", success: true });
        } else {
            // Demo mode - save to temporary storage
            const demoProperty = {
                _id: "demo_" + Date.now(),
                title,
                location,
                price,
                beds,
                baths,
                sqft,
                type,
                availability,
                description,
                amenities,
                image: imageUrls.length > 0 ? imageUrls : [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ],
                phone,
                zoningStatus,
                landType,
                deedStatus,
                adaNumber,
                parcelNumber,
                buildingCoefficient,
                latitude,
                longitude,
                createdAt: new Date()
            };
            
            demoPropertiesStorage.push(demoProperty);
            console.log("Demo mode: Product added to temporary storage:", { title, location, price, type });
            console.log("Total demo properties:", demoPropertiesStorage.length);
            res.json({ message: "Demo modunda ürün eklendi (veritabanına kaydedilmedi)", success: true });
        }
    } catch (error) {
        console.log("Error adding product: ", error);
        res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};

const listproperty = async (req, res) => {
    try {
        // Check if MongoDB is connected
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            const property = await Property.find();
            res.json({ property, success: true });
        } else {
            // Demo mode - return only user-added demo properties
            console.log("Demo mode: Returning", demoPropertiesStorage.length, "properties");
            res.json({ property: demoPropertiesStorage, success: true });
        }
    } catch (error) {
        console.log("Error listing products: ", error);
        res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};

const removeproperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.body.id);
        if (!property) {
            return res.status(404).json({ message: "Emlak bulunamadı", success: false });
        }
        return res.json({ message: "Emlak başarıyla kaldırıldı", success: true });
    } catch (error) {
        console.log("Error removing product: ", error);
        return res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};

const updateproperty = async (req, res) => {
    try {
        const { id, title, location, price, beds, baths, sqft, type, availability, description, amenities, phone, zoningStatus, landType, deedStatus, adaNumber, parcelNumber, buildingCoefficient, latitude, longitude } = req.body;

        const property = await Property.findById(id);
        if (!property) {
            console.log("Property not found with ID:", id); // Debugging line
            return res.status(404).json({ message: "Emlak bulunamadı", success: false });
        }

        if (!req.files) {
            // No new images provided
            property.title = title;
            property.location = location;
            property.price = price;
            property.beds = beds;
            property.baths = baths;
            property.sqft = sqft;
            property.type = type;
            property.availability = availability;
            property.description = description;
            property.amenities = amenities;
            property.phone = phone;
            // Arsa için özel alanları güncelle
            property.zoningStatus = zoningStatus;
            property.landType = landType;
            property.deedStatus = deedStatus;
            property.adaNumber = adaNumber;
            property.parcelNumber = parcelNumber;
            property.buildingCoefficient = buildingCoefficient;
            // Harita koordinatlarını güncelle
            property.latitude = latitude;
            property.longitude = longitude;
            // Keep existing images
            await property.save();
            return res.json({ message: "Emlak başarıyla güncellendi", success: true });
        }

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        // Upload images to ImageKit and delete after upload
        let imageUrls = [];
        
        if (imagekit) {
            try {
                imageUrls = await Promise.all(
                    images.map(async (item) => {
                        const result = await imagekit.upload({
                            file: fs.readFileSync(item.path),
                            fileName: item.originalname,
                            folder: "Property",
                        });
                        fs.unlink(item.path, (err) => {
                            if (err) console.log("Error deleting the file: ", err);
                        });
                        return result.url;
                    })
                );
            } catch (error) {
                console.log("ImageKit upload error:", error);
                // Use placeholder images if ImageKit fails
                imageUrls = [
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
                ];
                
                // Clean up uploaded files
                images.forEach(item => {
                    fs.unlink(item.path, (err) => {
                        if (err) console.log("Error deleting the file: ", err);
                    });
                });
            }
        } else {
            // Use placeholder images when ImageKit is not available
            imageUrls = [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800"
            ];
            
            // Clean up uploaded files
            images.forEach(item => {
                fs.unlink(item.path, (err) => {
                    if (err) console.log("Error deleting the file: ", err);
                });
            });
        }

        property.title = title;
        property.location = location;
        property.price = price;
        property.beds = beds;
        property.baths = baths;
        property.sqft = sqft;
        property.type = type;
        property.availability = availability;
        property.description = description;
        property.amenities = amenities;
        property.image = imageUrls;
        property.phone = phone;
        // Arsa için özel alanları güncelle
        property.zoningStatus = zoningStatus;
        property.landType = landType;
        property.deedStatus = deedStatus;
        property.adaNumber = adaNumber;
        property.parcelNumber = parcelNumber;
        property.buildingCoefficient = buildingCoefficient;
        // Harita koordinatlarını güncelle
        property.latitude = latitude;
        property.longitude = longitude;

        await property.save();
        res.json({ message: "Emlak başarıyla güncellendi", success: true });
    } catch (error) {
        console.log("Error updating product: ", error);
        res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};

const singleproperty = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if MongoDB is connected
        const isMongoConnected = mongoose.connection.readyState === 1;
        
        if (isMongoConnected) {
            // Validate ObjectId format
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Geçersiz emlak ID formatı", success: false });
            }
            
            const property = await Property.findById(id);
            if (!property) {
                return res.status(404).json({ message: "Emlak bulunamadı", success: false });
            }
            res.json({ property, success: true });
        } else {
            // Demo mode - search only in user-added demo properties
            const property = demoPropertiesStorage.find(p => p._id === id);
            
            if (!property) {
                return res.status(404).json({ message: "Emlak bulunamadı", success: false });
            }
            
            console.log("Demo mode: Returning single property:", property.title);
            res.json({ property, success: true });
        }
    } catch (error) {
        console.log("Error fetching property:", error);
        res.status(500).json({ message: "Sunucu hatası", success: false });
    }
};

export { addproperty, listproperty, removeproperty, updateproperty , singleproperty};