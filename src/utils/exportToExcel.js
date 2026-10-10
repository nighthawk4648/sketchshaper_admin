import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate a binary string representing the workbook
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Create a Blob from the binary string
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Save the file using FileSaver
    saveAs(blob, `${fileName}.xlsx`);
};

export const exportToCsv = (data, fileName) => {
    // Convert the data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Convert the worksheet to CSV
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

    // Create a Blob from the CSV string
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });

    // Save the file using FileSaver
    saveAs(blob, `${fileName}.csv`);
};

const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
};
