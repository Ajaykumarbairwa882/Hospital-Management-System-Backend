import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dqfhn7rw3",
  api_key: "382695276612379",
  api_secret: "3XWIpGNiRSe2K2Cs2t9-fUtPPY0",
});

export const uploadImage = async (file, folder = "uploads") => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    const uploadSource =
      typeof file === "string" ? file : file.tempFilePath || file.path;

    if (!uploadSource) {
      throw new Error("Invalid image source");
    }

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
    });

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};
