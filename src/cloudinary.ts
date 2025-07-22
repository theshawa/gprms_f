import { Cloudinary } from "@cloudinary/url-gen";

export const cloudinary = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD },
});

export const getCloudinaryImageUrl = (publicId: string) => {
  return cloudinary.image(publicId).toURL();
};
