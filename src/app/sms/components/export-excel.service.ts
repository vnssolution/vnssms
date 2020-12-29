import { Injectable } from '@angular/core';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { saveAs } from 'file-saver';
import * as logo from './myLogo.js';

@Injectable({
  providedIn: 'root'
})

export class ExportExcelService {
 
  constructor() { }

public exportExcel(excelData, type) {
    const workbook = new Excel.Workbook();
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;
    let worksheet = workbook.addWorksheet(type+'Data');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    worksheet.mergeCells('G1:H4');
    let d = new Date();
    let m= d.getMonth();
    var month = m*100/100 + 1;
    let date = d.getDate() + '-' + month + '-' + d.getFullYear();
    let dateCell = worksheet.getCell('G1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

   // Add Image
    let myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'png',
    }); 
    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    //Blank Row 
    worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      }
    })

    // Adding Data with Conditional Formatting
    data.forEach(d => {
      let row = worksheet.addRow(d);

      let sales = row.getCell(6);
      let color = 'FF99FF99';
      if (+sales.value < 200000) {
        color = 'FF9999'
      }

      sales.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      }
    }
    );

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow(['Report Generated from VNSSMS Solutions at ' + date]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    workbook.xlsx.writeBuffer().then( data => {
      const blob = new Blob( [data], {type: "application/octet-stream"} );
      saveAs( blob, title +'.xlsx');
   });
   

  }

}
