import cloudinary, { isCloudinaryServerConfigured } from "../config/cloudinary";
import { products } from "../../src/data/products";

/**
 * Bulk migration script to upload all initial seed product images into Cloudinary
 */
async function seedCloudinaryImages() {
  console.log("🚀 Starting Cloudinary Bulk Image Migration...");

  if (!isCloudinaryServerConfigured()) {
    console.error(
      "❌ Cloudinary is not configured. Please populate VITE_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file."
    );
    process.exit(1);
  }

  let totalUploaded = 0;

  for (const prod of products) {
    console.log(`\n📦 Processing Product: ${prod.name} (${prod.id})`);

    // 1. Upload Main & Hover Images
    const updatedImages: [string, string] = ["", ""];
    for (let i = 0; i < prod.images.length; i++) {
      const imgUrl = prod.images[i];
      if (imgUrl && !imgUrl.includes("res.cloudinary.com")) {
        try {
          console.log(`  Uploading Image [${i + 1}]: ${imgUrl.substring(0, 50)}...`);
          const res = await cloudinary.uploader.upload(imgUrl, {
            folder: "fashion_ecom/catalog",
            public_id: `${prod.slug}-${i === 0 ? "main" : "hover"}`,
            overwrite: true,
          });
          updatedImages[i] = res.secure_url;
          totalUploaded++;
          console.log(`  ✓ Cloudinary URL: ${res.secure_url}`);
        } catch (err: any) {
          console.error(`  ❌ Failed to upload image [${i + 1}]:`, err.message);
          updatedImages[i] = imgUrl;
        }
      } else {
        updatedImages[i] = imgUrl;
      }
    }

    // 2. Upload Gallery Images
    const updatedGallery: string[] = [];
    for (let g = 0; g < prod.galleryImages.length; g++) {
      const gUrl = prod.galleryImages[g];
      if (gUrl && !gUrl.includes("res.cloudinary.com")) {
        try {
          console.log(`  Uploading Gallery Image [${g + 1}]: ${gUrl.substring(0, 50)}...`);
          const res = await cloudinary.uploader.upload(gUrl, {
            folder: "fashion_ecom/gallery",
            public_id: `${prod.slug}-gallery-${g + 1}`,
            overwrite: true,
          });
          updatedGallery.push(res.secure_url);
          totalUploaded++;
          console.log(`  ✓ Cloudinary URL: ${res.secure_url}`);
        } catch (err: any) {
          console.error(`  ❌ Failed to upload gallery image [${g + 1}]:`, err.message);
          updatedGallery.push(gUrl);
        }
      } else {
        updatedGallery.push(gUrl);
      }
    }
  }

  console.log(`\n🎉 Bulk Cloudinary Migration Completed! Total uploaded: ${totalUploaded} images.`);
}

seedCloudinaryImages().catch(console.error);
