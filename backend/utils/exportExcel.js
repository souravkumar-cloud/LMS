import ExcelJS from "exceljs";

const exportExcel = async ({

    fileName,

    sheetName,

    columns,

    rows,

    res

}) => {

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(

        sheetName

    );

    worksheet.columns = columns;

    worksheet.addRows(rows);

    // Style Header

    worksheet.getRow(1).font = {

        bold: true

    };

    worksheet.getRow(1).alignment = {

        horizontal: "center"

    };

    worksheet.columns.forEach(column => {

        column.width = 20;

    });

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename=${fileName}.xlsx`

    );

    await workbook.xlsx.write(res);

    res.end();

};

export default exportExcel;