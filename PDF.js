const puppeteer = require('puppeteer');
const fs = require('fs');

const base64Image = fs.readFileSync(`${process.cwd()}\\public\\images\\LogoReducido.jpg`).toString('base64');
const imageSrc = `data:image/png;base64,${base64Image}`;

const cssContent = fs.readFileSync(`${process.cwd()}\\public\\stylesheets/PDF.css`, 'utf-8');

async function generatePDF(num_emp, areaEmp, NombreEmp, mobData) {
    const mobiliario = mobData || [];

    var htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>
            <%= title%>
        </title>
        <meta http-equiv="Expires" content="0">
        <meta http-equiv="Last-Modified" content="0">
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <style>${cssContent}</style>
    </head>
    <body>
        <style>
            table{
                border-collapse: collapse;
            }

            th, td {
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                width: 50%;
            }
        </style>
            <main class="Seccion">
                <table style="width: 100%;">               
                    <tbody>`;

    mobiliario.forEach(mobi => {
        htmlContent +=
            `<tr>
                        <td>${mobi.Num_Inventario}</td>
                        <td>${mobi.Descripcion}</td>
                    </tr>`;
    });

    htmlContent += `
                    </tbody>
                </table>
            </main>
    </body>
    </html>
    `;

    const outputPath = 'output.pdf';

    const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: {
            width: 750,
            height: 500,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false,
        }
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    await page.addStyleTag({ content: cssContent });

    await page.emulateMediaType("screen");

    await page.pdf({
        path: outputPath,
        format: 'Letter',
        displayHeaderFooter: true,
        headerTemplate: `
        <style>
            table{
                border-collapse: collapse;
            }

            th {
                border-top: 2px solid black;
                border-bottom: 2px solid black;
                width: 50%;
            }
        </style>
        <div style="width: 100%;">
            <center style="width: 100%;">
                <div style="font-size: 8px; width: 100%;">
                    <div style="display: flex; border-bottom: solid 1px; justify-content: space-evenly; align-items: center; width: 100%;">
                        <div style="flex: 1; padding: 0 32px; float: left; max-width: 20%;">
                            <img src="${imageSrc}" height="100px" width="auto" alt="Logo de la empresa">
                        </div>  
                        <div style="flex: 1; padding: 0 32px; width: 45%;">
                            <center><b><p style="font-size: 10px;">"INSTITUTO CANADIENSE CLARAC"</p></b><p>RESPONSIVA DE MOBILIARIO</p></center>
                        </div>
                        <div style="flex: 1; padding: 0 32px; float:right; width: auto;">
                            <b>FECHA: </b>10-Junio-23
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-evenly; align-items: center; width: 100%;">
                        <div style="flex: 1; padding: 0 32px; width:40%">
                            <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>Nombre: </b></label>${NombreEmp}
                        </div>
                        <div style="flex: 1; padding: 0 32px; width:40%">
                            <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>Área: </b></label>${areaEmp}
                        </div>
                        <div style="flex: 1; padding: 0 32px; width:20%">
                            <label style="display: block; font-weight: 700; text-transform: uppercase; margin-top: 10px;"><b>No. Empleado: </b></label>${num_emp}
                        </div>
                    </div>
                </div>
                <table style="font-size: 10px; padding-top: 10px; width: 95%;">
                    <thead>
                        <tr id="firstrow">
                            <th>No. INVENTARIO</th>
                            <th>DESCRIPCIÓN</th>
                        </tr>
                    </thead>        
                </table>         
            </center>
        </div>
        `,
        footerTemplate: `
        <center style="font-size: 8px; display: flex; justify-content: space-evenly; align-items: center; width: 100%;">
            <div style="display: inline-flex; align-items: center; flex-direction: column; padding: 0 2rem; width:45%;">
                <div style="border-bottom: 1px solid; width: 100%;">.
                </div>
                <p><b>REALIZÓ</b></p>
            </div>
            <div style="display: inline-flex; align-items: center; flex-direction: column; padding: 0 2rem; width:45%;">
                <div style="border-bottom: 1px solid; width: 100%;">
                    <span>${NombreEmp}</span>
                </div>
                <p><b>RESPONSABLE</b></p>
            </div>
        </center>    
        `,
        printBackground: true,
        margin: { left: "0.5cm", top: "5.69cm", right: "0.5cm", bottom: "3cm" }
    });

    await browser.close();

    console.log(`PDF generado exitosamente en: ${outputPath}`);
}

generatePDF().catch(error => {
    console.error('Error al generar el PDF:', error);
});

module.exports = {
    generatePDF
};