import PDFDocument from "pdfkit";

const generateReceipt = (payment, res) => {

    const doc = new PDFDocument({

        margin: 50

    });

    res.setHeader(

        "Content-Type",

        "application/pdf"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename=${payment.receiptNumber}.pdf`

    );

    doc.pipe(res);

    /*
    ===========================================
    Header
    ===========================================
    */

    doc

        .fontSize(24)

        .text("Library Management System", {

            align: "center"

        });

    doc.moveDown();

    doc

        .fontSize(18)

        .text("Payment Receipt", {

            align: "center"

        });

    doc.moveDown(2);

    /*
    ===========================================
    Receipt Details
    ===========================================
    */

    doc.fontSize(12);

    doc.text(`Receipt No : ${payment.receiptNumber}`);

    doc.text(`Date : ${new Date(payment.paidAt).toLocaleString()}`);

    doc.moveDown();

    doc.text(`Student : ${payment.student.fullname}`);

    doc.text(`Email : ${payment.student.email}`);

    doc.moveDown();

    doc.text(`Plan : ${payment.plan.name}`);

    doc.text(`Amount : ₹${payment.amount}`);

    doc.text(`Payment Method : ${payment.paymentMethod}`);

    doc.text(`Status : ${payment.status}`);

    if (payment.transactionId) {

        doc.text(`Transaction ID : ${payment.transactionId}`);

    }

    doc.moveDown(2);

    /*
    ===========================================
    Footer
    ===========================================
    */

    doc

        .fontSize(10)

        .text(

            "Thank you for choosing our Library.",

            {

                align: "center"

            }

        );

    doc.end();

};

export default generateReceipt;