import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import QRSession from "../models/QRSession.js";

/*
==========================================================
Generate Dynamic QR
(Admin Only)
==========================================================
*/

export const generateQR = async (req, res) => {

    try {

        // QR valid for 60 seconds

        const expiresAt = new Date(

            Date.now() + 60 * 1000

        );

        const token = uuidv4();

        await QRSession.create({

            token,

            expiresAt,

            createdBy: req.user.id

        });

        const qrImage = await QRCode.toDataURL(

            JSON.stringify({

                token

            })

        );

        res.status(200).json({

            success: true,

            expiresAt,

            qrImage

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/*
==========================================================
Verify QR
==========================================================
*/

export const verifyQR = async (req, res) => {

    try {

        const { token } = req.body;

        const qrSession = await QRSession.findOne({

            token,

            isActive: true

        });

        if (!qrSession) {

            return res.status(400).json({

                success: false,

                message: "Invalid QR Code"

            });

        }

        if (new Date() > qrSession.expiresAt) {

            return res.status(400).json({

                success: false,

                message: "QR Code Expired"

            });

        }

        res.status(200).json({

            success: true,

            message: "QR Verified"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};