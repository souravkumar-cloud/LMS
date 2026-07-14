import LibrarySetting from "../models/LibrarySetting.js";

export const getLibrarySettings = async (req, res) => {

    try {

        let settings = await LibrarySetting.findOne();

        if (!settings) {

            settings = await LibrarySetting.create({});

        }

        res.status(200).json({

            success: true,

            settings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const updateLibrarySettings = async (req, res) => {

    try {
        console.log(req.body);
        let settings = await LibrarySetting.findOne();

        if (!settings) {

            settings = await LibrarySetting.create({});

        }

        Object.assign(settings, req.body);

        await settings.save();

        res.status(200).json({

            success: true,

            message: "Library Settings Updated Successfully",

            settings

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
}
