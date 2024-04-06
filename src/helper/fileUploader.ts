import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

//! using multer to parse the file and save it to the uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

//! Image  upload to cloudinary
cloudinary.config({
  cloud_name: "dpdpsqybu",
  api_key: "789654295538195",
  api_secret: "9mFDME3KoMtxs4INmplwp_f2ezQ",
});
const uploadToCloudinary = async (
  file: any
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, rejects) => {
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.originalname },
      function (error, result) {
        //: delete file from uploads folder
        fs.unlinkSync(file.path);
        if (error) {
          rejects(error);
        } else {
          resolve(result!);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
