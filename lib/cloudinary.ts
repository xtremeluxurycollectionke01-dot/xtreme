import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(
  file: Buffer | string,
  folder: string = 'products'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryUploadResult);
      }
    );
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: number;
}): string {
  const { width, height, crop = 'fill', quality = 'auto' } = options || {};
  let url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
  
  if (width || height || quality) {
    url += 'q_auto,f_auto/';
    if (width) url += `w_${width},`;
    if (height) url += `h_${height},`;
    if (crop) url += `c_${crop},`;
  }
  
  url += publicId;
  return url;
}

export default cloudinary;