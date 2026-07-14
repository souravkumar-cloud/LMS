import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {

    try {

        const logs = await AuditLog.find()

            .populate(

                "admin",

                "fullname email"

            )

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: logs.length,

            logs

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

export const filterAuditLogs = async (req, res) => {

    try {

        const {

            module,

            action

        } = req.query;

        const filter = {};

        if (module) {

            filter.module = module;

        }

        if (action) {

            filter.action = action;

        }

        const logs = await AuditLog.find(filter)

            .populate(

                "admin",

                "fullname email"

            )

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: logs.length,

            logs

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};