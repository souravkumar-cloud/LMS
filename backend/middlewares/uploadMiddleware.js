import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({

    cloudinary,

    params: {

        folder: "library-management-system",

        allowed_formats: [

            "jpg",

            "jpeg",

            "png",

            "webp"

        ],

        transformation: [

            {

                width: 500,

                height: 500,

                crop: "limit"

            }

        ]

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 2 * 1024 * 1024

    },

    fileFilter: (req, file, cb) => {

        if (

            file.mimetype.startsWith("image/")

        ) {

            cb(null, true);

        }

        else {

            cb(

                new Error("Only image files are allowed"),

                false

            );

        }

    }

});

export default upload;