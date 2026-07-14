import AuditLog from "../models/AuditLog.js";

const createAuditLog = async ({

    admin,

    action,

    module,

    targetId = null,

    details = {},

    req

}) => {

    try {

        await AuditLog.create({

            admin,

            action,

            module,

            targetId,

            details,

            ipAddress: req.ip,

            userAgent: req.headers["user-agent"]

        });

    }

    catch (error) {

        console.log(

            "Audit Log Error:",

            error.message

        );

    }

};

export default createAuditLog;