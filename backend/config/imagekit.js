import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

let imagekit = null;

// ImageKit is optional - only initialize if all credentials are provided
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
  try {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    console.log("ImageKit connected successfully!");
  } catch (error) {
    console.log("ImageKit connection failed:", error.message);
  }
} else {
  console.log("ImageKit credentials not provided - image upload will be disabled");
}

export default imagekit;