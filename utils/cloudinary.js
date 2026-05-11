export const uploadImage = async (file) => {
  const { v2: cloudinary } = await import("cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary.uploader.upload(file.tempFilePath);
};
