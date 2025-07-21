import { cloudinary } from "@/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { transformationStringFromObject } from "@cloudinary/url-gen/index";
import type { FC } from "react";

export const CloudinaryImage: FC<{
  publicId: string;
  width?: number;
  height?: number;
  type?: "thumb" | "fit";
}> = ({ publicId, width, height, type = "fit" }) => {
  const transformation = transformationStringFromObject(
    width && height
      ? [
          {
            crop: type,
            width: width,
            height: height,
          },
        ]
      : []
  );

  const myImage = cloudinary.image(publicId);
  myImage.addTransformation(transformation);

  return <AdvancedImage cldImg={myImage} />;
};
