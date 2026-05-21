import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const config = useRuntimeConfig();

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });
}

export function getCloudinary() {
  return cloudinary;
}

configureCloudinary();

export default cloudinary;
