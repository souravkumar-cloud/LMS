import PDFDocument from "pdfkit";

const generatePDFReport = (

    title,

    columns,

    rows,

    res

) => {

    const doc = new PDFDocument({

        margin:40

    });

    res.setHeader(

        "Content-Type",

        "application/pdf"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename=${title}.pdf`

    );

    doc.pipe(res);

    doc

        .fontSize(20)

        .text(

            "Library Management System",

            {

                align:"center"

            }

        );

    doc.moveDown();

    doc

        .fontSize(16)

        .text(

            title,

            {

                align:"center"

            }

        );

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(

        columns.join(" | ")

    );

    doc.moveDown();

    rows.forEach(row=>{

        doc.text(

            Object.values(row).join(" | ")

        );

    });

    doc.end();

};

export default generatePDFReport;